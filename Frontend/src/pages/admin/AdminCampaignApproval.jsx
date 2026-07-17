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
  Grid,
  Card,
  CardContent,
  Pagination,
  CircularProgress,
  Alert,
  Divider,
  Tab,
  Tabs,
  useMediaQuery,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Campaign as CampaignIcon,
  Pending as PendingIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Close as CloseIcon,
  Verified as VerifiedIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';
import { formatDistanceToNow } from 'date-fns';

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const AdminCampaignApproval = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0,
    completed: 0,
  });

  const itemsPerPage = 10;

  // Fetch campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const statusMap = ['pending', 'approved', 'rejected', 'all'];
      const response = await api.get('/admin/campaigns', {
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm,
          status: statusMap[tabValue] || 'pending',
        },
      });
      setCampaigns(response.data.campaigns || []);
      setTotalPages(response.data.totalPages || 1);
      if (response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [page, searchTerm, tabValue]);

  // Handle approve
  const handleApprove = async () => {
    if (!selectedCampaign) return;
    
    try {
      await api.put(`/admin/campaigns/${selectedCampaign._id}/approve`, {
        adminNote: `Approved by ${user?.fullName || 'Admin'}`,
      });
      setSuccess(`Campaign "${selectedCampaign.title}" approved successfully!`);
      setOpenDialog(false);
      fetchCampaigns();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve campaign');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedCampaign) return;
    
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    try {
      await api.put(`/admin/campaigns/${selectedCampaign._id}/reject`, {
        rejectionReason: rejectionReason.trim(),
      });
      setSuccess(`Campaign "${selectedCampaign.title}" rejected successfully!`);
      setOpenDialog(false);
      setRejectionReason('');
      fetchCampaigns();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject campaign');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle pause/resume
  const handlePauseResume = async (campaign, action) => {
    if (!campaign) return;

    try {
      await api.put(`/admin/campaigns/${campaign._id}/${action}`);
      setSuccess(
        `Campaign "${campaign.title}" ${action}d successfully!`,
      );
      fetchCampaigns();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} campaign`);
      setTimeout(() => setError(""), 3000);
    }
  };

  const openActionDialog = (campaign, action) => {
    setSelectedCampaign(campaign);
    setDialogAction(action);
    setRejectionReason('');
    setOpenDialog(true);
  };

  const getStatusChip = (campaign) => {
    if (campaign.approvalStatus === 'pending') {
      return <Chip label="Pending" size="small" sx={{ backgroundColor: 'rgba(243, 156, 18, 0.15)', color: '#f39c12' }} />;
    }
    if (campaign.approvalStatus === 'approved' && campaign.status === 'active') {
      return <Chip label="Active" size="small" sx={{ backgroundColor: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71' }} />;
    }
    if (campaign.approvalStatus === 'approved' && campaign.status === 'completed') {
      return <Chip label="Completed" size="small" sx={{ backgroundColor: 'rgba(155, 89, 182, 0.15)', color: '#9b59b6' }} />;
    }
    if (campaign.approvalStatus === 'rejected') {
      return <Chip label="Rejected" size="small" sx={{ backgroundColor: 'rgba(231, 76, 60, 0.15)', color: '#e74c3c' }} />;
    }
    return <Chip label={campaign.status} size="small" sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }} />;
  };

  const statCards = [
    { label: 'Pending Approval', value: stats.pending, icon: <PendingIcon />, color: '#f39c12' },
    { label: 'Approved', value: stats.approved, icon: <CheckCircleIcon />, color: '#2ecc71' },
    { label: 'Rejected', value: stats.rejected, icon: <CancelIcon />, color: '#e74c3c' },
    { label: 'Total', value: stats.total, icon: <CampaignIcon />, color: '#3498db' },
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
                Campaign Approval
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Review and manage campaign submissions
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchCampaigns}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>
        </motion.div>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
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

        {/* Filters & Tabs */}
        <Paper
          sx={{
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
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
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => setSearchTerm('')}
                sx={{ borderRadius: 2 }}
              >
                Reset
              </Button>
            </Box>
          </Box>

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
            <Tab label={`Pending (${stats.pending})`} />
            <Tab label={`Active (${stats.approved})`} />
            <Tab label={`Rejected (${stats.rejected})`} />
            <Tab label="All" />
          </Tabs>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Campaign</TableCell>
                  <TableCell>Charity</TableCell>
                  <TableCell>Goal</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                      No campaigns found
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((campaign) => {
                    const progress = ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100;
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
                                {campaign.category} • {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24 }}>
                              {campaign.charityId?.fullName?.charAt(0) || 'C'}
                            </Avatar>
                            <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                              {campaign.charityId?.charityDetails?.organizationName || campaign.charityId?.fullName || 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                            ₹{campaign.goalAmount?.toLocaleString('en-IN') || 0}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ minWidth: 120 }}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                                ₹{campaign.raisedAmount?.toLocaleString('en-IN') || 0}
                              </Typography>
                              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                                {Math.round(progress)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(progress, 100)}
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                },
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(campaign)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => openActionDialog(campaign, 'view')}
                                sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {campaign.approvalStatus === 'pending' && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton
                                    size="small"
                                    sx={{ color: '#2ecc71' }}
                                    onClick={() => openActionDialog(campaign, 'approve')}
                                  >
                                    <ThumbUpIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton
                                    size="small"
                                    sx={{ color: '#e74c3c' }}
                                    onClick={() => openActionDialog(campaign, 'reject')}
                                  >
                                    <ThumbDownIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {campaign.status === 'active' && (
                              <Tooltip title="Pause Campaign">
                                <IconButton
                                  size="small"
                                  sx={{ color: '#3498db' }}
                                  onClick={() => handlePauseResume(campaign, 'pause')}
                                >
                                  <PauseIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {campaign.status === 'paused' && (
                              <Tooltip title="Resume Campaign">
                                <IconButton
                                  size="small"
                                  sx={{ color: '#2ecc71' }}
                                  onClick={() => handlePauseResume(campaign, 'resume')}
                                >
                                  <PlayArrowIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
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
          onClose={() => {
            setOpenDialog(false);
            setRejectionReason('');
          }}
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
          {selectedCampaign && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {dialogAction === 'approve' && 'Approve Campaign'}
                    {dialogAction === 'reject' && 'Reject Campaign'}
                    {dialogAction === 'view' && 'Campaign Details'}
                  </Typography>
                  <IconButton onClick={() => setOpenDialog(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                {/* Campaign Info */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedCampaign.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    {selectedCampaign.category} • {selectedCampaign.location || 'No location'}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                        Goal Amount
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{selectedCampaign.goalAmount?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                        Raised Amount
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2ecc71' }}>
                        ₹{selectedCampaign.raisedAmount?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                        Description
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                        {selectedCampaign.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                        Charity
                      </Typography>
                      <Typography variant="body2">
                        {selectedCampaign.charityId?.charityDetails?.organizationName || selectedCampaign.charityId?.fullName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                        End Date
                      </Typography>
                      <Typography variant="body2">
                        {new Date(selectedCampaign.endDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {dialogAction === 'reject' && (
                  <TextField
                    fullWidth
                    label="Rejection Reason"
                    multiline
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    sx={{ mt: 2 }}
                  />
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>
                  Cancel
                </Button>
                {dialogAction === 'approve' && (
                  <Button
                    variant="contained"
                    onClick={handleApprove}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#2ecc71',
                      '&:hover': { backgroundColor: '#27ae60' },
                    }}
                  >
                    Approve Campaign
                  </Button>
                )}
                {dialogAction === 'reject' && (
                  <Button
                    variant="contained"
                    onClick={handleReject}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#e74c3c',
                      '&:hover': { backgroundColor: '#c0392b' },
                    }}
                  >
                    Reject Campaign
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminCampaignApproval;