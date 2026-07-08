// pages/charity/CharityDashboard.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  VolunteerActivism as DonateIcon,
  Campaign as CampaignIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../Services/authServices';
import CharityStats from './components/CharityStats';

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
      maxWidth="md"
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
          This document has been modified by another user. Please choose how to resolve the conflict.
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

// Main Charity Dashboard
const CharityDashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalDonations: 0,
    totalRaised: 0,
    totalDonors: 0,
    pendingDonations: 0,
  });
  const [optimisticStats, setOptimisticStats] = useState({});
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockInfo, setLockInfo] = useState(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [version, setVersion] = useState(0);
  
  const updateQueue = useRef([]);
  const isProcessing = useRef(false);

  // Fetch dashboard data with locking
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/charity/dashboard', {
        headers: {
          'X-Version': version,
        },
      });
      
      setStats(response.data.stats);
      setRecentDonations(response.data.recentDonations || []);
      setRecentCampaigns(response.data.recentCampaigns || []);
      setVersion(response.data.version || 0);
      
      // Update optimistic stats
      setOptimisticStats(response.data.stats);
    } catch (err) {
      if (err.response?.status === 409) {
        // Conflict detected
        setConflictData({
          current: err.response.data.current,
          updates: err.response.data.updates,
        });
        setConflictOpen(true);
      } else {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [version]);

  // Process update queue with optimistic locking
  const processUpdateQueue = useCallback(async () => {
    if (isProcessing.current || updateQueue.current.length === 0) return;
    
    isProcessing.current = true;
    const update = updateQueue.current.shift();

    try {
      // Acquire lock before update
      const lockResponse = await api.post(`/charity/dashboard/lock`, {
        documentId: update.documentId,
      });

      if (lockResponse.data.locked) {
        setIsLocked(true);
        setLockInfo(lockResponse.data.lockInfo);
      }

      // Perform optimistic update
      setOptimisticStats(prev => ({
        ...prev,
        ...update.optimisticUpdate,
      }));

      // Send actual update
      const response = await api.put(`/charity/dashboard/${update.documentId}`, {
        ...update.data,
        version: update.version,
        __v: version,
      });

      // Release lock
      await api.post(`/charity/dashboard/unlock`, {
        documentId: update.documentId,
      });

      setIsLocked(false);
      setLockInfo(null);

      // Update with latest data
      if (response.data) {
        setStats(response.data);
        setOptimisticStats(response.data);
        setVersion(response.data.version);
        setSuccess('Update successful!');
        setSnackbarOpen(true);
      }

    } catch (err) {
      if (err.response?.status === 409) {
        // Conflict - show resolution dialog
        setConflictData({
          current: err.response.data.current,
          updates: err.response.data.updates,
        });
        setConflictOpen(true);
      } else if (err.response?.status === 423) {
        // Locked
        setError('Document is currently locked by another user');
        setSnackbarOpen(true);
        // Retry after lock is released
        setTimeout(() => {
          updateQueue.current.push(update);
          processUpdateQueue();
        }, 5000);
      } else {
        setError(err.response?.data?.message || 'Update failed');
        setSnackbarOpen(true);
        // Rollback optimistic update
        fetchDashboardData();
      }
    } finally {
      isProcessing.current = false;
      // Process next update in queue
      if (updateQueue.current.length > 0) {
        processUpdateQueue();
      }
    }
  }, [version]);

  // Queue an update
  const queueUpdate = useCallback((documentId, data, optimisticUpdate) => {
    updateQueue.current.push({
      documentId,
      data,
      version: version,
      optimisticUpdate,
    });
    processUpdateQueue();
  }, [version, processUpdateQueue]);

  // Handle conflict resolution
  const handleConflictResolve = useCallback(async (strategy) => {
    setConflictOpen(false);
    try {
      const response = await api.post('/charity/dashboard/resolve-conflict', {
        documentId: conflictData.current._id,
        strategy,
        currentVersion: conflictData.current,
        userChanges: conflictData.updates,
      });

      setStats(response.data);
      setOptimisticStats(response.data);
      setVersion(response.data.version);
      setSuccess('Conflict resolved successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Failed to resolve conflict');
      setSnackbarOpen(true);
    }
  }, [conflictData]);

  // Refresh lock
  const refreshLock = useCallback(async () => {
    try {
      await api.post('/charity/dashboard/refresh-lock');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Failed to refresh lock');
      setSnackbarOpen(true);
    }
  }, []);

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
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData, isLocked]);

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        {/* Header with Lock Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              Dashboard
              {isLocked && (
                <Tooltip title={`Locked by ${lockInfo?.lockedBy} until ${new Date(lockInfo?.lockedUntil).toLocaleTimeString()}`}>
                  <LockIcon sx={{ color: '#f39c12', fontSize: 20 }} />
                </Tooltip>
              )}
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              Real-time overview of your charity's performance
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isLocked && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<LockOpenIcon />}
                onClick={refreshLock}
                sx={{ borderRadius: 2 }}
              >
                Extend Lock
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchDashboardData}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Stats Grid with Optimistic Updates */}
        <CharityStats stats={stats} optimisticStats={optimisticStats} loading={loading} />

        {/* Recent Donations */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
            Recent Donations
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {recentDonations.length === 0 ? (
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', textAlign: 'center', py: 3 }}>
              No recent donations
            </Typography>
          ) : (
            recentDonations.map((donation, index) => (
              <Box
                key={donation._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: index < recentDonations.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` : 'none',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    {donation.donorName || 'Anonymous Donor'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    {new Date(donation.donationDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2ecc71' }}>
                    ${donation.amount.toLocaleString()}
                  </Typography>
                  <Chip
                    label={donation.status}
                    size="small"
                    sx={{
                      backgroundColor: donation.status === 'Completed' 
                        ? 'rgba(46, 204, 113, 0.15)' 
                        : 'rgba(243, 156, 18, 0.15)',
                      color: donation.status === 'Completed' ? '#2ecc71' : '#f39c12',
                    }}
                  />
                </Box>
              </Box>
            ))
          )}
        </Paper>

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
      </Container>
    </Box>
  );
};

export default CharityDashboard;