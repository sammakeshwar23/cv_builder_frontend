import React from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Avatar, Tooltip } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AppHeader = ({ showLogout = true }) => {
  const navigate = useNavigate();

  const username = localStorage.getItem('username');
  const name = localStorage.getItem('name') || '';
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getInitials = (fullName) => {
    const names = fullName.trim().split(' ');
    if (names.length === 0) return '';
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          CV Builder
        </Typography>

        {showLogout && (
          <Stack direction="row" spacing={2} alignItems="center">
            

            {username && (
              <Tooltip title={`${ username} (${email || 'No email'})`}>
                <Avatar sx={{ bgcolor: '#1976d2', cursor: 'default' }}>
                  {username ? getInitials(username) : username[0].toUpperCase()}
                </Avatar>
              </Tooltip>
            )}
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
