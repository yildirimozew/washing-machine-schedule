import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Google Client ID - You'll need to replace this with your actual client ID
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'demo-client-id';

  useEffect(() => {
    // Load saved user data from localStorage
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

    // Initialize Google Sign-In
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeGoogleSignIn();
        }
      }, 100);
    }
  }, []);

  const initializeGoogleSignIn = () => {
    try {
      console.log('Initializing Google Sign-In with client ID:', GOOGLE_CLIENT_ID);
      
      if (GOOGLE_CLIENT_ID === 'demo-client-id') {
        console.warn('Using demo client ID - Google login will not work properly');
        alert('Demo mode: Please configure REACT_APP_GOOGLE_CLIENT_ID environment variable for Google login to work');
        setIsLoading(false);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
      });
      
      console.log('Google Sign-In initialized successfully');
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      alert(`Failed to initialize Google Sign-In: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = (response) => {
    try {
      console.log('Google response received:', response);
      
      if (!response.credential) {
        console.error('No credential in Google response');
        alert('Authentication failed: No credential received from Google');
        return;
      }

      // Decode the JWT token to get user info
      const tokenParts = response.credential.split('.');
      if (tokenParts.length !== 3) {
        console.error('Invalid JWT token format');
        alert('Authentication failed: Invalid token format');
        return;
      }

      const decoded = JSON.parse(atob(tokenParts[1]));
      console.log('Decoded token:', decoded);
      
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        credential: response.credential
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // If no display name is set, use the Google name as default
      if (!displayName) {
        const defaultDisplayName = decoded.given_name || decoded.name.split(' ')[0];
        setDisplayName(defaultDisplayName);
        localStorage.setItem('userDisplayName', defaultDisplayName);
      }
      
      console.log('Authentication successful for:', userData.email);
    } catch (error) {
      console.error('Error handling Google response:', error);
      alert(`Authentication failed: ${error.message}`);
    }
  };

  const signIn = () => {
    try {
      if (!window.google) {
        console.error('Google API not loaded');
        alert('Google API not loaded. Please refresh the page and try again.');
        return;
      }

      if (GOOGLE_CLIENT_ID === 'demo-client-id') {
        alert('Demo mode: Please configure a real Google OAuth Client ID to enable login');
        return;
      }

      console.log('Prompting for Google Sign-In...');
      window.google.accounts.id.prompt((notification) => {
        console.log('Google prompt notification:', notification);
        if (notification.isNotDisplayed()) {
          console.error('Google prompt not displayed:', notification.getNotDisplayedReason());
          alert(`Google Sign-In prompt not displayed: ${notification.getNotDisplayedReason()}`);
        } else if (notification.isSkippedMoment()) {
          console.warn('Google prompt skipped:', notification.getSkippedReason());
        }
      });
    } catch (error) {
      console.error('Error during sign in:', error);
      alert(`Sign-in error: ${error.message}`);
    }
  };

  const signOut = () => {
    setUser(null);
    setDisplayName('');
    localStorage.removeItem('user');
    localStorage.removeItem('userDisplayName');
    
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
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
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 