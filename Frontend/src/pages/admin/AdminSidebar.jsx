import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  VolunteerActivism as DonateIcon,
  Business as CharityIcon,
  Settings as SettingsIcon,
  Report as ReportIcon,
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Charities', icon: <CharityIcon />, path: '/admin/charity' },
    { text: 'Campaigns', icon: <CampaignIcon />, path: '/admin/campaigns' },
    { text: 'Donors', icon: <PeopleIcon />, path: '/admin/donors' },
    { text: 'Donations', icon: <DonateIcon />, path: '/admin/donations' },
    { text: 'Reports', icon: <ReportIcon />, path: '/admin/donationreport' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/admin/notifications' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: isDark ? 'rgba(10,10,18,0.8)' : '#ffffff',
        backdropFilter: 'blur(20px)',
        borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        display: 'flex',
        flexDirection: 'column',
        pt: 8,
      }}
    >
      {/* User Info */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={user?.profileImage}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: '#667eea',
            }}
          >
            {user?.fullName?.charAt(0) || 'A'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              {user?.fullName || 'Admin'}
            </Typography>
            <Chip
              icon={<AdminIcon sx={{ fontSize: 14 }} />}
              label="Admin"
              size="small"
              sx={{
                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                color: '#667eea',
                fontWeight: 600,
                height: 20,
                '& .MuiChip-icon': {
                  fontSize: 14,
                  color: '#667eea',
                },
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
      </Box>

      {/* Menu */}
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: isActive 
                  ? isDark 
                    ? 'rgba(102, 126, 234, 0.15)' 
                    : 'rgba(102, 126, 234, 0.08)'
                  : 'transparent',
                '&:hover': {
                  backgroundColor: isDark 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(0,0,0,0.04)',
                },
                '& .MuiListItemIcon-root': {
                  color: isActive ? '#667eea' : isDark ? '#a0a0b8' : '#4a4a6a',
                  minWidth: 40,
                },
                '& .MuiListItemText-primary': {
                  color: isActive 
                    ? '#667eea' 
                    : isDark ? '#e8e8f0' : '#1a1a2e',
                  fontWeight: isActive ? 600 : 400,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
        <ListItem
          button
          onClick={logout}
          sx={{
            borderRadius: 2,
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            },
            '& .MuiListItemIcon-root': {
              color: '#e74c3c',
              minWidth: 40,
            },
            '& .MuiListItemText-primary': {
              color: '#e74c3c',
            },
          }}
        >
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Box>
  );
};

export default AdminSidebar;