import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import DebugInfo from './DebugInfo';

const LoginPage = () => {
  const { signIn, isLoading } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card sx={{ textAlign: 'center', p: 4 }}>
        <CardContent>
          <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
            🧺
          </Typography>
          <Typography variant="h4" gutterBottom>
            Washing Machine Schedule
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please sign in with your Google account to access the washing machine scheduler
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<Google />}
            onClick={signIn}
            disabled={isLoading}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              textTransform: 'none'
            }}
          >
            {isLoading ? 'Loading...' : 'Sign in with Google'}
          </Button>
          
          <Typography variant="caption" display="block" sx={{ mt: 3, color: 'text.secondary' }}>
            Your Google account is used only for authentication.<br />
            No personal data is stored on our servers.
          </Typography>
        </CardContent>
      </Card>
      
      {/* Debug information for troubleshooting */}
      <Box sx={{ mt: 3 }}>
        <DebugInfo />
      </Box>
    </Container>
  );
};

export default LoginPage; 