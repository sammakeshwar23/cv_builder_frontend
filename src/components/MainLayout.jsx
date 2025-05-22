import React from 'react';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ marginLeft: '240px', width: '100%', padding: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
