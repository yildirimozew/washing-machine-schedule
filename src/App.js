import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  Chip
} from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import MachineSelector from './components/MachineSelector';
import TimeSlotGrid from './components/TimeSlotGrid';
import reservationService from './services/reservationService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});



const MainApp = () => {
  const { isAuthenticated, isLoading, displayName, user, firebaseUser, isFirebaseAuthenticated } = useAuth();
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [reservations, setReservations] = useState({
    machine1: [],
    machine2: [],
    dryer: []
  });
  const [connectionStatus, setConnectionStatus] = useState(reservationService.getStatus());

  // Set up real-time subscription to reservations
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('Setting up reservation subscription...');
    const unsubscribe = reservationService.subscribeToReservations((newReservations) => {
      console.log('Reservations updated:', newReservations);
      setReservations(newReservations);
    });

    // Update connection status
    setConnectionStatus(reservationService.getStatus());

    return () => {
      console.log('Cleaning up reservation subscription');
      unsubscribe();
    };
  }, [isAuthenticated]);

  const handleMachineSelect = (machine) => {
    setSelectedMachine(machine);
  };

  const handleBackToSelection = () => {
    setSelectedMachine(null);
  };

  const clearAllReservations = async () => {
    if (window.confirm('Are you sure you want to clear all reservations?')) {
      try {
        await reservationService.clearAllReservations();
        console.log('All reservations cleared');
      } catch (error) {
        console.error('Error clearing reservations:', error);
        alert('Failed to clear reservations. Please try again.');
      }
    }
  };

  const addReservation = async (machineType, reservation) => {
    const reservationData = {
      ...reservation,
      userName: displayName, // Use the user's display name
      userId: firebaseUser?.uid || user?.id || 'anonymous', // Use Firebase UID for Firestore auth
      googleUserId: user?.id, // Keep Google ID for reference
      userEmail: user?.email || firebaseUser?.email
    };
    
    try {
      console.log('Adding reservation with Firebase UID:', firebaseUser?.uid);
      await reservationService.addReservation(machineType, reservationData);
      console.log('Reservation added successfully');
    } catch (error) {
      console.error('Error adding reservation:', error);
      alert('Failed to add reservation. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography>Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🧺 Washing Machine Schedule
          </Typography>
          
          {/* Connection Status */}
          <Chip
            label={
              connectionStatus.firebaseEnabled && isFirebaseAuthenticated 
                ? 'Online (Synced)' 
                : connectionStatus.firebaseEnabled && !isFirebaseAuthenticated
                ? 'Online (Auth Required)'
                : 'Offline'
            }
            size="small"
            color={
              connectionStatus.firebaseEnabled && isFirebaseAuthenticated 
                ? 'success' 
                : connectionStatus.firebaseEnabled 
                ? 'warning'
                : 'error'
            }
            sx={{ 
              mr: 2, 
              color: 'white',
              '& .MuiChip-label': { color: 'white' }
            }}
          />
          
          <Button 
            color="inherit" 
            onClick={clearAllReservations}
            sx={{ mr: 2 }}
          >
            Clear All
          </Button>
          <UserProfile />
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ flexGrow: 1 }}>
          {!selectedMachine ? (
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom align="center">
                  Select a Machine
                </Typography>
                <MachineSelector onMachineSelect={handleMachineSelect} />
              </CardContent>
            </Card>
          ) : (
            <TimeSlotGrid
              selectedMachine={selectedMachine}
              reservations={reservations[selectedMachine]}
              onBack={handleBackToSelection}
              onAddReservation={(reservation) => addReservation(selectedMachine, reservation)}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App; 