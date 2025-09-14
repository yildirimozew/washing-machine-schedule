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
  Button
} from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import MachineSelector from './components/MachineSelector';
import TimeSlotGrid from './components/TimeSlotGrid';

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

// Load reservations from localStorage and clean up old ones
const loadReservations = () => {
  try {
    const saved = localStorage.getItem('washingMachineReservations');
    if (saved) {
      const reservations = JSON.parse(saved);
      // Clean up reservations older than 7 days
      const cleanedReservations = cleanOldReservations(reservations);
      return cleanedReservations;
    }
  } catch (error) {
    console.error('Error loading reservations from localStorage:', error);
  }
  return {
    machine1: [],
    machine2: [],
    dryer: []
  };
};

// Clean up reservations older than 7 days
const cleanOldReservations = (reservations) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const cleaned = {};
  Object.keys(reservations).forEach(machine => {
    cleaned[machine] = reservations[machine].filter(reservation => {
      if (!reservation.createdAt) return true; // Keep reservations without timestamp for backward compatibility
      const reservationDate = new Date(reservation.createdAt);
      return reservationDate > sevenDaysAgo;
    });
  });
  
  return cleaned;
};

// Save reservations to localStorage
const saveReservations = (reservations) => {
  try {
    localStorage.setItem('washingMachineReservations', JSON.stringify(reservations));
  } catch (error) {
    console.error('Error saving reservations to localStorage:', error);
  }
};

const MainApp = () => {
  const { isAuthenticated, isLoading, displayName } = useAuth();
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [reservations, setReservations] = useState(loadReservations);

  // Save reservations to localStorage whenever they change
  useEffect(() => {
    saveReservations(reservations);
  }, [reservations]);

  const handleMachineSelect = (machine) => {
    setSelectedMachine(machine);
  };

  const handleBackToSelection = () => {
    setSelectedMachine(null);
  };

  const clearAllReservations = () => {
    if (window.confirm('Are you sure you want to clear all reservations?')) {
      setReservations({
        machine1: [],
        machine2: [],
        dryer: []
      });
    }
  };

  const addReservation = (machineType, reservation) => {
    const reservationWithTimestamp = {
      ...reservation,
      userName: displayName, // Use the user's display name
      createdAt: new Date().toISOString(),
      id: Date.now() + Math.random() // Simple unique ID
    };
    
    setReservations(prev => ({
      ...prev,
      [machineType]: [...prev[machineType], reservationWithTimestamp]
    }));
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