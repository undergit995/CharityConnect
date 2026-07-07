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
  Chip,
  Button,
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
  Favorite as FavoriteIcon,
  Receipt as ReceiptIcon,
  VolunteerActivism as DonateIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

const DonorAppBar = ({ onDrawerToggle }) => {
  const navigate = useNavigate();
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

  const notifications = [
    { id: 1, message: 'Your donation of $100 to Clean Water was successful', time: '5 min ago' },
    { id: 2, message: 'Campaign "Education for All" is 75% funded', time: '1 hour ago' },
    { id: 3, message: 'New campaign "Medical Relief" started', time: '3 hours ago' },
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Typography
            variant="h6"
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
          
          <Chip
            label="Donor"
            size="small"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              backgroundColor: 'rgba(46, 204, 113, 0.15)',
              color: '#2ecc71',
              fontWeight: 600,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search - Desktop */}
          {!isMobile && (
            <Tooltip title="Search">
              <IconButton
                onClick={() => navigate('/campaigns')}
                sx={{
                  color: isDark ? '#a0a0b8' : '#4a4a6a',
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Theme Toggle */}
          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: isDark ? '#a0a0b8' : '#4a4a6a',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(30deg)',
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

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotifOpen}
              sx={{
                color: isDark ? '#a0a0b8' : '#4a4a6a',
              }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Profile */}
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
                },
              }}
            >
              <Avatar
                src={user?.profileImage}
                alt={user?.fullName || 'Donor'}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#2ecc71',
                }}
              >
                {user?.fullName?.charAt(0) || 'D'}
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
                  {user?.fullName || 'Donor'}
                </Typography>
                {/* <Typography
                  variant="caption"
                  sx={{
                    color: isDark ? '#6a6a80' : '#9a9ab0',
                  }}
                >
                  {user?.email || 'donor@charityconnect.com'}
                </Typography> */}
              </Box>
              <ExpandMoreIcon sx={{ fontSize: 20, color: isDark ? '#a0a0b8' : '#4a4a6a' }} />
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={handleNotifClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            maxHeight: 400,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.95)' : '#ffffff',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
        </Box>
        {notifications.map((notif) => (
          <MenuItem key={notif.id} onClick={handleNotifClose}>
            <Box sx={{ py: 0.5 }}>
              <Typography variant="body2">{notif.message}</Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                {notif.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => { handleNotifClose(); navigate('/donor/notifications'); }}>
          <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 500, textAlign: 'center', width: '100%' }}>
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
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
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user?.fullName || 'Donor'}
          </Typography>
          {/* <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
            {user?.email || 'donor@charityconnect.com'}
          </Typography> */}
        </Box>
        <Divider />
        <MenuItem onClick={() => handleNavigate('/donor/dashboard')}>
          <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
          Dashboard
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/donor/profile')}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/donor/donations')}>
          <ListItemIcon><ReceiptIcon fontSize="small" /></ListItemIcon>
          My Donations
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/donor/saved')}>
          <ListItemIcon><FavoriteIcon fontSize="small" /></ListItemIcon>
          Saved Campaigns
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/donor/settings')}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: '#e74c3c' }}>
          <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#e74c3c' }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default DonorAppBar;