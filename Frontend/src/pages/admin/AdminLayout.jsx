import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import AdminAppBar from './AdminAppBar';
import AdminSidebar from './AdminSidebar';



const AdminLayout = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminAppBar onDrawerToggle={handleDrawerToggle} />
      
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
            backgroundColor: 'transparent',
          },
        }}
      >
        <AdminSidebar />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - 280px)` },
          mt: 8,
          minHeight: '100vh',
          backgroundColor: (theme) => theme.palette.background.default,
          transition: 'all 0.3s ease',
        }}
      >
        <Outlet/>
      </Box>
    </Box>
  );
};

export default AdminLayout;