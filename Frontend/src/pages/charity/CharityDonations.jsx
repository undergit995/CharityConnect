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
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  PictureAsPdf as PdfIcon,
  GetApp as ExcelIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';

const CharityDonations = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({
    totalDonations: 0,
    totalAmount: 0,
    averageAmount: 0,
    totalDonors: 0,
  });

  const itemsPerPage = 10;

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/charity/donations', {
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm,
          status: filterStatus,
        },
      });
      setDonations(response.data.donations || []);
      setTotalPages(response.data.totalPages || 1);
      if (response.data.summary) {
        setSummary(response.data.summary);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [page, searchTerm, filterStatus]);

  const getStatusChip = (status) => {
    const statusMap = {
      Pending: { label: 'Pending', color: '#f39c12' },
      Completed: { label: 'Completed', color: '#2ecc71' },
      Failed: { label: 'Failed', color: '#e74c3c' },
      Refunded: { label: 'Refunded', color: '#95a5a6' },
    };
    const s = statusMap[status] || { label: status || 'Unknown', color: '#7f8c8d' };
    return (
      <Chip
        label={s.label}
        size="small"
        title={status}
        sx={{ backgroundColor: `${s.color}20`, color: s.color }}
      />
    );
  };

  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    setOpenDialog(true);
  };

  const stats = [
    { 
      label: 'Total Donations', 
      value: summary.totalDonations, 
      icon: <ReceiptIcon />, 
      color: '#3498db' 
    },
    { 
      label: 'Total Amount', 
      value: `₹${summary.totalAmount?.toLocaleString('en-IN') || 0}`, 
      icon: <MoneyIcon />, 
      color: '#2ecc71' 
    },
    { 
      label: 'Average Donation', 
      value: `₹${summary.averageAmount?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || 0}`, 
      icon: <TrendingUpIcon />, 
      color: '#9b59b6' 
    },
    { 
      label: 'Total Donors', 
      value: summary.totalDonors, 
      icon: <PeopleIcon />, 
      color: '#f39c12' 
    },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
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
                Donations
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Track and manage all donations received by your charity
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<PdfIcon />}
                sx={{ borderRadius: 2 }}
              >
                PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<ExcelIcon />}
                sx={{ borderRadius: 2 }}
              >
                Excel
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchDonations}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </motion.div>

        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

        {/* Stats */}
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
              placeholder="Search donations..."
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
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
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
                  <TableCell>Donor</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Campaign</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="center">Status</TableCell>
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
                ) : donations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                      No donations found
                    </TableCell>
                  </TableRow>
                ) : (
                  donations.map((donation) => (
                    <TableRow key={donation._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {donation.donorId?.fullName?.charAt(0) || 'D'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                              {donation.donorId?.fullName || 'Anonymous'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                              {donation.donorId?.email || ''}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2ecc71' }}>
                          ₹{donation.amount?.toLocaleString('en-IN') || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                          {donation.campaignId?.title || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(donation.status)}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDonation(donation)}
                            sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}
                          >
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
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                  },
                }}
              />
            </Box>
          )}
        </Paper>

        {/* Donation Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: isDark ? 'rgba(20,20,32,0.95)' : '#ffffff',
              backdropFilter: 'blur(20px)',
              minWidth: 400,
            },
          }}
        >
          <DialogTitle>Donation Details</DialogTitle>
          <DialogContent>
            {selectedDonation && (
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Donor
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      {selectedDonation.donorId?.fullName || 'Anonymous'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Amount
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2ecc71' }}>
                      ₹{selectedDonation.amount?.toLocaleString('en-IN') || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Campaign
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      {selectedDonation.campaignId?.title || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Status
                    </Typography>
                    {getStatusChip(selectedDonation.status)}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Date
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      {new Date(selectedDonation.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  {selectedDonation.message && (
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                        Message
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e', fontStyle: 'italic' }}>
                        "{selectedDonation.message}"
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CharityDonations;