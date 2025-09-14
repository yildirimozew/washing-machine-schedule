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

const DebugInfo = () => {
  const [expanded, setExpanded] = useState(false);
  
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'demo-client-id';
  const isDemo = clientId === 'demo-client-id';
  const googleLoaded = !!window.google;
  const currentDomain = window.location.origin;

  const checkGoogleAPI = () => {
    if (window.google && window.google.accounts) {
      console.log('Google API loaded successfully');
      console.log('Google accounts API:', window.google.accounts);
    } else {
      console.error('Google API not properly loaded');
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
                    <Typography variant="body2">Google Client ID:</Typography>
                    <Chip 
                      label={isDemo ? 'Not Configured' : 'Configured'} 
                      size="small" 
                      color={isDemo ? 'error' : 'success'} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Google API Loaded:</Typography>
                    <Chip 
                      label={googleLoaded ? 'Yes' : 'No'} 
                      size="small" 
                      color={googleLoaded ? 'success' : 'error'} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Current Domain:</Typography>
                    <Typography variant="caption">{currentDomain}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Client ID (masked):</Typography>
                    <Typography variant="caption">
                      {isDemo ? 'demo-client-id' : `${clientId.substring(0, 20)}...`}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Common Issues */}
            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                Common Issues & Solutions:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li><strong>Demo Mode:</strong> Set REACT_APP_GOOGLE_CLIENT_ID environment variable</li>
                <li><strong>Domain not authorized:</strong> Add {currentDomain} to Google Console authorized origins</li>
                <li><strong>API not enabled:</strong> Enable Google+ API in Google Cloud Console</li>
                <li><strong>Invalid Client ID:</strong> Check client ID format (should end with .apps.googleusercontent.com)</li>
              </ul>
            </Alert>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={checkGoogleAPI}
              >
                Check Google API
              </Button>
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
                onClick={() => window.open('https://console.developers.google.com/', '_blank')}
              >
                Google Console
              </Button>
            </Box>

            {/* Setup Instructions */}
            {isDemo && (
              <Alert severity="warning">
                <Typography variant="subtitle2" gutterBottom>
                  To enable Google login:
                </Typography>
                <ol style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>Create a <code>.env.local</code> file in your project root</li>
                  <li>Add: <code>REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here</code></li>
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