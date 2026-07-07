import React, { useState } from 'react';
import { Box, Drawer, useMediaQuery, AppBar, Toolbar, IconButton, Typography, Container } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';

import { useTheme } from '../../hooks/useTheme';
import DonorSidebar from './DonorSideBar';
import DonorAppBar from './DonorAppBar';

const DonorLayout = () => {
  const { isDark } = useTheme();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <DonorAppBar onDrawerToggle={handleDrawerToggle} />
      
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            border: 'none',
            backgroundColor: isDark ? 'rgba(10,10,18,0.95)' : '#ffffff',
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          },
        }}
      >
        <DonorSidebar />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - 280px)` },
          mt: 8,
          backgroundColor: isDark ? '#0a0a12' : '#f8f9fa',
          minHeight: '100vh',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl" sx={{ pt: 1 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DonorLayout;