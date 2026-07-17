import React, { useState, useEffect } from 'react';
import { CircularProgress,
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
  Campaign as CampaignIcon,
  VolunteerActivism as DonateIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';

const CharitySidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalRaised: 0,
    totalDonors: 0,
    loading: true,
  });

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/charity/dashboard' },
    { text: 'My Campaigns', icon: <CampaignIcon />, path: '/charity/campaigns' },
    { text: 'Create Campaign', icon: <AddIcon />, path: '/charity/campaigns/create' },
    { text: 'Donations', icon: <DonateIcon />, path: '/charity/donations' },
    // { text: 'Analytics', icon: <TrendingUpIcon />, path: '/charity/analytics' },
    { text: 'Profile', icon: <PersonIcon />, path: '/charity/profile' },
  ];

  // Fetch charity stats
  useEffect(() => {
    const fetchCharityStats = async () => {
      try {
        const response = await api.get('/charity/dashboard/stats');
        if (response.data.success) {
          const { stats: summaryStats, campaignStatus } = response.data.data;
          setStats({
            activeCampaigns: campaignStatus?.active || 0,
            totalRaised: summaryStats?.totalRaised || 0,
            totalDonors: summaryStats?.totalDonors || 0,
            loading: false,
          });
        }
      } catch (error) {
        //console.error('Failed to fetch charity stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchCharityStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        pt: 8,
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={user?.profileImage}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: '#9b59b6',
            }}
          >
            {user?.fullName?.charAt(0) || 'C'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              {user?.fullName || 'Charity'}
            </Typography>
            <Chip
              label="Charity"
              size="small"
              sx={{
                backgroundColor: 'rgba(155, 89, 182, 0.15)',
                color: '#9b59b6',
                fontWeight: 600,
                height: 20,
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              {stats.loading ? <CircularProgress size={20} /> : stats.activeCampaigns}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              Active Campaigns
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              {stats.loading ? (
                <CircularProgress size={20} />
              ) : (
                `₹${stats.totalRaised.toLocaleString('en-IN')}`
              )}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              Total Raised
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              {stats.loading ? (
                <CircularProgress size={20} />
              ) : (
                stats.totalDonors.toLocaleString('en-IN')
              )}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              Total Donors
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
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
                    ? 'rgba(155, 89, 182, 0.15)' 
                    : 'rgba(155, 89, 182, 0.08)'
                  : 'transparent',
                '&:hover': {
                  cursor:'pointer',
                  backgroundColor: isDark 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(0,0,0,0.04)',
                },
                '& .MuiListItemIcon-root': {
                  color: isActive ? '#9b59b6' : isDark ? '#a0a0b8' : '#4a4a6a',
                  minWidth: 40,
                },
                '& .MuiListItemText-primary': {
                  color: isActive 
                    ? '#9b59b6' 
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

      {/* Quick Action */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
        <ListItem
          button
          onClick={() => navigate('/charity/campaigns/create')}
          sx={{
            borderRadius: 2,
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.2)',
            },
            '& .MuiListItemIcon-root': {
              color: '#667eea',
              minWidth: 40,
            },
            '& .MuiListItemText-primary': {
              color: '#667eea',
              fontWeight: 600,
            },
          }}
        >
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText primary="Start New Campaign" />
        </ListItem>
      </Box>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
        <ListItem
          button
          onClick={handleLogout}
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

export default CharitySidebar;