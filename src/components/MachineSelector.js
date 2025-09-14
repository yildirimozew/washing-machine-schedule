import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box
} from '@mui/material';
import {
  LocalLaundryService,
  DryCleaning
} from '@mui/icons-material';

const MachineSelector = ({ onMachineSelect }) => {
  const machines = [
    {
      id: 'machine1',
      name: 'Washing Machine 1',
      icon: LocalLaundryService,
      color: '#1976d2',
      duration: '1.5 hours'
    },
    {
      id: 'machine2',
      name: 'Washing Machine 2',
      icon: LocalLaundryService,
      color: '#1976d2',
      duration: '1.5 hours'
    },
    {
      id: 'dryer',
      name: 'Dryer',
      icon: DryCleaning,
      color: '#ff9800',
      duration: '2 hours'
    }
  ];

  return (
    <Grid container spacing={3} justifyContent="center">
      {machines.map((machine) => {
        const IconComponent = machine.icon;
        return (
          <Grid item xs={12} sm={6} md={4} key={machine.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              <CardActionArea
                onClick={() => onMachineSelect(machine.id)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: 3,
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    <IconComponent
                      sx={{
                        fontSize: 64,
                        color: machine.color,
                      }}
                    />
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {machine.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {machine.duration}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MachineSelector; 