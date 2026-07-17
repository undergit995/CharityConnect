import React, { useState, useEffect, useCallback } from 'react';
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
  Paper,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  VolunteerActivism as DonateIcon,
  Campaign as CampaignIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../Theme/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';

// Conflict Resolution Dialog
const ConflictResolutionDialog = ({ open, onClose, onResolve, conflictData }) => {
  const { isDark } = useTheme();
  const [selectedStrategy, setSelectedStrategy] = useState('auto');

  const strategies = [
    { value: 'latest', label: 'Use Latest Version', description: 'Keep the most recent version' },
    { value: 'merge', label: 'Merge Changes', description: 'Combine both versions' },
    { value: 'manual', label: 'Manual Resolution', description: 'Choose which fields to keep' },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: isDark ? 'rgba(20,20,32,0.95)' : '#ffffff',
          backdropFilter: 'blur(20px)',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: '#f39c12' }} />
          <Typography variant="h6">Version Conflict Detected</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your donor data has been modified. Please choose how to resolve the conflict.
        </Alert>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Version (Server)
          </Typography>
          <Paper sx={{ p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 12 }}>
              {JSON.stringify(conflictData?.current, null, 2)}
            </pre>
          </Paper>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Your Changes
          </Typography>
          <Paper sx={{ p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 12 }}>
              {JSON.stringify(conflictData?.updates, null, 2)}
            </pre>
          </Paper>
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Resolution Strategy
        </Typography>
        {strategies.map((strategy) => (
          <Paper
            key={strategy.value}
            onClick={() => setSelectedStrategy(strategy.value)}
            sx={{
              p: 2,
              mb: 1,
              cursor: 'pointer',
              border: `2px solid ${selectedStrategy === strategy.value ? '#667eea' : 'transparent'}`,
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <Typography variant="subtitle2">{strategy.label}</Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              {strategy.description}
            </Typography>
          </Paper>
        ))}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => onResolve(selectedStrategy)}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
            },
          }}
        >
          Resolve Conflict
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Donor Sidebar
const DonorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    savedCampaigns: 0,
    impactScore: 0,
    loading: true,
  });
  
  const [optimisticStats, setOptimisticStats] = useState({});
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/donor/dashboard' },
    { text: 'My Donations', icon: <ReceiptIcon />, path: '/donor/donations' },
    { text: 'Explore Campaigns', icon: <SearchIcon />, path: '/donor/campaign' },
    { text: 'Profile', icon: <PersonIcon />, path: '/donor/profile' },
  ];

  // Fetch donor dashboard data with optimistic locking
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/donor/dashboard/stats', {
        headers: {
          'X-Version': version,
        },
      });
      
      if (response.data.success) {
        const data = response.data.data;
        setStats(data.stats);
        setOptimisticStats(data.stats);
        setVersion(data.version || 0);
        setError('');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        // Conflict detected
        setConflictData({
          current: err.response.data.current,
          updates: err.response.data.updates,
        });
        setConflictOpen(true);
      } else {
        setError(err.response?.data?.message || 'Failed to load donor stats');
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, [version]);

  // Handle conflict resolution
  const handleConflictResolve = useCallback(async (strategy) => {
    setConflictOpen(false);
    try {
      const response = await api.post('/donor/dashboard/resolve-conflict', {
        strategy,
        currentVersion: conflictData.current,
        userChanges: conflictData.updates,
      });

      if (response.data.success) {
        setStats(response.data.stats);
        setOptimisticStats(response.data.stats);
        setVersion(response.data.version);
        setSuccess('Conflict resolved successfully!');
        setSnackbarOpen(true);
        // Refresh data
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to resolve conflict');
      setSnackbarOpen(true);
    }
  }, [conflictData, fetchDashboardData]);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLocked) {
        fetchDashboardData();
      }
    }, 300000);
    return () => clearInterval(interval);
  }, [fetchDashboardData, isLocked]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || 0}`;
  };

  return (
    <>
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
                backgroundColor: '#2ecc71',
              }}
            >
              {user?.fullName?.charAt(0) || 'D'}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                }}
              >
                {user?.fullName || 'Donor'}
              </Typography>
              <Chip
                label="Donor"
                size="small"
                sx={{
                  backgroundColor: 'rgba(46, 204, 113, 0.15)',
                  color: '#2ecc71',
                  fontWeight: 600,
                  height: 20,
                }}
              />
            </Box>
          </Box>

          {/* Dynamic Stats */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                }}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  stats.totalDonations
                )}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}
              >
                Donations
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                }}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  formatCurrency(stats.totalAmount)
                )}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}
              >
                Total Given
              </Typography>
            </Box>
          </Box>

          {/* Version indicator */}
          {version > 0 && (
            <Chip
              label={`v${version}`}
              size="small"
              sx={{
                mt: 1,
                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                color: '#667eea',
                height: 16,
                '& .MuiChip-label': { fontSize: '0.5rem' },
              }}
            />
          )}

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
                      ? 'rgba(46, 204, 113, 0.15)'
                      : 'rgba(46, 204, 113, 0.08)'
                    : 'transparent',
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.04)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive ? '#2ecc71' : isDark ? '#a0a0b8' : '#4a4a6a',
                    minWidth: 40,
                  },
                  '& .MuiListItemText-primary': {
                    color: isActive
                      ? '#2ecc71'
                      : isDark
                      ? '#e8e8f0'
                      : '#1a1a2e',
                    fontWeight: isActive ? 600 : 400,
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.text === 'Saved Campaigns' && stats.savedCampaigns > 0 && (
                  <Chip
                    label={stats.savedCampaigns}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(231, 76, 60, 0.15)',
                      color: '#e74c3c',
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

        {/* Recent Campaigns */}
        <Box sx={{ p: 2 }}>
          <Divider
            sx={{
              mb: 2,
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: isDark ? '#6a6a80' : '#9a9ab0',
              fontWeight: 600,
              px: 1,
            }}
          >
            YOUR IMPACT
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 16, color: '#667eea' }} />
              <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                Impact Score: {loading ? <CircularProgress size={16} /> : stats.impactScore || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FavoriteIcon sx={{ fontSize: 16, color: '#e74c3c' }} />
              <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                Saved: {loading ? <CircularProgress size={16} /> : stats.savedCampaigns}
              </Typography>
            </Box>
          </Box>
        </Box>

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

      {/* Conflict Resolution Dialog */}
      <ConflictResolutionDialog
        open={conflictOpen}
        onClose={() => setConflictOpen(false)}
        onResolve={handleConflictResolve}
        conflictData={conflictData}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={error ? 'error' : 'success'}
          onClose={() => setSnackbarOpen(false)}
          sx={{ borderRadius: 2 }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DonorSidebar;