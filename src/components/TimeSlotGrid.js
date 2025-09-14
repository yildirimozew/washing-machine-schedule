import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  LocalLaundryService,
  DryCleaning
} from '@mui/icons-material';

const TimeSlotGrid = ({ selectedMachine, reservations, onBack, onAddReservation }) => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userName, setUserName] = useState('');

  // Generate time slots from 6 AM to 11 PM (30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 23 && minute === 30) break; // Stop at 11:00 PM
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = generateTimeSlots();

  const getMachineInfo = () => {
    const info = {
      machine1: { name: 'Washing Machine 1', duration: 1.5, icon: LocalLaundryService, color: '#1976d2' },
      machine2: { name: 'Washing Machine 2', duration: 1.5, icon: LocalLaundryService, color: '#1976d2' },
      dryer: { name: 'Dryer', duration: 2, icon: DryCleaning, color: '#ff9800' }
    };
    return info[selectedMachine];
  };

  const isSlotReserved = (day, time) => {
    return reservations.some(reservation => 
      reservation.day === day && reservation.time === time
    );
  };

  const isSlotSelected = (day, time) => {
    return selectedSlots.some(slot => slot.day === day && slot.time === time);
  };

  const handleSlotClick = (day, time) => {
    const isCurrentlySelected = isSlotSelected(day, time);
    
    if (isCurrentlySelected) {
      // Remove slot
      setSelectedSlots(prev => prev.filter(slot => 
        !(slot.day === day && slot.time === time)
      ));
    } else if (!isSlotReserved(day, time)) {
      // Add slot
      setSelectedSlots(prev => [...prev, { day, time }]);
    }
  };

  const handleSaveReservation = () => {
    if (selectedSlots.length === 0 || !userName.trim()) return;

    selectedSlots.forEach(slot => {
      onAddReservation({
        day: slot.day,
        time: slot.time,
        userName: userName.trim(),
        machine: selectedMachine,
        duration: getMachineInfo().duration
      });
    });

    setSelectedSlots([]);
    setUserName('');
    setDialogOpen(false);
  };

  const machineInfo = getMachineInfo();
  const IconComponent = machineInfo.icon;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <IconComponent sx={{ fontSize: 32, color: machineInfo.color, mr: 1 }} />
        <Typography variant="h4">
          {machineInfo.name}
        </Typography>
        <Chip 
          label={`${machineInfo.duration} hours`} 
          sx={{ ml: 2 }}
          color="primary"
        />
      </Box>

      {/* Selected slots info */}
      {selectedSlots.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {selectedSlots.length} slot(s) selected. 
          <Button 
            variant="contained" 
            size="small" 
            sx={{ ml: 2 }}
            onClick={() => setDialogOpen(true)}
          >
            Make Reservation
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ ml: 1 }}
            onClick={() => setSelectedSlots([])}
          >
            Clear Selection
          </Button>
        </Alert>
      )}

      {/* Time slot grid */}
      <Card>
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Grid container spacing={1} sx={{ minWidth: 800 }}>
              {/* Header row with days */}
              <Grid item xs={2}>
                <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6">Time</Typography>
                </Box>
              </Grid>
              {days.map(day => (
                <Grid item xs={1.43} key={day}>
                  <Box sx={{ 
                    height: 60, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {day.substring(0, 3)}
                    </Typography>
                  </Box>
                </Grid>
              ))}

              {/* Time slots */}
              {timeSlots.map(time => (
                <React.Fragment key={time}>
                  <Grid item xs={2}>
                    <Box sx={{ 
                      height: 40, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#fafafa',
                      borderRadius: 1
                    }}>
                      <Typography variant="body2" fontWeight="medium">
                        {time}
                      </Typography>
                    </Box>
                  </Grid>
                  {days.map(day => {
                    const reserved = isSlotReserved(day, time);
                    const selected = isSlotSelected(day, time);
                    const reservation = reservations.find(r => r.day === day && r.time === time);
                    
                    return (
                      <Grid item xs={1.43} key={`${day}-${time}`}>
                        <Box
                          onClick={() => handleSlotClick(day, time)}
                          sx={{
                            height: 40,
                            border: 1,
                            borderColor: selected ? machineInfo.color : reserved ? '#f44336' : '#e0e0e0',
                            backgroundColor: reserved ? '#ffebee' : selected ? `${machineInfo.color}20` : 'white',
                            borderRadius: 1,
                            cursor: reserved ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: reserved ? '#f44336' : machineInfo.color,
                              backgroundColor: reserved ? '#ffebee' : `${machineInfo.color}30`,
                            }
                          }}
                        >
                          {reserved && (
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                              {reservation?.userName || 'Reserved'}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </React.Fragment>
              ))}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Reservation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Make Reservation</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You've selected {selectedSlots.length} time slot(s) for {machineInfo.name}.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Your Name"
            fullWidth
            variant="outlined"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveReservation}
            variant="contained"
            disabled={!userName.trim() || selectedSlots.length === 0}
          >
            Save Reservation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeSlotGrid; 