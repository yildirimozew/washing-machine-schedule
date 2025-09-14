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

const TimeSlotGrid = ({ selectedMachine, reservations, onBack, onAddReservation, onDeleteReservation, currentUserId }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Generate hour markers for the timeline
  const generateHourMarkers = () => {
    const markers = [];
    for (let hour = 6; hour <= 23; hour++) {
      markers.push({
        hour,
        label: `${hour.toString().padStart(2, '0')}:00`,
        position: ((hour - 6) / 17) * 100 // 17 hours total (6 AM to 11 PM)
      });
    }
    return markers;
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hourMarkers = generateHourMarkers();

  const getMachineInfo = () => {
    const info = {
      machine1: { name: 'Washing Machine 1', duration: 1.5, icon: LocalLaundryService, color: '#1976d2' },
      machine2: { name: 'Washing Machine 2', duration: 1.5, icon: LocalLaundryService, color: '#1976d2' },
      dryer: { name: 'Dryer', duration: 2, icon: DryCleaning, color: '#ff9800' }
    };
    return info[selectedMachine];
  };

  // Helper function to convert time string to minutes
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to convert minutes to time string
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Convert time to position percentage on timeline (6 AM = 0%, 11 PM = 100%)
  const timeToPosition = (timeStr) => {
    const minutes = timeToMinutes(timeStr);
    const startMinutes = 6 * 60; // 6 AM
    const endMinutes = 23 * 60; // 11 PM
    const totalMinutes = endMinutes - startMinutes;
    return ((minutes - startMinutes) / totalMinutes) * 100;
  };

  // Get reservations for a specific day
  const getDayReservations = (day) => {
    return reservations.filter(reservation => reservation.day === day);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setDialogOpen(true);
  };

  const validateTimeRange = () => {
    if (!startTime || !endTime) return { isValid: false, error: 'Please enter both start and end times' };
    
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    if (startMinutes >= endMinutes) {
      return { isValid: false, error: 'End time must be after start time' };
    }
    
    if (startMinutes < 6 * 60 || endMinutes > 23 * 60) {
      return { isValid: false, error: 'Time must be between 6:00 and 23:00' };
    }
    
    // Check for conflicts with existing reservations
    const hasConflict = reservations.some(reservation => {
      if (reservation.day !== selectedDay) return false;
      const resStartMinutes = timeToMinutes(reservation.startTime);
      const resEndMinutes = timeToMinutes(reservation.endTime);
      
      // Check if new reservation overlaps with existing one
      return !(endMinutes <= resStartMinutes || startMinutes >= resEndMinutes);
    });
    
    if (hasConflict) {
      return { isValid: false, error: 'This time conflicts with an existing reservation' };
    }
    
    return { isValid: true, error: null };
  };

  const handleSaveReservation = () => {
    if (!selectedDay || !startTime || !endTime) return;

    const validation = validateTimeRange();
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    onAddReservation({
      day: selectedDay,
      startTime: startTime,
      endTime: endTime,
      machine: selectedMachine,
      duration: getMachineInfo().duration
    });

    setSelectedDay(null);
    setStartTime('');
    setEndTime('');
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

      {/* Instructions */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>To add:</strong> Click on a day column header to make a reservation.<br />
        <strong>To delete:</strong> Click on your own reservations (highlighted in red) to remove them.
      </Alert>

      {/* Continuous Timeline */}
      <Card>
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 800 }}>
              {/* Time axis header */}
              <Box sx={{ 
                position: 'relative', 
                height: 40, 
                mb: 2, 
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                border: 1,
                borderColor: '#e0e0e0'
              }}>
                {hourMarkers.map(marker => (
                  <Box
                    key={marker.hour}
                    sx={{
                      position: 'absolute',
                      left: `${marker.position}%`,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      transform: 'translateX(-50%)',
                      borderLeft: marker.hour % 2 === 0 ? '1px solid #ddd' : 'none'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
                      {marker.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Day timeline rows */}
              {days.map(day => {
                const dayReservations = getDayReservations(day);
                return (
                  <Box key={day} sx={{ mb: 2 }}>
                    {/* Day header */}
                    <Box 
                      onClick={() => handleDayClick(day)}
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        p: 1,
                        backgroundColor: selectedDay === day ? machineInfo.color : '#f5f5f5',
                        color: selectedDay === day ? 'white' : 'inherit',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: selectedDay === day ? machineInfo.color : '#e0e0e0',
                          transform: 'translateX(4px)',
                        }
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 100 }}>
                        {day}
                      </Typography>
                      <Typography variant="caption" color="inherit" sx={{ opacity: 0.7 }}>
                        Click to add reservation
                      </Typography>
                    </Box>

                    {/* Timeline bar */}
                    <Box sx={{
                      position: 'relative',
                      height: 50,
                      backgroundColor: '#f9f9f9',
                      border: 1,
                      borderColor: '#e0e0e0',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}>
                      {/* Hour grid lines */}
                      {hourMarkers.map(marker => (
                        <Box
                          key={`${day}-grid-${marker.hour}`}
                          sx={{
                            position: 'absolute',
                            left: `${marker.position}%`,
                            top: 0,
                            bottom: 0,
                            borderLeft: '1px solid #e8e8e8',
                            width: 1
                          }}
                        />
                      ))}

                      {/* Reservation blocks */}
                      {dayReservations.map((reservation, index) => {
                        const startPos = timeToPosition(reservation.startTime);
                        const endPos = timeToPosition(reservation.endTime);
                        const width = endPos - startPos;
                        const isOwnReservation = reservation.userId === currentUserId;
                        
                        return (
                          <Box
                            key={`${day}-reservation-${index}`}
                            onClick={() => {
                              if (isOwnReservation && onDeleteReservation) {
                                onDeleteReservation(reservation);
                              } else if (!isOwnReservation) {
                                alert(`This reservation belongs to ${reservation.userName}. You can only delete your own reservations.`);
                              }
                            }}
                            sx={{
                              position: 'absolute',
                              left: `${startPos}%`,
                              width: `${width}%`,
                              top: 4,
                              bottom: 4,
                              backgroundColor: isOwnReservation ? '#ffcdd2' : '#f5f5f5',
                              border: 1,
                              borderColor: isOwnReservation ? '#f44336' : '#bdbdbd',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              minWidth: 2,
                              cursor: isOwnReservation ? 'pointer' : 'default',
                              transition: 'all 0.2s ease',
                              zIndex: 2,
                              '&:hover': isOwnReservation ? {
                                backgroundColor: '#ef9a9a',
                                borderColor: '#e53935',
                                transform: 'scale(1.02)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              } : {}
                            }}
                            title={isOwnReservation ? 'Click to delete your reservation' : `Reserved by ${reservation.userName}`}
                          >
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontSize: '0.7rem', 
                                fontWeight: 'bold',
                                color: isOwnReservation ? '#d32f2f' : '#616161',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                px: 0.5
                              }}
                            >
                              {reservation.userName} ({reservation.startTime}-{reservation.endTime})
                            </Typography>
                          </Box>
                        );
                      })}
                      
                      {/* Click overlay for adding reservations */}
                      <Box
                        onClick={() => handleDayClick(day)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          cursor: 'pointer',
                          zIndex: 1,
                          '&:hover': {
                            backgroundColor: `${machineInfo.color}10`
                          }
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Reservation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Make Reservation for {selectedDay}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Creating reservation for {machineInfo.name} on {selectedDay}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Start Time"
              type="time"
              variant="outlined"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: "06:00",
                max: "23:00",
                step: "1800" // 30 minute intervals
              }}
              fullWidth
            />
            <TextField
              label="End Time"
              type="time"
              variant="outlined"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: "06:00",
                max: "23:00",
                step: "1800" // 30 minute intervals
              }}
              fullWidth
            />
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            Available hours: 6:00 AM - 11:00 PM
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false);
            setSelectedDay(null);
            setStartTime('');
            setEndTime('');
          }}>Cancel</Button>
          <Button 
            onClick={handleSaveReservation}
            variant="contained"
            disabled={!startTime || !endTime}
          >
            Save Reservation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeSlotGrid; 