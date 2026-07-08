import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  useMediaQuery,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Campaign as CampaignIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../Services/authServices';
import { formatDistanceToNow } from 'date-fns';

// Campaign Stats Card
const CampaignStatsCard = ({ title, value, icon, color }) => {
  const { isDark } = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ backgroundColor: `${color}20`, color: color }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              {value}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

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
          This campaign has been modified by another user. Please choose how to resolve the conflict.
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

// Campaign Row Component with Optimistic Updates
const CampaignRow = ({ campaign, onAction, isProcessing, version }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [optimisticStatus, setOptimisticStatus] = useState(campaign.status);
  const [optimisticRaised, setOptimisticRaised] = useState(campaign.raisedAmount);
  const [localVersion, setLocalVersion] = useState(campaign.__v || 0);

  const progress = ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100;

  const getStatusChip = (status) => {
    const statusMap = {
      draft: { label: 'Draft', color: '#95a5a6' },
      pending: { label: 'Pending', color: '#f39c12' },
      active: { label: 'Active', color: '#2ecc71' },
      paused: { label: 'Paused', color: '#3498db' },
      completed: { label: 'Completed', color: '#9b59b6' },
      cancelled: { label: 'Cancelled', color: '#e74c3c' },
    };
    const s = statusMap[status] || statusMap.draft;
    return (
      <Chip
        label={s.label}
        size="small"
        sx={{ backgroundColor: `${s.color}20`, color: s.color }}
      />
    );
  };

  const handleAction = (action) => {
    onAction(campaign._id, action, {
      optimisticStatus,
      setOptimisticStatus,
      optimisticRaised,
      setOptimisticRaised,
      localVersion,
      setLocalVersion,
    });
  };

  const getActions = () => {
    const actions = [];

    // View
    actions.push({
      label: 'View',
      icon: <VisibilityIcon fontSize="small" />,
      onClick: () => navigate(`/campaigns/${campaign._id}`),
      color: isDark ? '#a0a0b8' : '#4a4a6a',
    });

    // Edit (only for draft, pending, paused)
    if (['draft', 'pending', 'paused'].includes(optimisticStatus)) {
      actions.push({
        label: 'Edit',
        icon: <EditIcon fontSize="small" />,
        onClick: () => navigate(`/charity/campaigns/${campaign._id}/edit`),
        color: '#3498db',
      });
    }

    // Status actions
    if (optimisticStatus === 'draft') {
      actions.push({
        label: 'Submit for Review',
        icon: <PendingIcon fontSize="small" />,
        onClick: () => handleAction('submit'),
        color: '#f39c12',
      });
    }

    if (optimisticStatus === 'pending') {
      actions.push({
        label: 'Cancel Request',
        icon: <CancelIcon fontSize="small" />,
        onClick: () => handleAction('cancel-request'),
        color: '#e74c3c',
      });
    }

    if (optimisticStatus === 'active') {
      actions.push({
        label: 'Pause',
        icon: <PauseIcon fontSize="small" />,
        onClick: () => handleAction('pause'),
        color: '#3498db',
      });
    }

    if (optimisticStatus === 'paused') {
      actions.push({
        label: 'Resume',
        icon: <PlayArrowIcon fontSize="small" />,
        onClick: () => handleAction('resume'),
        color: '#2ecc71',
      });
    }

    if (optimisticStatus === 'active' || optimisticStatus === 'paused') {
      actions.push({
        label: 'Complete',
        icon: <CheckCircleIcon fontSize="small" />,
        onClick: () => handleAction('complete'),
        color: '#9b59b6',
      });
    }

    // Delete (only for draft, pending, cancelled)
    if (['draft', 'pending', 'cancelled'].includes(optimisticStatus)) {
      actions.push({
        label: 'Delete',
        icon: <DeleteIcon fontSize="small" />,
        onClick: () => handleAction('delete'),
        color: '#e74c3c',
      });
    }

    return actions;
  };

  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={campaign.coverImage}
            variant="rounded"
            sx={{ width: 40, height: 40 }}
          >
            <CampaignIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              {campaign.title}
              {localVersion > (campaign.__v || 0) && (
                <Chip
                  label="Modified"
                  size="small"
                  sx={{
                    ml: 1,
                    backgroundColor: 'rgba(243, 156, 18, 0.15)',
                    color: '#f39c12',
                    height: 16,
                    '& .MuiChip-label': { fontSize: '0.5rem' },
                  }}
                />
              )}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              {campaign.category} • Created {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ minWidth: 150 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              ${(campaign.raisedAmount || 0).toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              ${(campaign.goalAmount || 0).toLocaleString()}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
              },
            }}
          />
          <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
            {Math.round(progress)}% • {campaign.stats?.donorCount || 0} donors
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getStatusChip(optimisticStatus)}
          {isProcessing && (
            <CircularProgress size={16} sx={{ color: '#667eea' }} />
          )}
        </Box>
      </TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
          {getActions().map((action, index) => (
            <Tooltip key={index} title={action.label}>
              <IconButton
                size="small"
                onClick={action.onClick}
                disabled={isProcessing}
                sx={{ color: action.color }}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </TableCell>
    </TableRow>
  );
};

// Main Charity Campaigns Component
const CharityCampaigns = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    pending: 0,
    completed: 0,
    paused: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockInfo, setLockInfo] = useState(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [version, setVersion] = useState(0);

  const updateQueue = useRef([]);
  const isProcessing = useRef(false);

  // Fetch campaigns
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/charity/campaigns', {
        params: {
          page,
          limit: 10,
          search: searchTerm,
          status: filterStatus,
        },
        headers: {
          'X-Version': version,
        },
      });
      
      setCampaigns(response.data.campaigns || []);
      setTotalPages(response.data.totalPages || 1);
      if (response.data.stats) {
        setStats(response.data.stats);
      }
      setVersion(response.data.version || 0);
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictData({
          current: err.response.data.current,
          updates: err.response.data.updates,
        });
        setConflictOpen(true);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch campaigns');
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterStatus, version]);

  // Process update queue with optimistic locking
  const processUpdateQueue = useCallback(async () => {
    if (isProcessing.current || updateQueue.current.length === 0) return;
    
    isProcessing.current = true;
    const update = updateQueue.current.shift();

    try {
      // Apply optimistic update
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
        setCampaigns(prev => 
          prev.map(c => 
            c._id === update.campaignId ? response.data : c
          )
        );
        setVersion(response.data.__v || 0);
        update.resolve(response.data);
        setSuccess('Campaign updated successfully!');
        setSnackbarOpen(true);
      }

    } catch (err) {
      if (err.response?.status === 409) {
        setConflictData({
          current: err.response.data.current,
          updates: err.response.data.updates,
        });
        setConflictOpen(true);
        update.reject(err);
      } else if (err.response?.status === 423) {
        // Locked
        setError('Campaign is currently locked by another user');
        setSnackbarOpen(true);
        // Retry after lock is released
        setTimeout(() => {
          updateQueue.current.push(update);
          processUpdateQueue();
        }, 5000);
      } else {
        update.reject(err);
        setError(err.response?.data?.message || 'Update failed');
        setSnackbarOpen(true);
        // Rollback
        fetchCampaigns();
      }
    } finally {
      isProcessing.current = false;
      // Process next update
      if (updateQueue.current.length > 0) {
        processUpdateQueue();
      }
    }
  }, [version, fetchCampaigns]);

  // Queue an update
  const queueUpdate = useCallback((campaignId, action, data, optimisticUpdate) => {
    return new Promise((resolve, reject) => {
      updateQueue.current.push({
        campaignId,
        action,
        data,
        optimisticUpdate,
        resolve,
        reject,
      });
      processUpdateQueue();
    });
  }, [processUpdateQueue]);

  // Handle campaign actions with optimistic locking
  const handleCampaignAction = useCallback(async (campaignId, action, state) => {
    setProcessing(true);
    
    const campaign = campaigns.find(c => c._id === campaignId);
    if (!campaign) return;

    const {
      optimisticStatus,
      setOptimisticStatus,
      localVersion,
      setLocalVersion,
    } = state;

    // Optimistic update
    let newStatus = campaign.status;
    let optimisticUpdate = () => {};
    let actionData = {};

    switch (action) {
      case 'submit':
        newStatus = 'pending';
        optimisticUpdate = () => {
          setOptimisticStatus('pending');
          setLocalVersion((localVersion || 0) + 1);
        };
        actionData = { action: 'submit' };
        break;
      case 'cancel-request':
        newStatus = 'draft';
        optimisticUpdate = () => {
          setOptimisticStatus('draft');
          setLocalVersion((localVersion || 0) + 1);
        };
        actionData = { action: 'cancel-request' };
        break;
      case 'pause':
        newStatus = 'paused';
        optimisticUpdate = () => {
          setOptimisticStatus('paused');
          setLocalVersion((localVersion || 0) + 1);
        };
        actionData = { action: 'pause' };
        break;
      case 'resume':
        newStatus = 'active';
        optimisticUpdate = () => {
          setOptimisticStatus('active');
          setLocalVersion((localVersion || 0) + 1);
        };
        actionData = { action: 'resume' };
        break;
      case 'complete':
        newStatus = 'completed';
        optimisticUpdate = () => {
          setOptimisticStatus('completed');
          setLocalVersion((localVersion || 0) + 1);
        };
        actionData = { action: 'complete' };
        break;
      case 'delete':
        optimisticUpdate = () => {
          // Remove from list optimistically
          setCampaigns(prev => prev.filter(c => c._id !== campaignId));
        };
        actionData = { action: 'delete' };
        break;
      default:
        return;
    }

    // Apply optimistic update
    optimisticUpdate();

    try {
      const response = await queueUpdate(
        campaignId,
        `/charity/campaigns/${campaignId}/${action}`,
        { ...actionData, version: localVersion },
        optimisticUpdate
      );

      // Update stats
      fetchCampaigns();
      setSuccess(`Campaign ${action}ed successfully!`);
      setSnackbarOpen(true);
    } catch (error) {
      // Rollback
      setCampaigns(prev => {
        const existing = prev.find(c => c._id === campaignId);
        if (!existing) {
          // If campaign was deleted, restore it
          return [...prev, campaign];
        }
        // Restore status
        return prev.map(c => 
          c._id === campaignId 
            ? { ...c, status: campaign.status, __v: campaign.__v }
            : c
        );
      });
      setError('Failed to update campaign');
      setSnackbarOpen(true);
    } finally {
      setProcessing(false);
    }
  }, [campaigns, queueUpdate, fetchCampaigns]);

  // Handle conflict resolution
  const handleConflictResolve = useCallback(async (strategy) => {
    setConflictOpen(false);
    try {
      const response = await api.post('/charity/campaigns/resolve-conflict', {
        documentId: conflictData.current._id,
        strategy,
        currentVersion: conflictData.current,
        userChanges: conflictData.updates,
      });

      setCampaigns(prev =>
        prev.map(c =>
          c._id === conflictData.current._id ? response.data : c
        )
      );
      setVersion(response.data.__v || 0);
      setSuccess('Conflict resolved successfully!');
      setSnackbarOpen(true);
      fetchCampaigns();
    } catch (err) {
      setError('Failed to resolve conflict');
      setSnackbarOpen(true);
    }
  }, [conflictData, fetchCampaigns]);

  // Initial load
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLocked) {
        fetchCampaigns();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchCampaigns, isLocked]);

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
                My Campaigns
                {isLocked && (
                  <Tooltip title={`Locked by ${lockInfo?.lockedBy}`}>
                    <LockIcon sx={{ color: '#f39c12', fontSize: 20 }} />
                  </Tooltip>
                )}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Manage all your fundraising campaigns
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchCampaigns}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/charity/campaigns/create')}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                  },
                }}
              >
                Create Campaign
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={4} md={2}>
            <CampaignStatsCard
              title="Total"
              value={stats.total}
              icon={<CampaignIcon />}
              color="#3498db"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <CampaignStatsCard
              title="Active"
              value={stats.active}
              icon={<CheckCircleIcon />}
              color="#2ecc71"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <CampaignStatsCard
              title="Draft"
              value={stats.draft}
              icon={<EditIcon />}
              color="#95a5a6"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <CampaignStatsCard
              title="Pending"
              value={stats.pending}
              icon={<PendingIcon />}
              color="#f39c12"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <CampaignStatsCard
              title="Paused"
              value={stats.paused}
              icon={<PauseIcon />}
              color="#3498db"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <CampaignStatsCard
              title="Completed"
              value={stats.completed}
              icon={<CheckCircleIcon />}
              color="#9b59b6"
            />
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search campaigns..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="paused">Paused</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              sx={{ borderRadius: 2 }}
            >
              Reset
            </Button>
          </Box>
        </Paper>

        {/* Campaigns Table */}
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Campaign</TableCell>
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Progress</TableCell>
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Status</TableCell>
                  <TableCell align="right" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                      {searchTerm ? 'No campaigns match your search' : 'No campaigns found. Create your first campaign!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((campaign) => (
                    <CampaignRow
                      key={campaign._id}
                      campaign={campaign}
                      onAction={handleCampaignAction}
                      isProcessing={processing}
                      version={version}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {campaigns.length > 0 && (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                  },
                }}
              />
            </Box>
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

export default CharityCampaigns;