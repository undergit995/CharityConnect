import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  Badge,
  useMediaQuery,
  Button,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Help as HelpIcon,
  AccountCircle,
  ExpandMore as ChevronDownIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';

const AdminAppBar = ({ onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/auth/login');
  };

  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  };

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Dashboard';
    if (path.includes('/admin/charities')) return 'Charities';
    if (path.includes('/admin/campaigns')) return 'Campaigns';
    if (path.includes('/admin/donors')) return 'Donors';
    if (path.includes('/admin/donations')) return 'Donations';
    if (path.includes('/admin/reports')) return 'Reports';
    if (path.includes('/admin/settings')) return 'Settings';
    return 'Admin Panel';
  };

  // Notification data
  const notifications = [
    { id: 1, message: 'New charity registration pending', time: '5 min ago', type: 'charity' },
    { id: 2, message: 'Campaign "Clean Water" needs approval', time: '15 min ago', type: 'campaign' },
    { id: 3, message: 'Donation of $5,000 received', time: '1 hour ago', type: 'donation' },
    { id: 4, message: '2 new donors registered today', time: '3 hours ago', type: 'donor' },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: isDark 
          ? 'rgba(10, 10, 18, 0.92)' 
          : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        boxShadow: isDark
          ? '0 2px 20px rgba(0,0,0,0.3)'
          : '0 2px 20px rgba(0,0,0,0.06)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        transition: 'all 0.3s ease',
        height: 64,
      }}
    >
      <Toolbar sx={{ height: 64, minHeight: 64, px: { xs: 2, sm: 3 } }}>
        {/* Menu Button (Mobile) */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{
            mr: 2,
            display: { md: 'none' },
            color: isDark ? '#e8e8f0' : '#1a1a2e',
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo / Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              display: { xs: 'none', sm: 'block' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CharityConnect
          </Typography>
          
          {/* Page Title */}
          <Chip
            label={getPageTitle()}
            size="small"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: isDark ? '#a0a0b8' : '#4a4a6a',
              fontWeight: 500,
            }}
          />

          {/* Admin Badge */}
          <Chip
            icon={<AdminIcon sx={{ fontSize: 16 }} />}
            label="Admin"
            size="small"
            sx={{
              display: { xs: 'none', md: 'flex' },
              backgroundColor: 'rgba(102, 126, 234, 0.15)',
              color: '#667eea',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: '#667eea',
              },
            }}
          />
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: isDark ? '#a0a0b8' : '#4a4a6a',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(30deg)',
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                },
              }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <LightIcon /> : <DarkIcon />}
              </motion.div>
            </IconButton>
          </Tooltip>


          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Profile">
              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  padding: '4px 8px 4px 4px',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                <Avatar
                  src={user?.profileImage}
                  alt={user?.fullName || 'Admin'}
                  sx={{
                    width: 32,
                    height: 32,
                    border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    backgroundColor: '#667eea',
                  }}
                >
                  {user?.fullName?.charAt(0) || 'A'}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: isDark ? '#e8e8f0' : '#1a1a2e',
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.fullName || 'Admin'}
                  </Typography>
                </Box>
                <ChevronDownIcon
                  sx={{
                    fontSize: 20,
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    display: { xs: 'none', sm: 'block' },
                  }}
                />
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 240,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.95)' : '#ffffff',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            boxShadow: isDark
              ? '0 8px 40px rgba(0,0,0,0.3)'
              : '0 8px 40px rgba(0,0,0,0.08)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
            {user?.fullName || 'Admin'}
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
            {user?.email || 'admin@charityconnect.com'}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
        
        <MenuItem onClick={() => handleNavigate('/admin/dashboard')}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }} />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        
        <MenuItem onClick={() => handleNavigate('/admin/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }} />
          </ListItemIcon>
          Profile
        </MenuItem>
                
        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
        
        <MenuItem onClick={() => handleNavigate('/help')}>
          <ListItemIcon>
            <HelpIcon fontSize="small" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }} />
          </ListItemIcon>
          Help & Support
        </MenuItem>
        
        <MenuItem onClick={handleLogout} sx={{ color: '#e74c3c' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#e74c3c' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default AdminAppBar;