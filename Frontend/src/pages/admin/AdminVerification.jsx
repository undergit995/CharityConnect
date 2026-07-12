import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
  Tab,
  Tabs,
  Badge,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  InputLabel,
  Pagination,
  useMediaQuery,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Pending as PendingIcon,
  Verified as VerifiedIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../Theme/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import verificationService from '../../Services/verificationServices';
import { formatDistanceToNow } from 'date-fns';

// Tab Panel Component
const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

// Status Chip Component
const StatusChip = ({ status }) => {
  const statusMap = {
    pending: { label: 'Pending', color: '#f39c12', icon: <PendingIcon /> },
    submitted: { label: 'Submitted', color: '#3498db', icon: <UploadIcon /> },
    verified: { label: 'Verified', color: '#2ecc71', icon: <VerifiedIcon /> },
    rejected: { label: 'Rejected', color: '#e74c3c', icon: <ErrorIcon /> },
    'needs-info': { label: 'Needs Info', color: '#e67e22', icon: <ErrorIcon /> },
  };

  const data = statusMap[status] || statusMap.pending;

  return (
    <Chip
      icon={data.icon}
      label={data.label}
      size="small"
      sx={{
        backgroundColor: `${data.color}20`,
        color: data.color,
        fontWeight: 600,
      }}
    />
  );
};

// Document Status Component
const DocumentStatusBadge = ({ status }) => {
  const statusMap = {
    pending: { label: 'Pending', color: '#f39c12' },
    submitted: { label: 'Submitted', color: '#3498db' },
    verified: { label: 'Verified', color: '#2ecc71' },
    rejected: { label: 'Rejected', color: '#e74c3c' },
    'needs-info': { label: 'Needs Info', color: '#e67e22' },
  };

  const data = statusMap[status] || statusMap.pending;

  return (
    <Chip
      label={data.label}
      size="small"
      sx={{
        backgroundColor: `${data.color}20`,
        color: data.color,
        fontWeight: 500,
        height: 24,
        '& .MuiChip-label': { fontSize: '0.7rem', px: 1 },
      }}
    />
  );
};

