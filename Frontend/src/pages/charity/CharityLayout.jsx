import React, { useState } from 'react';
import { Box, Drawer, useMediaQuery, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { useTheme } from '../../hooks/useTheme';
import CharityAppBar from './CharityAppBar';
import CharitySidebar from './CharitySideBar';

const CharityLayout = () => {
  const { isDark } = useTheme();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CharityAppBar onDrawerToggle={handleDrawerToggle} />
      
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
        <CharitySidebar />
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

export default CharityLayout;