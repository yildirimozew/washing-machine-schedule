import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  where,
  getDocs
} from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../config/firebase';

class ReservationService {
  constructor() {
    this.listeners = new Map(); // Store Firestore listeners
    this.localStorageKey = 'washingMachineReservations';
  }

  // Clean up old reservations (older than 7 days)
  cleanOldReservations(reservations) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const cleaned = {};
    Object.keys(reservations).forEach(machine => {
      cleaned[machine] = reservations[machine].filter(reservation => {
        if (!reservation.createdAt) return true;
        const reservationDate = new Date(reservation.createdAt);
        return reservationDate > sevenDaysAgo;
      });
    });
    
    return cleaned;
  }

  // Load reservations from localStorage
  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem(this.localStorageKey);
      if (saved) {
        const reservations = JSON.parse(saved);
        return this.cleanOldReservations(reservations);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    return {
      machine1: [],
      machine2: [],
      dryer: []
    };
  }

  // Save reservations to localStorage
  saveToLocalStorage(reservations) {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(reservations));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Convert Firestore documents to reservation objects
  firestoreToReservation(doc) {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
    };
  }

  // Add a reservation
  async addReservation(machineType, reservation) {
    const reservationData = {
      ...reservation,
      machine: machineType,
      createdAt: new Date(),
      userId: reservation.userId || 'anonymous'
    };

    if (isFirebaseEnabled) {
      try {
        console.log('Adding reservation to Firestore:', reservationData);
        const docRef = await addDoc(collection(db, 'reservations'), reservationData);
        console.log('Reservation added to Firestore successfully:', docRef.id);
        return { id: docRef.id, ...reservationData };
      } catch (error) {
        console.error('Error adding to Firestore:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        if (error.code === 'permission-denied') {
          alert('Permission denied: Cannot add reservation. Check Firestore security rules.');
        } else if (error.code === 'unavailable') {
          alert('Database unavailable: Saving locally and will sync when online.');
        } else {
          console.error('Unknown Firestore error, using localStorage fallback');
        }
        
        // Fall back to localStorage
        return this.addToLocalStorage(machineType, reservationData);
      }
    } else {
      console.log('Firestore not enabled, adding to localStorage');
      return this.addToLocalStorage(machineType, reservationData);
    }
  }

  // Add reservation to localStorage (fallback)
  addToLocalStorage(machineType, reservation) {
    const reservationWithId = {
      ...reservation,
      id: Date.now() + Math.random(),
      createdAt: reservation.createdAt.toISOString()
    };

    const current = this.loadFromLocalStorage();
    current[machineType] = [...current[machineType], reservationWithId];
    this.saveToLocalStorage(current);
    
    return reservationWithId;
  }

  // Load all reservations
  async loadReservations() {
    if (isFirebaseEnabled) {
      try {
        // Load from Firestore
        const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const reservations = {
          machine1: [],
          machine2: [],
          dryer: []
        };

        querySnapshot.forEach((doc) => {
          const reservation = this.firestoreToReservation(doc);
          const machine = reservation.machine || 'machine1';
          if (reservations[machine]) {
            reservations[machine].push(reservation);
          }
        });

        // Also save to localStorage as backup
        this.saveToLocalStorage(reservations);
        return reservations;
      } catch (error) {
        console.error('Error loading from Firestore:', error);
        return this.loadFromLocalStorage();
      }
    } else {
      return this.loadFromLocalStorage();
    }
  }

  // Set up real-time listener for a specific machine
  subscribeToReservations(callback) {
    if (!isFirebaseEnabled) {
      console.log('Firestore not enabled, using localStorage only');
      // For localStorage mode, just call callback once with current data
      const reservations = this.loadFromLocalStorage();
      callback(reservations);
      return () => {}; // Return empty unsubscribe function
    }

    try {
      console.log('Setting up Firestore real-time listener...');
      const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          console.log('Firestore snapshot received, documents:', querySnapshot.size);
          const reservations = {
            machine1: [],
            machine2: [],
            dryer: []
          };

          querySnapshot.forEach((doc) => {
            const reservation = this.firestoreToReservation(doc);
            const machine = reservation.machine || 'machine1';
            if (reservations[machine]) {
              reservations[machine].push(reservation);
            }
          });

          // Also update localStorage
          this.saveToLocalStorage(reservations);
          callback(reservations);
        }, 
        (error) => {
          console.error('Firestore real-time listener error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          // Provide specific error guidance
          if (error.code === 'permission-denied') {
            console.error('Permission denied - check Firestore security rules');
            alert('Database access denied. Please check Firestore security rules or contact administrator.');
          } else if (error.code === 'unavailable') {
            console.error('Firestore service unavailable');
            alert('Database temporarily unavailable. Using offline mode.');
          } else {
            console.error('Unknown Firestore error, falling back to local storage');
          }
          
          // Fall back to localStorage
          const reservations = this.loadFromLocalStorage();
          callback(reservations);
        }
      );

      console.log('Firestore listener set up successfully');
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up Firestore listener:', error);
      console.error('Falling back to localStorage mode');
      alert('Failed to connect to online database. Using offline mode.');
      
      const reservations = this.loadFromLocalStorage();
      callback(reservations);
      return () => {};
    }
  }

  // Delete a reservation
  async deleteReservation(reservationId) {
    if (isFirebaseEnabled && typeof reservationId === 'string' && reservationId.length > 10) {
      try {
        await deleteDoc(doc(db, 'reservations', reservationId));
        console.log('Reservation deleted from Firestore');
        return true;
      } catch (error) {
        console.error('Error deleting from Firestore:', error);
      }
    }
    
    // Also remove from localStorage
    this.deleteFromLocalStorage(reservationId);
    return true;
  }

  // Delete from localStorage
  deleteFromLocalStorage(reservationId) {
    const current = this.loadFromLocalStorage();
    Object.keys(current).forEach(machine => {
      current[machine] = current[machine].filter(res => res.id !== reservationId);
    });
    this.saveToLocalStorage(current);
  }

  // Clear all reservations
  async clearAllReservations() {
    if (isFirebaseEnabled) {
      try {
        const q = query(collection(db, 'reservations'));
        const querySnapshot = await getDocs(q);
        
        const deletePromises = [];
        querySnapshot.forEach((docSnapshot) => {
          deletePromises.push(deleteDoc(doc(db, 'reservations', docSnapshot.id)));
        });
        
        await Promise.all(deletePromises);
        console.log('All reservations cleared from Firestore');
      } catch (error) {
        console.error('Error clearing Firestore:', error);
      }
    }
    
    // Also clear localStorage
    this.saveToLocalStorage({
      machine1: [],
      machine2: [],
      dryer: []
    });
  }

  // Test Firestore connection
  async testConnection() {
    if (!isFirebaseEnabled) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      console.log('Testing Firestore connection...');
      // Try to read from the reservations collection
      const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      console.log('Firestore connection test successful, documents:', querySnapshot.size);
      return { success: true, docCount: querySnapshot.size };
    } catch (error) {
      console.error('Firestore connection test failed:', error);
      return { success: false, error: error.message, code: error.code };
    }
  }

  // Get connection status
  getStatus() {
    return {
      firebaseEnabled: isFirebaseEnabled,
      mode: isFirebaseEnabled ? 'online' : 'offline'
    };
  }
}

// Export singleton instance
export default new ReservationService(); 