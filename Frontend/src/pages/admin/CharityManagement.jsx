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
} from '@mui/material';
import {
  Search as SearchIcon,
  Verified as VerifiedIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Pending,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';

const AdminManageCharity = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const itemsPerPage = 10;

  // Fetch charities
  const fetchCharities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/charities', {
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm,
          status: filterStatus,
        },
      });
      setCharities(response.data.charities || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch charities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, [page, searchTerm, filterStatus]);

  // Handle charity actions (verify, reject, suspend)
  const handleCharityAction = async (action) => {
    if (!selectedCharity) return;
    
    try {
      await api.put(`/admin/charities/${selectedCharity._id}`, { action });
      setSuccess(`Charity ${action}ed successfully`);
      setOpenDialog(false);
      fetchCharities();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} charity`);
    }
  };

  // Open dialog for action
  const openActionDialog = (charity, action) => {
    setSelectedCharity(charity);
    setDialogAction(action);
    setOpenDialog(true);
  };

  // Get status chip
  const getStatusChip = (charity) => {
    if (!charity.isApproved) {
      return <Chip label="Pending" size="small" sx={{ backgroundColor: 'rgba(243, 156, 18, 0.15)', color: '#f39c12' }} />;
    }
    if (charity.charityDetails?.verified) {
      return <Chip label="Verified" size="small" sx={{ backgroundColor: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71' }} />;
    }
    if (!charity.isActive) {
      return <Chip label="Suspended" size="small" sx={{ backgroundColor: 'rgba(231, 76, 60, 0.15)', color: '#e74c3c' }} />;
    }
    return <Chip label="Active" size="small" sx={{ backgroundColor: 'rgba(52, 152, 219, 0.15)', color: '#3498db' }} />;
  };

  // Stats
  const stats = [
    { label: 'Total Charities', value: charities.length, icon: <BusinessIcon />, color: '#3498db' },
    { label: 'Pending Approval', value: charities.filter(c => !c.isApproved).length, icon: <Pending />, color: '#f39c12' },
    { label: 'Verified', value: charities.filter(c => c.charityDetails?.verified).length, icon: <VerifiedIcon />, color: '#2ecc71' },
    { label: 'Suspended', value: charities.filter(c => !c.isActive).length, icon: <BlockIcon />, color: '#e74c3c' },
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
                Manage Charities
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Review and manage charity organizations on the platform
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchCharities}
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
              placeholder="Search charities..."
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
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
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
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Charity</TableCell>
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Contact</TableCell>
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Status</TableCell>
                  <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>Campaigns</TableCell>
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
                ) : charities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                      No charities found
                    </TableCell>
                  </TableRow>
                ) : (
                  charities.map((charity) => (
                    <TableRow key={charity._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={charity.profileImage} sx={{ width: 40, height: 40 }}>
                            {charity.fullName?.charAt(0) || 'C'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                              {charity.charityDetails?.organizationName || charity.fullName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                              {charity.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                          {charity.phone}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                          {charity.address?.city || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(charity)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                          {charity.stats?.totalCampaigns || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {!charity.isApproved && (
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                sx={{ color: '#2ecc71' }}
                                onClick={() => openActionDialog(charity, 'approve')}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {charity.isApproved && !charity.charityDetails?.verified && (
                            <Tooltip title="Verify">
                              <IconButton
                                size="small"
                                sx={{ color: '#3498db' }}
                                onClick={() => openActionDialog(charity, 'verify')}
                              >
                                <VerifiedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {charity.isActive && charity.isApproved && (
                            <Tooltip title="Suspend">
                              <IconButton
                                size="small"
                                sx={{ color: '#e74c3c' }}
                                onClick={() => openActionDialog(charity, 'suspend')}
                              >
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {!charity.isActive && (
                            <Tooltip title="Activate">
                              <IconButton
                                size="small"
                                sx={{ color: '#2ecc71' }}
                                onClick={() => openActionDialog(charity, 'activate')}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              sx={{ color: '#e74c3c' }}
                              onClick={() => openActionDialog(charity, 'delete')}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {charities.length > 0 && (
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
            {dialogAction.charAt(0).toUpperCase() + dialogAction.slice(1)} Charity
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              Are you sure you want to {dialogAction}{' '}
              <strong>{selectedCharity?.charityDetails?.organizationName || selectedCharity?.fullName}</strong>?
              {dialogAction === 'delete' && ' This action cannot be undone.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleCharityAction(dialogAction)}
              sx={{
                borderRadius: 2,
                backgroundColor: dialogAction === 'delete' || dialogAction === 'suspend' ? '#e74c3c' : '#2ecc71',
                '&:hover': {
                  backgroundColor: dialogAction === 'delete' || dialogAction === 'suspend' ? '#c0392b' : '#27ae60',
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

export default AdminManageCharity;
