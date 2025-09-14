import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase only if configuration is available
let app = null;
let db = null;
let auth = null;
let isFirebaseEnabled = false;

try {
  // Check if all required config values are present
  const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
  const hasRequiredConfig = requiredKeys.every(key => firebaseConfig[key]);
  
  if (hasRequiredConfig) {
    console.log('Initializing Firebase with config:', {
      apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing',
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId
    });
    
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseEnabled = true;
    console.log('Firebase initialized successfully');
    
    // Add connection state monitoring
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('Network back online - Firestore should reconnect automatically');
      });
      
      window.addEventListener('offline', () => {
        console.log('Network offline - Firestore will use cached data');
      });
    }
    
  } else {
    console.warn('Firebase configuration incomplete - missing required keys');
    console.warn('Required keys:', requiredKeys);
    console.warn('Available keys:', Object.keys(firebaseConfig).filter(key => firebaseConfig[key]));
    console.warn('Running in offline mode with localStorage only');
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
  console.warn('Falling back to localStorage mode');
}

export { db, auth, isFirebaseEnabled }; 