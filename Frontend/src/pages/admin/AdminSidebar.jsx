import React, { useState, useEffect } from 'react';
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
  Skeleton,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Campaign as CampaignIcon,
  VolunteerActivism as DonateIcon,
  Business as CharityIcon,
  Settings as SettingsIcon,
  Assessment as ReportIcon,
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../Theme/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    totalCampaigns: 0,
    totalCharities: 0,
    pendingVerifications: 0,
    loading: true,
  });

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Charities', icon: <CharityIcon />, path: '/admin/charity' },
    { text: 'Campaigns', icon: <CampaignIcon />, path: '/admin/campaigns' },
    { text: 'Donations', icon: <DonateIcon />, path: '/admin/donations' },
    { text: 'Profile', icon: <PersonIcon />, path: '/admin/profile' },
    { text: 'Verification', icon: <VerifiedIcon />, path: '/admin/verification' }
  ];

  // Fetch admin stats
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        if (response.data.success) {
          const data = response.data.data;
          setStats({
            totalDonations: data.stats?.totalDonations || 0,
            totalAmount: data.stats?.totalAmount?.toLocaleString('en-IN') || 0,
            totalCampaigns: data.stats?.totalCampaigns || 0,
            totalCharities: data.stats?.totalCharities || 0,
            pendingVerifications: data.stats?.pendingCharities || 0,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchAdminStats();
  }, []);

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchAdminStats = async () => {
        try {
          const response = await api.get('/admin/dashboard/stats');
          if (response.data.success) {
            const data = response.data.data;
            setStats({
              totalDonations: data.stats?.totalDonations || 0,
              totalAmount: data.stats?.totalAmount?.toLocaleString('en-IN') || 0,
              totalCampaigns: data.stats?.totalCampaigns || 0,
              totalCharities: data.stats?.totalCharities || 0,
              pendingVerifications: data.stats?.pendingCharities || 0,
              loading: false,
            });
          }
        } catch (error) {
          console.error('Failed to fetch admin stats:', error);
        }
      };
      fetchAdminStats();
    }, 300000);

    return () => clearInterval(interval);
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
        backgroundColor: isDark ? 'rgba(10,10,18,0.95)' : '#ffffff',
        backdropFilter: 'blur(20px)',
        borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
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
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
              }}
            >
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


        <Divider
          sx={{
            mt: 2,
            borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          }}
        />
      </Box>

      {/* Menu */}
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          // Add badge for verification if pending
          const hasBadge = item.text === 'Verification' && stats.pendingVerifications > 0;

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
                    : isDark
                    ? '#e8e8f0'
                    : '#1a1a2e',
                  fontWeight: isActive ? 600 : 400,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
              {hasBadge && (
                <Chip
                  label={stats.pendingVerifications}
                  size="small"
                  sx={{
                    backgroundColor: '#e74c3c',
                    color: '#fff',
                    fontWeight: 600,
                    height: 20,
                    '& .MuiChip-label': { fontSize: '0.65rem', px: 1 },
                  }}
                />
              )}
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Divider
          sx={{
            mb: 2,
            borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          }}
        />
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            '&:hover': {
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.04)',
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
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Box>
  );
};

export default AdminSidebar;