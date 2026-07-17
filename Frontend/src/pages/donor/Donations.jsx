import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Grid,
  Button,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';
import { format } from 'date-fns';

const Donations = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sort: 'desc',
  });

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: 10,
        status: filters.status,
        search: filters.search,
        sort: filters.sort,
      };
      const response = await api.get('/donor/donations', { params });
      setDonations(response.data.donations || []);      
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load donations.');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const getStatusChip = (status) => {
    const statusMap = {
      Pending: { label: 'Pending', color: '#f39c12' },
      Completed: { label: 'Completed', color: '#2ecc71' },
      failed: { label: 'Failed', color: '#e74c3c' },
      refunded: { label: 'Refunded', color: '#95a5a6' },
    };
    const s = statusMap[status] || statusMap.pending;
    return (
      <Chip
        label={s.label}
        size="small"
        sx={{ backgroundColor: `${s.color}20`, color: s.color, fontWeight: 500 }}
      />
    );
  };

  return (
    <Container maxWidth="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              My Donations
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              Track all your contributions and download receipts.
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchDonations} disabled={loading}>
            Refresh
          </Button>
        </Box>

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="search"
                placeholder="Search by campaign title or receipt number..."
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <Select name="status" value={filters.status} onChange={handleFilterChange}>
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <Select name="sort" value={filters.sort} onChange={handleFilterChange}>
                  <MenuItem value="desc">Newest First</MenuItem>
                  <MenuItem value="asc">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Campaign</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Receipt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : donations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Typography color="textSecondary">No donations found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  donations.map((donation) => (
                    <TableRow key={donation._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {donation.campaignId?.title || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {donation.receiptNumber}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: '#2ecc71' }}>
                        ₹{donation.amount?.toLocaleString('en-IN') || 0}
                      </TableCell>
                      <TableCell align="center">{getStatusChip(donation.status)}</TableCell>
                      <TableCell align="center">
                        {format(new Date(donation.donationDate), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell align="center">
                        {donation.receiptUrl ? (
                          <Tooltip title="Download Receipt">
                            <IconButton size="small" href={donation.receiptUrl} target="_blank">
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Donations;