import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { AccountCircle, Edit } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user, displayName, updateDisplayName, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState(displayName);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    setTempDisplayName(displayName);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveProfile = () => {
    if (tempDisplayName.trim()) {
      updateDisplayName(tempDisplayName.trim());
      setEditDialogOpen(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    handleMenuClose();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
          {displayName || user?.name}
        </Typography>
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{ ml: 1 }}
        >
          {user?.picture ? (
            <Avatar src={user.picture} sx={{ width: 32, height: 32 }} />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
          <Typography variant="subtitle2" noWrap>
            {displayName || user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleEditProfile}>
          <Edit sx={{ mr: 2 }} />
          Edit Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          Sign Out
        </MenuItem>
      </Menu>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 1 }}>
            {user?.picture ? (
              <Avatar src={user.picture} sx={{ width: 64, height: 64, mr: 2 }} />
            ) : (
              <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                <AccountCircle />
              </Avatar>
            )}
            <Box>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
          
          <TextField
            autoFocus
            margin="dense"
            label="Display Name"
            fullWidth
            variant="outlined"
            value={tempDisplayName}
            onChange={(e) => setTempDisplayName(e.target.value)}
            placeholder="Enter your display name"
            helperText="This name will appear on your reservations"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveProfile}
            variant="contained"
            disabled={!tempDisplayName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile; 