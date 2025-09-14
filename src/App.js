import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  AppBar,
  Toolbar
} from '@mui/material';
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

function App() {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [reservations, setReservations] = useState({
    machine1: [],
    machine2: [],
    dryer: []
  });

  const handleMachineSelect = (machine) => {
    setSelectedMachine(machine);
  };

  const handleBackToSelection = () => {
    setSelectedMachine(null);
  };

  const addReservation = (machineType, reservation) => {
    setReservations(prev => ({
      ...prev,
      [machineType]: [...prev[machineType], reservation]
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🧺 Washing Machine Schedule
          </Typography>
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
}

export default App; 