import React, { useState, useEffect, useCallback } from 'react';
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
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';
import { formatDistanceToNow } from 'date-fns';

const StatsCard = ({ title, value, icon, color }) => {
  const { isDark } = useTheme();
  return (
    <Card sx={{ height: '100%', borderRadius: 3, background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ backgroundColor: `${color}20`, color }}>{icon}</Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>{value}</Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>{title}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminDonations = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ totalDonations: 0, totalAmount: 0, uniqueDonors: 0 });

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/donations', {
        params: { page, limit: 10, search: searchTerm, status: filterStatus },
      });
      setDonations(response.data.donations || []);
      setTotalPages(response.data.pagination.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterStatus]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/admin/stats'); // Assuming this endpoint provides donation stats
      if (response.data.success && response.data.data.donations) {
        setStats({
          totalDonations: response.data.data.donations.totalDonations || 0,
          totalAmount: response.data.data.donations.totalAmount || 0,
          uniqueDonors: response.data.data.users.donor || 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDonations();
      fetchStats();
    }
  }, [user, fetchDonations, fetchStats]);

  const getStatusChip = (status) => {
    const statusMap = {
      Completed: { color: '#2ecc71' },
      Pending: { color: '#f39c12' },
      Failed: { color: '#e74c3c' },
      Refunded: { color: '#95a5a6' },
    };
    const s = statusMap[status] || { color: '#3498db' };
    return <Chip label={status} size="small" sx={{ backgroundColor: `${s.color}20`, color: s.color }} />;
  };

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>All Donations</Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>View and manage all platform donations</Typography>
            </Box>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchDonations} disabled={loading} sx={{ borderRadius: 2 }}>Refresh</Button>
          </Box>
        </motion.div>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <StatsCard title="Total Donations" value={stats.totalDonations.toLocaleString()} icon={<ReceiptIcon />} color="#3498db" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard title="Total Amount Raised" value={`₹${stats.totalAmount.toLocaleString('en-IN')}`} icon={<MoneyIcon />} color="#2ecc71" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard title="Unique Donors" value={stats.uniqueDonors.toLocaleString()} icon={<PeopleIcon />} color="#9b59b6" />
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search by donor, charity, campaign..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }} /></InputAdornment> }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Status">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<FilterIcon />} onClick={() => { setSearchTerm(''); setFilterStatus('all'); }} sx={{ borderRadius: 2 }}>Reset</Button>
          </Box>
        </Paper>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden', background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Donor</TableCell>
                  <TableCell>Charity</TableCell>
                  <TableCell>Campaign</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell>
                  </TableRow>
                ) : donations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: isDark ? '#a0a0b8' : '#4a4a6a' }}>No donations found</TableCell>
                  </TableRow>
                ) : (
                  donations.map((donation) => (
                    <TableRow key={donation._id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                            {donation.isAnonymous ? 'Anonymous' : donation.donorId?.fullName || 'Guest'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                            {donation.donorId?.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                          {donation.charityId?.charityDetails?.organizationName || donation.charityId?.fullName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                          {donation.campaignId?.title}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2ecc71' }}>
                          ₹{donation.amount.toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={new Date(donation.donationDate).toLocaleString()}>
                          <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                            {formatDistanceToNow(new Date(donation.donationDate), { addSuffix: true })}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{getStatusChip(donation.status)}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => navigate(`/admin/donations/${donation._id}`)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {donations.length > 0 && (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                sx={{ '& .MuiPaginationItem-root': { color: isDark ? '#a0a0b8' : '#4a4a6a' } }}
              />
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDonations;