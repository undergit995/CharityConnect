import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Campaign as CampaignIcon,
  Pending as PendingIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';

const AdminManageCampaigns = () => {
  const { isDark } = useTheme();
  
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const itemsPerPage = 10;

  // Fetch campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/campaigns', {
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm,
          status: filterStatus,
        },
      });
      setCampaigns(response.data.campaigns || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [page, searchTerm, filterStatus]);

  // Handle campaign actions
  const handleCampaignAction = async (action) => {
    if (!selectedCampaign) return;
    
    try {
      let endpoint = '';
      if (action === 'approve' || action === 'reject' || action === 'pause' || action === 'resume') {
        endpoint = `/admin/campaigns/${selectedCampaign._id}/${action}`;
      } else if (action === 'delete') {
        endpoint = `/admin/campaigns/${selectedCampaign._id}`;
        await api.delete(endpoint);
      } else {
        setError('Invalid action');
        return;
      }

      if (action !== 'delete') await api.put(endpoint, { rejectionReason: action === 'reject' ? 'Rejected by admin' : undefined });
      setSuccess(`Campaign ${action}ed successfully`);
      setOpenDialog(false);
      fetchCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} campaign`);
    }
  };

  const openActionDialog = (campaign, action) => {
    setSelectedCampaign(campaign);
    setDialogAction(action);
    setOpenDialog(true);
  };

  // Get status chip
  const getStatusChip = (campaign) => {
    const statusMap = {
      draft: { label: 'Draft', color: '#95a5a6' },
      pending: { label: 'Pending', color: '#f39c12' },
      active: { label: 'Active', color: '#2ecc71' },
      paused: { label: 'Paused', color: '#3498db' },
      completed: { label: 'Completed', color: '#9b59b6' },
      cancelled: { label: 'Cancelled', color: '#e74c3c' },
    };
    const status = statusMap[campaign.status] || statusMap.draft;
    return (
      <Chip
        label={status.label}
        size="small"
        sx={{ backgroundColor: `${status.color}20`, color: status.color }}
      />
    );
  };

  // Stats
  const stats = [
    { label: 'Total Campaigns', value: campaigns.length, icon: <CampaignIcon />, color: '#3498db' },
    { label: 'Pending Approval', value: campaigns.filter(c => c.status === 'pending').length, icon: <PendingIcon />, color: '#f39c12' },
    { label: 'Active', value: campaigns.filter(c => c.status === 'active').length, icon: <PlayArrowIcon />, color: '#2ecc71' },
    { label: 'Completed', value: campaigns.filter(c => c.status === 'completed').length, icon: <CheckCircleIcon />, color: '#9b59b6' },
  ];

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
                }}
              >
                Manage Campaigns
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Review and manage all campaigns on the platform
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchCampaigns}
              disabled={loading}
              sx={{
                borderRadius: 2,
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
              }}
            >
              Refresh
            </Button>
          </Box>
        </motion.div>

        {/* Error/Success Messages */}
        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
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
              Reset Filters
            </Button>
          </Box>
        </Paper>

        {/* Table */}
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
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Charity</TableCell>
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Progress</TableCell>
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Status</TableCell>
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                      No campaigns found
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((campaign) => {
                    const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
                    return (
                      <TableRow key={campaign._id}>
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
                              </Typography>
                              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                                {campaign.category}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                            {campaign.charityId?.fullName || 'Unknown'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ minWidth: 150 }}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                                ₹{campaign.raisedAmount?.toLocaleString('en-IN') || 0}
                              </Typography>
                              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                                ₹{campaign.goalAmount?.toLocaleString('en-IN') || 0}
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
                              {Math.round(progress)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(campaign)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {campaign.status === 'pending' && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton
                                    size="small"
                                    sx={{ color: '#2ecc71' }}
                                    onClick={() => openActionDialog(campaign, 'approve')}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton
                                    size="small"
                                    sx={{ color: '#e74c3c' }}
                                    onClick={() => openActionDialog(campaign, 'reject')}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {campaign.status === 'active' && (
                              <Tooltip title="Pause">
                                <IconButton
                                  size="small"
                                  sx={{ color: '#3498db' }}
                                  onClick={() => openActionDialog(campaign, 'pause')}
                                >
                                  <PauseIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {campaign.status === 'paused' && (
                              <Tooltip title="Resume">
                                <IconButton
                                  size="small"
                                  sx={{ color: '#2ecc71' }}
                                  onClick={() => openActionDialog(campaign, 'resume')}
                                >
                                  <PlayArrowIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                sx={{ color: '#e74c3c' }}
                                onClick={() => openActionDialog(campaign, 'delete')}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
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

        {/* Action Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: isDark ? 'rgba(20,20,32,0.95)' : '#ffffff',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <DialogTitle>
            {dialogAction.charAt(0).toUpperCase() + dialogAction.slice(1)} Campaign
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              Are you sure you want to {dialogAction} campaign
              <strong>{selectedCampaign?.title}</strong>?
              {dialogAction === 'delete' && ' This action cannot be undone.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleCampaignAction(dialogAction)}
              sx={{
                borderRadius: 2,
                backgroundColor: dialogAction === 'delete' || dialogAction === 'reject' ? '#e74c3c' : '#2ecc71',
                '&:hover': {
                  backgroundColor: dialogAction === 'delete' || dialogAction === 'reject' ? '#c0392b' : '#27ae60',
                },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminManageCampaigns;