// Document Details Dialog
const DocumentDetailsDialog = ({ open, onClose, document, onVerify }) => {
  const { isDark } = useTheme();
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState('');

  const handleVerify = () => {
    if (action === 'reject' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    onVerify(document.documentId, action, rejectionReason);
    setRejectionReason('');
    setAction('');
    onClose();
  };

  if (!document) return null;

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Document Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {document.label}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              {document.description}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <DocumentStatusBadge status={document.status} />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              Uploaded
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {document.uploadedAt ? formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true }) : 'N/A'}
            </Typography>
          </Grid>
          {document.adminNotes && (
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                Admin Notes
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  mt: 0.5,
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <Typography variant="body2">{document.adminNotes}</Typography>
              </Paper>
            </Grid>
          )}
          {document.status === 'pending' || document.status === 'submitted' && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Verification Action
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => {
                    setAction('verified');
                    handleVerify();
                  }}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#2ecc71',
                    '&:hover': { backgroundColor: '#27ae60' },
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CancelIcon />}
                  onClick={() => setAction('reject')}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#e74c3c',
                    '&:hover': { backgroundColor: '#c0392b' },
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ErrorIcon />}
                  onClick={() => {
                    setAction('needs-info');
                    handleVerify();
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Needs Info
                </Button>
              </Box>
              {action === 'reject' && (
                <TextField
                  fullWidth
                  label="Rejection Reason"
                  multiline
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  sx={{ mt: 2 }}
                />
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Admin Verification Component
const AdminVerification = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    submitted: 0,
    verified: 0,
    rejected: 0,
  });

  const itemsPerPage = 10;

  // Fetch charities
  const fetchCharities = async () => {
    setLoading(true);
    setError('');
    try {
      const statusMap = ['pending', 'submitted', 'verified', 'rejected', 'all'];
      const response = await verificationService.getPendingVerifications({
        page,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusMap[tabValue] || 'all',
      });
      setCharities(response.data || []);
      setTotalPages(response.totalPages || 1);
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch charities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, [page, searchTerm, tabValue, filterStatus]);

  // Handle document verification
  const handleVerifyDocument = async (charityId, documentId, status, notes = '') => {
    try {
      await verificationService.verifyDocument(charityId, documentId, status, notes);
      setSuccess(`Document ${status === 'verified' ? 'approved' : 'rejected'} successfully`);
      // Refresh data
      fetchCharities();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify document');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle verify all documents
  const handleVerifyAll = async (charityId) => {
    try {
      await verificationService.verifyAllDocuments(charityId);
      setSuccess('All documents verified successfully!');
      fetchCharities();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify all documents');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Get verification progress
  const getProgress = (documents) => {
    if (!documents || documents.length === 0) return 0;
    const required = documents.filter(d => d.required);
    const verified = required.filter(d => d.status === 'verified');
    return (verified.length / required.length) * 100;
  };

  // Get document stats
  const getDocumentStats = (documents) => {
    const stats = {
      total: documents?.length || 0,
      verified: documents?.filter(d => d.status === 'verified').length || 0,
      rejected: documents?.filter(d => d.status === 'rejected').length || 0,
      pending: documents?.filter(d => d.status === 'pending' || d.status === 'submitted').length || 0,
    };
    return stats;
  };

  // Stats cards
  const statCards = [
    { label: 'Total Applications', value: stats.total, icon: <BusinessIcon />, color: '#3498db' },
    { label: 'Pending Review', value: stats.pending + stats.submitted, icon: <PendingIcon />, color: '#f39c12' },
    { label: 'Verified', value: stats.verified, icon: <VerifiedIcon />, color: '#2ecc71' },
    { label: 'Rejected', value: stats.rejected, icon: <ErrorIcon />, color: '#e74c3c' },
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
                Charity Verification
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Review and verify charity applications
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchCharities}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>
        </motion.div>

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

        {/* Stats Cards */}
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
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
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
            <Tab label={`Pending (${stats.pending + stats.submitted})`} />
            <Tab label={`Verified (${stats.verified})`} />
            <Tab label={`Rejected (${stats.rejected})`} />
            <Tab label="All" />
          </Tabs>

          {/* Charity List */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Charity</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Documents</TableCell>
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
                ) : charities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                      No charities found
                    </TableCell>
                  </TableRow>
                ) : (
                  charities.map((charity) => {
                    const progress = getProgress(charity.documents);
                    const docStats = getDocumentStats(charity.documents);
                    const isEligible = docStats.verified === docStats.total && docStats.rejected === 0;

                    return (
                      <TableRow key={charity._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={charity.profileImage}
                              sx={{ width: 40, height: 40 }}
                            >
                              {charity.charityDetails?.organizationName?.charAt(0) || 'C'}
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
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            <Chip
                              label={`${docStats.verified}/${docStats.total}`}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(46, 204, 113, 0.15)',
                                color: '#2ecc71',
                                fontWeight: 600,
                              }}
                            />
                            {docStats.rejected > 0 && (
                              <Chip
                                label={`${docStats.rejected} rejected`}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(231, 76, 60, 0.15)',
                                  color: '#e74c3c',
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                                {Math.round(progress)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                '& .MuiLinearProgress-bar': {
                                  background: isEligible
                                    ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                },
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={charity.verificationStatus || charity.status} />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                            <Tooltip title="View Documents">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedCharity(charity);
                                  setOpenDetailsDialog(true);
                                }}
                                sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {(charity.verificationStatus === 'pending' || charity.verificationStatus === 'submitted') && (
                              <Tooltip title="Verify All">
                                <IconButton
                                  size="small"
                                  onClick={() => handleVerifyAll(charity._id)}
                                  sx={{ color: '#2ecc71' }}
                                >
                                  <VerifiedIcon fontSize="small" />
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

        {/* Document Details Dialog */}
        <DocumentDetailsDialog
          open={openDetailsDialog}
          onClose={() => {
            setOpenDetailsDialog(false);
            setSelectedCharity(null);
          }}
          document={selectedCharity?.documents?.find(d => d.documentId === selectedDocument?.documentId) || null}
          onVerify={handleVerifyDocument}
          charityId={selectedCharity?._id}
        />
      </Container>
    </Box>
  );
};

export default AdminVerification;