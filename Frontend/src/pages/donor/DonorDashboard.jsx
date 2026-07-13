import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
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
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  VolunteerActivism as DonateIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Verified as VerifiedIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';
import { useNavigate } from 'react-router-dom';
import DonorStats from './DonorStats';
import CampaignsGrid from '../../commonComponents/CampaignsGrid';

// Tab Panel Component
const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

// Donation History Table with Optimistic Updates
const DonationHistoryTable = ({ donations, loading, onUpdate }) => {
  const { isDark } = useTheme();
  const [optimisticDonations, setOptimisticDonations] = useState(donations);

  useEffect(() => {
    setOptimisticDonations(donations);
  }, [donations]);

  const handleStatusUpdate = async (donationId, newStatus) => {
    // Optimistic update
    const originalDonations = [...optimisticDonations];
    setOptimisticDonations(prev =>
      prev.map(d =>
        d._id === donationId
          ? { ...d, status: newStatus, __v: (d.__v || 0) + 1 }
          : d
      )
    );

    try {
      await onUpdate(donationId, newStatus);
    } catch (error) {
      // Rollback on error
      setOptimisticDonations(originalDonations);
    }
  };

  const getStatusChip = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: '#f39c12' },
      completed: { label: 'Completed', color: '#2ecc71' },
      failed: { label: 'Failed', color: '#e74c3c' },
      refunded: { label: 'Refunded', color: '#95a5a6' },
    };
    const s = statusMap[status] || statusMap.pending;
    return (
      <Chip
        label={s.label}
        size="small"
        sx={{ backgroundColor: `${s.color}20`, color: s.color }}
      />
    );
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Campaign</TableCell>
            <TableCell align="right" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Amount</TableCell>
            <TableCell align="right" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Date</TableCell>
            <TableCell align="center" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Status</TableCell>
            <TableCell align="center" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Receipt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : optimisticDonations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4, color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                No donations yet
              </TableCell>
            </TableRow>
          ) : (
            optimisticDonations.map((donation) => (
              <TableRow key={donation._id}>
                <TableCell sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  {donation.campaignId?.title || 'N/A'}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#2ecc71' }}>
                  ₹{donation.amount?.toLocaleString('en-IN') || 0}
                </TableCell>
                <TableCell align="right" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                  {new Date(donation.donationDate).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  {getStatusChip(donation.status)}
                  {donation.__v > 0 && (
                    <Chip
                      label={`v${donation.__v}`}
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: 'rgba(102, 126, 234, 0.15)',
                        color: '#667eea',
                        height: 16,
                        '& .MuiChip-label': { fontSize: '0.5rem' },
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  {donation.receiptUrl && (
                    <Tooltip title="Download Receipt">
                      <IconButton
                        size="small"
                        href={donation.receiptUrl}
                        target="_blank"
                        sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Main Donor Dashboard
const DonorDashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    savedCampaigns: 0,
    impactScore: 0,
  });
  const [optimisticStats, setOptimisticStats] = useState({});
  const [recentDonations, setRecentDonations] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [recommendedCampaigns, setRecommendedCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockInfo, setLockInfo] = useState(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [version, setVersion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('auto');

  const updateQueue = useRef([]);
  const isProcessing = useRef(false);

  // Fetch dashboard data with optimistic locking
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/donor/dashboard', {
        headers: {
          'X-Version': version,
        },
      });
      
      setStats(response.data.stats);
      setRecentDonations(response.data.recentDonations || []);
      setSavedCampaigns(response.data.savedCampaigns || []);
      setRecommendedCampaigns(response.data.recommendedCampaigns || []);
      setVersion(response.data.version || 0);
      setOptimisticStats(response.data.stats);
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictData({
          current: err.response.data.current,
          updates: err.response.data.updates,
        });
        setConflictOpen(true);
      } else {
        setError(err.response?.data?.message || 'Failed to load dashboard');
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, [version]);

  // Queue update with optimistic locking
  const queueUpdate = useCallback(async (action, data, optimisticUpdate) => {
    return new Promise((resolve, reject) => {
      updateQueue.current.push({
        action,
        data,
        optimisticUpdate,
        resolve,
        reject,
      });
      processUpdateQueue();
    });
  }, []);

  // Process update queue
  const processUpdateQueue = useCallback(async () => {
    if (isProcessing.current || updateQueue.current.length === 0) return;
    
    isProcessing.current = true;
    const update = updateQueue.current.shift();

    try {
      // Perform optimistic update
      if (update.optimisticUpdate) {
        update.optimisticUpdate();
      }

      // Send actual update
      const response = await api.put(update.action, update.data, {
        headers: {
          'X-Version': version,
        },
      });

      // Update with latest data
      if (response.data) {
        setStats(response.data.stats);
        setOptimisticStats(response.data.stats);
        setVersion(response.data.version);
        update.resolve(response.data);
      }

    } catch (err) {
      if (err.response?.status === 409) {
        setConflictData({
          current: err.response.data.current,
          updates: err.response.data.updates,
        });
        setConflictOpen(true);
        update.reject(err);
      } else {
        update.reject(err);
      }
    } finally {
      isProcessing.current = false;
      // Process next update in queue
      if (updateQueue.current.length > 0) {
        processUpdateQueue();
      }
    }
  }, [version]);

  // Handle conflict resolution
  const handleConflictResolve = useCallback(async (strategy) => {
    setConflictOpen(false);
    try {
      const response = await api.post('/donor/dashboard/resolve-conflict', {
        documentId: conflictData.current._id,
        strategy,
        currentVersion: conflictData.current,
        userChanges: conflictData.updates,
      });

      setStats(response.data.stats);
      setOptimisticStats(response.data.stats);
      setVersion(response.data.version);
      setSuccess('Conflict resolved successfully!');
      setSnackbarOpen(true);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to resolve conflict');
      setSnackbarOpen(true);
    }
  }, [conflictData, fetchDashboardData]);

  // Handle save campaign
  const handleSaveCampaign = useCallback(async (campaignId, isSaved) => {
    setSaving(true);
    try {
      // Optimistic update
      setSavedCampaigns(prev => 
        isSaved 
          ? [...prev, { _id: campaignId }] 
          : prev.filter(c => c._id !== campaignId)
      );
      setOptimisticStats(prev => ({
        ...prev,
        savedCampaigns: isSaved ? prev.savedCampaigns + 1 : prev.savedCampaigns - 1,
      }));

      await queueUpdate(
        `/donor/save-campaign/${campaignId}`,
        { isSaved },
        () => {}
      );

      setSuccess(isSaved ? 'Campaign saved!' : 'Campaign removed from saved');
      setSnackbarOpen(true);
    } catch (error) {
      // Rollback
      setSavedCampaigns(prev => 
        isSaved 
          ? prev.filter(c => c._id !== campaignId) 
          : [...prev, { _id: campaignId }]
      );
      setError('Failed to save campaign');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  }, [queueUpdate]);

  // Handle download receipt
  const handleDownloadReceipt = useCallback(async (donationId) => {
    try {
      const response = await api.get(`/donor/donations/${donationId}/receipt`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${donationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccess('Receipt downloaded successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setError('Failed to download receipt');
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
              Welcome back, {user?.fullName || 'Donor'}
              {isLocked && (
                <Tooltip title={`Locked by ${lockInfo?.lockedBy} until ${new Date(lockInfo?.lockedUntil).toLocaleTimeString()}`}>
                  <LockIcon sx={{ color: '#f39c12', fontSize: 20 }} />
                </Tooltip>
              )}
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              Real-time overview of your giving impact
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchDashboardData}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Stats Grid with Optimistic Updates */}
        <DonorStats stats={stats} optimisticStats={optimisticStats} loading={loading} saving={saving} />

        {/* Quick Actions */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                borderRadius: 3,
                cursor: 'pointer',
                background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.08)',
                },
              }}
              onClick={() => navigate('/campaigns')}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    margin: '0 auto',
                    mb: 1,
                    backgroundColor: 'rgba(102, 126, 234, 0.15)',
                    color: '#667eea',
                  }}
                >
                  <DonateIcon />
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  Donate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                borderRadius: 3,
                cursor: 'pointer',
                background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.08)',
                },
              }}
              onClick={() => navigate('/donor/donations')}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    margin: '0 auto',
                    mb: 1,
                    backgroundColor: 'rgba(46, 204, 113, 0.15)',
                    color: '#2ecc71',
                  }}
                >
                  <ReceiptIcon />
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  Donations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                borderRadius: 3,
                cursor: 'pointer',
                background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.08)',
                },
              }}
              onClick={() => navigate('/donor/saved')}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    margin: '0 auto',
                    mb: 1,
                    backgroundColor: 'rgba(231, 76, 60, 0.15)',
                    color: '#e74c3c',
                  }}
                >
                  <FavoriteIcon />
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  Saved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                borderRadius: 3,
                cursor: 'pointer',
                background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.08)',
                },
              }}
              onClick={() => navigate('/donor/profile')}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    margin: '0 auto',
                    mb: 1,
                    backgroundColor: 'rgba(155, 89, 182, 0.15)',
                    color: '#9b59b6',
                  }}
                >
                  <PeopleIcon />
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  Profile
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Paper
          sx={{
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              px: 2,
              '& .MuiTab-root': {
                color: isDark ? '#a0a0b8' : '#4a4a6a',
                '&.Mui-selected': {
                  color: '#667eea',
                },
              },
            }}
          >
            <Tab label="Recent Donations" />
            <Tab label="Saved Campaigns" />
            <Tab label="Recommended" />
          </Tabs>

          {/* Tab 1: Recent Donations */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <DonationHistoryTable
                donations={recentDonations}
                loading={loading}
                onUpdate={handleDownloadReceipt}
              />
            </Box>
          </TabPanel>

          {/* Tab 2: Saved Campaigns */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : savedCampaigns.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                    You haven't saved any campaigns yet.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/campaigns')}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    Explore Campaigns
                  </Button>
                </Box>
              ) : (
                <CampaignsGrid campaigns={savedCampaigns} onSave={handleSaveCampaign} isSaving={saving} />
              )}
            </Box>
          </TabPanel>

          {/* Tab 3: Recommended Campaigns */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : recommendedCampaigns.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                    No recommended campaigns at the moment.
                  </Typography>
                </Box>
              ) : (
                <CampaignsGrid campaigns={recommendedCampaigns} onSave={handleSaveCampaign} isSaving={saving} />
              )}
            </Box>
          </TabPanel>
        </Paper>

        {/* Conflict Resolution Dialog */}
        <Dialog
          open={conflictOpen}
          onClose={() => setConflictOpen(false)}
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
              This data has been modified by another user. Please choose how to resolve the conflict.
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
            {['auto', 'latest', 'merge'].map((strategy) => (
              <Paper
                key={strategy}
                onClick={() => setSelectedStrategy(strategy)}
                sx={{
                  p: 2,
                  mb: 1,
                  cursor: 'pointer',
                  border: `2px solid ${selectedStrategy === strategy ? '#667eea' : 'transparent'}`,
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <Typography variant="subtitle2">
                  {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                  {strategy === 'auto' && 'Automatically resolve using latest version'}
                  {strategy === 'latest' && 'Keep the most recent version'}
                  {strategy === 'merge' && 'Merge both versions together'}
                </Typography>
              </Paper>
            ))}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setConflictOpen(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleConflictResolve(selectedStrategy)}
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

export default DonorDashboard;