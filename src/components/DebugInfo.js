import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Chip
} from '@mui/material';
import { ExpandMore, BugReport } from '@mui/icons-material';
import { isFirebaseEnabled } from '../config/firebase';
import reservationService from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';

const DebugInfo = () => {
  const [expanded, setExpanded] = useState(false);
  const [connectionTest, setConnectionTest] = useState(null);
  const [testing, setTesting] = useState(false);
  const { user, firebaseUser, isAuthenticated, isFirebaseAuthenticated } = useAuth();
  
  const currentDomain = window.location.origin;
  
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
  };
  const firebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

  const checkFirebaseAuth = () => {
    if (isFirebaseEnabled && auth) {
      console.log('Firebase Auth is enabled and configured');
      console.log('Firebase Auth instance:', auth);
      console.log('Current user:', firebaseUser);
    } else {
      console.error('Firebase Auth not properly configured');
    }
  };

  const testFirestoreConnection = async () => {
    setTesting(true);
    setConnectionTest(null);
    
    try {
      const result = await reservationService.testConnection();
      setConnectionTest(result);
      
      if (result.success) {
        console.log('Firestore connection test passed');
      } else {
        console.error('Firestore connection test failed:', result.error);
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionTest({ success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReport color="action" />
            <Typography variant="body2">
              Debug Info & Troubleshooting
            </Typography>
            {isDemo && <Chip label="Demo Mode" size="small" color="warning" />}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            
            {/* Configuration Status */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Configuration Status
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Firebase Config:</Typography>
                    <Chip 
                      label={firebaseConfigured ? 'Configured' : 'Not Configured'} 
                      size="small" 
                      color={firebaseConfigured ? 'success' : 'error'} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Firebase Auth:</Typography>
                    <Chip 
                      label={isFirebaseEnabled ? 'Enabled' : 'Disabled'} 
                      size="small" 
                      color={isFirebaseEnabled ? 'success' : 'error'} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Google Auth:</Typography>
                    <Chip 
                      label={isAuthenticated ? 'Signed In' : 'Not Signed In'} 
                      size="small" 
                      color={isAuthenticated ? 'success' : 'error'} 
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Firebase Auth:</Typography>
                    <Chip 
                      label={isFirebaseAuthenticated ? 'Authenticated' : 'Not Authenticated'} 
                      size="small" 
                      color={isFirebaseAuthenticated ? 'success' : 'error'} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Storage Mode:</Typography>
                    <Chip 
                      label={
                        isFirebaseEnabled && isFirebaseAuthenticated 
                          ? 'Online (Synced)' 
                          : isFirebaseEnabled 
                          ? 'Online (No Auth)'
                          : 'Offline (Local)'
                      } 
                      size="small" 
                      color={
                        isFirebaseEnabled && isFirebaseAuthenticated 
                          ? 'success' 
                          : isFirebaseEnabled 
                          ? 'warning'
                          : 'error'
                      } 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Current Domain:</Typography>
                    <Typography variant="caption">{currentDomain}</Typography>
                  </Box>

                  {user && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Google User ID:</Typography>
                      <Typography variant="caption">
                        {user.id ? `${user.id.substring(0, 10)}...` : 'None'}
                      </Typography>
                    </Box>
                  )}

                  {firebaseUser && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Firebase UID:</Typography>
                      <Typography variant="caption">
                        {firebaseUser.uid ? `${firebaseUser.uid.substring(0, 10)}...` : 'None'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Common Issues */}
            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                Common Issues & Solutions:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li><strong>Firebase not configured:</strong> Add Firebase environment variables to .env.local</li>
                <li><strong>Authentication disabled:</strong> Enable Google provider in Firebase Authentication</li>
                <li><strong>Domain not authorized:</strong> Add {currentDomain} to Firebase authorized domains</li>
                <li><strong>Firestore WebChannel errors:</strong> Check Firestore security rules and network connectivity</li>
                <li><strong>Permission denied:</strong> Update Firestore rules to allow authenticated users</li>
                <li><strong>Network issues:</strong> Check firewall/proxy settings blocking Firebase domains</li>
                <li><strong>Popup blocked:</strong> Allow popups for this site to enable sign-in</li>
              </ul>
            </Alert>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={checkFirebaseAuth}
              >
                Check Firebase Auth
              </Button>
              {firebaseConfigured && (
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={testFirestoreConnection}
                  disabled={testing}
                >
                  {testing ? 'Testing...' : 'Test Firestore'}
                </Button>
              )}
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => console.log('Environment variables:', process.env)}
              >
                Log Environment
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
              >
                Firebase Console
              </Button>
            </Box>

            {/* Connection Test Results */}
            {connectionTest && (
              <Alert severity={connectionTest.success ? 'success' : 'error'}>
                <Typography variant="subtitle2" gutterBottom>
                  Firestore Connection Test:
                </Typography>
                {connectionTest.success ? (
                  <span>✅ Connected successfully! Found {connectionTest.docCount} reservations.</span>
                ) : (
                  <span>❌ Connection failed: {connectionTest.error}</span>
                )}
                {connectionTest.code && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Error code: {connectionTest.code}
                  </Typography>
                )}
              </Alert>
            )}

            {/* Setup Instructions */}

            {firebaseConfigured && connectionTest && !connectionTest.success && (
              <Alert severity="warning">
                <Typography variant="subtitle2" gutterBottom>
                  Firestore Connection Issues:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li><strong>WebChannel errors:</strong> Usually indicate network/security rule issues</li>
                  <li><strong>Check Firestore rules:</strong> Ensure rules allow authenticated reads/writes</li>
                  <li><strong>Network connectivity:</strong> Verify Firebase domains aren't blocked</li>
                  <li><strong>Project status:</strong> Confirm Firestore is enabled in Firebase Console</li>
                </ul>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  💡 The app will work offline using local storage until connection is restored.
                </Typography>
              </Alert>
            )}

            {!firebaseConfigured && (
              <Alert severity="info">
                <Typography variant="subtitle2" gutterBottom>
                  To enable online sync across devices:
                </Typography>
                <ol style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>Create a Firebase project at <code>https://console.firebase.google.com/</code></li>
                  <li>Enable Firestore Database</li>
                  <li>Add these to your <code>.env.local</code> file:</li>
                  <ul style={{ marginTop: '8px' }}>
                    <li><code>REACT_APP_FIREBASE_API_KEY=your-api-key</code></li>
                    <li><code>REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com</code></li>
                    <li><code>REACT_APP_FIREBASE_PROJECT_ID=your-project-id</code></li>
                  </ul>
                  <li>Restart the development server</li>
                </ol>
              </Alert>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DebugInfo; 