import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    // Set up Firebase Auth state listener
    let unsubscribeAuth = () => {};
    
    if (isFirebaseEnabled && auth) {
      console.log('Setting up Firebase Auth state listener...');
      unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
        console.log('Firebase Auth state changed:', firebaseUser?.uid ? 'signed in' : 'signed out');
        setFirebaseUser(firebaseUser);
        
        if (firebaseUser) {
          // User signed in - extract user data from Firebase user
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            picture: firebaseUser.photoURL
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Set display name if not already set
          const savedDisplayName = localStorage.getItem('userDisplayName');
          if (!savedDisplayName) {
            const defaultDisplayName = firebaseUser.displayName?.split(' ')[0] || firebaseUser.email?.split('@')[0];
            setDisplayName(defaultDisplayName);
            localStorage.setItem('userDisplayName', defaultDisplayName);
          } else {
            setDisplayName(savedDisplayName);
          }
        } else {
          // User signed out
          setUser(null);
          setDisplayName('');
          localStorage.removeItem('user');
          localStorage.removeItem('userDisplayName');
        }
        
        setIsLoading(false);
      });
    } else {
      // Firebase not enabled - load from localStorage for demo mode
      console.log('Firebase not enabled, using localStorage only');
      const savedUser = localStorage.getItem('user');
      const savedDisplayName = localStorage.getItem('userDisplayName');
      
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setDisplayName(savedDisplayName || '');
        } catch (error) {
          console.error('Error loading saved user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('userDisplayName');
        }
      }
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      unsubscribeAuth();
    };
  }, []);

  const signIn = async () => {
    if (!isFirebaseEnabled || !auth) {
      alert('Firebase Authentication not configured. Please set up Firebase to enable login.');
      return;
    }

    try {
      console.log('Starting Firebase Google Sign-In...');
      const provider = new GoogleAuthProvider();
      
      // Add additional scopes if needed
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      console.log('Firebase Google Sign-In successful:', result.user.uid);
      
      // Firebase Auth state listener will handle the rest
    } catch (error) {
      console.error('Firebase Google Sign-In failed:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup was closed by user');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Sign-in popup was blocked by browser. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/network-request-failed') {
        alert('Network error during sign-in. Please check your connection and try again.');
      } else if (error.code === 'auth/internal-error') {
        alert('Authentication service error. Please try again later.');
      } else {
        alert(`Sign-in failed: ${error.message}`);
      }
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Firebase Auth if enabled
      if (isFirebaseEnabled && auth && firebaseUser) {
        console.log('Signing out from Firebase Auth...');
        await firebaseSignOut(auth);
        console.log('Firebase Auth sign-out successful');
      } else {
        // Firebase not enabled, just clear local state
        setUser(null);
        setDisplayName('');
        setFirebaseUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userDisplayName');
      }
      
      console.log('Sign-out completed');
    } catch (error) {
      console.error('Error during sign-out:', error);
      // Still clear local state even if Firebase sign-out fails
      setUser(null);
      setDisplayName('');
      setFirebaseUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userDisplayName');
    }
  };

  const updateDisplayName = (newDisplayName) => {
    setDisplayName(newDisplayName);
    localStorage.setItem('userDisplayName', newDisplayName);
  };

  const value = {
    user,
    displayName,
    isLoading,
    signIn,
    signOut,
    updateDisplayName,
    firebaseUser,
    isAuthenticated: !!user,
    isFirebaseAuthenticated: !!firebaseUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 