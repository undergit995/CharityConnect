// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   Grid,
//   Button,
//   Chip,
//   Alert,
//   CircularProgress,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Avatar,
//   Card,
//   CardContent,
//   LinearProgress,
//   Tab,
//   Tabs,
//   Badge,
//   MenuItem,
//   Select,
//   FormControl,
//   InputAdornment,
//   InputLabel,
//   Pagination,
//   useMediaQuery,
// } from '@mui/material';
// import {
//   Refresh as RefreshIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIcon,
//   Visibility as VisibilityIcon,
//   Pending as PendingIcon,
//   Verified as VerifiedIcon,
//   Error as ErrorIcon,
//   Search as SearchIcon,
//   FilterList as FilterIcon,
//   Download as DownloadIcon,
//   Business as BusinessIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Upload as UploadIcon,
//   LocationOn as LocationIcon,
//   Close as CloseIcon,
//   ThumbUp as ThumbUpIcon,
//   ThumbDown as ThumbDownIcon,
//   Assignment as AssignmentIcon,
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import { useTheme } from '../../Theme/ThemeContext';
// import { useAuth } from '../../Context/AuthContext';
// import verificationService from '../../Services/verificationServices';
// import { formatDistanceToNow } from 'date-fns';

// // Tab Panel Component
// const TabPanel = ({ children, value, index }) => (
//   <div role="tabpanel" hidden={value !== index}>
//     {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
//   </div>
// );

// // Status Chip Component
// const StatusChip = ({ status }) => {
//   const statusMap = {
//     pending: { label: 'Pending', color: '#f39c12', icon: <PendingIcon /> },
//     submitted: { label: 'Submitted', color: '#3498db', icon: <UploadIcon /> },
//     verified: { label: 'Verified', color: '#2ecc71', icon: <VerifiedIcon /> },
//     rejected: { label: 'Rejected', color: '#e74c3c', icon: <ErrorIcon /> },
//     'needs-info': { label: 'Needs Info', color: '#e67e22', icon: <ErrorIcon /> },
//   };

//   const data = statusMap[status] || statusMap.pending;

//   return (
//     <Chip
//       icon={data.icon}
//       label={data.label}
//       size="small"
//       sx={{
//         backgroundColor: `${data.color}20`,
//         color: data.color,
//         fontWeight: 600,
//       }}
//     />
//   );
// };

// // Document Status Component
// const DocumentStatusBadge = ({ status }) => {
//   const statusMap = {
//     pending: { label: 'Pending', color: '#f39c12' },
//     submitted: { label: 'Submitted', color: '#3498db' },
//     verified: { label: 'Verified', color: '#2ecc71' },
//     rejected: { label: 'Rejected', color: '#e74c3c' },
//     'needs-info': { label: 'Needs Info', color: '#e67e22' },
//   };

//   const data = statusMap[status] || statusMap.pending;

//   return (
//     <Chip
//       label={data.label}
//       size="small"
//       sx={{
//         backgroundColor: `${data.color}20`,
//         color: data.color,
//         fontWeight: 500,
//         height: 24,
//         '& .MuiChip-label': { fontSize: '0.7rem', px: 1 },
//       }}
//     />
//   );
// };

// // Document Details Dialog
// const DocumentDetailsDialog = ({ open, onClose, document, onVerify }) => {
//   const { isDark } = useTheme();
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [action, setAction] = useState('');

//   const handleVerify = () => {
//     if (action === 'reject' && !rejectionReason.trim()) {
//       alert('Please provide a rejection reason');
//       return;
//     }
//     onVerify(document.documentId, action, rejectionReason);
//     setRejectionReason('');
//     setAction('');
//     onClose();
//   };

//   if (!document) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           background: isDark ? 'rgba(20,20,32,0.95)' : '#ffffff',
//           backdropFilter: 'blur(20px)',
//         },
//       }}
//     >
//       <DialogTitle>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h6" sx={{ fontWeight: 700 }}>
//             Document Details
//           </Typography>
//           <IconButton onClick={onClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//               {document.label}
//             </Typography>
//             <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
//               {document.description}
//             </Typography>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
//               Status
//             </Typography>
//             <Box sx={{ mt: 0.5 }}>
//               <DocumentStatusBadge status={document.status} />
//             </Box>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
//               Uploaded
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 500 }}>
//               {document.uploadedAt ? formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true }) : 'N/A'}
//             </Typography>
//           </Grid>
//           {document.adminNotes && (
//             <Grid item xs={12}>
//               <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
//                 Admin Notes
//               </Typography>
//               <Paper
//                 sx={{
//                   p: 2,
//                   mt: 0.5,
//                   borderRadius: 2,
//                   bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
//                 }}
//               >
//                 <Typography variant="body2">{document.adminNotes}</Typography>
//               </Paper>
//             </Grid>
//           )}
//           {document.status === 'pending' || document.status === 'submitted' && (
//             <Grid item xs={12}>
//               <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
//                 Verification Action
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//                 <Button
//                   variant="contained"
//                   startIcon={<CheckCircleIcon />}
//                   onClick={() => {
//                     setAction('verified');
//                     handleVerify();
//                   }}
//                   sx={{
//                     borderRadius: 2,
//                     backgroundColor: '#2ecc71',
//                     '&:hover': { backgroundColor: '#27ae60' },
//                   }}
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   variant="contained"
//                   startIcon={<CancelIcon />}
//                   onClick={() => setAction('reject')}
//                   sx={{
//                     borderRadius: 2,
//                     backgroundColor: '#e74c3c',
//                     '&:hover': { backgroundColor: '#c0392b' },
//                   }}
//                 >
//                   Reject
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   startIcon={<ErrorIcon />}
//                   onClick={() => {
//                     setAction('needs-info');
//                     handleVerify();
//                   }}
//                   sx={{ borderRadius: 2 }}
//                 >
//                   Needs Info
//                 </Button>
//               </Box>
//               {action === 'reject' && (
//                 <TextField
//                   fullWidth
//                   label="Rejection Reason"
//                   multiline
//                   rows={2}
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   placeholder="Please provide a reason for rejection..."
//                   sx={{ mt: 2 }}
//                 />
//               )}
//             </Grid>
//           )}
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} sx={{ borderRadius: 2 }}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // Main Admin Verification Component
// const AdminVerification = () => {
//   const { isDark } = useTheme();
//   const { user } = useAuth();
//   const isMobile = useMediaQuery('(max-width:600px)');
  
//   const [charities, setCharities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [tabValue, setTabValue] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedCharity, setSelectedCharity] = useState(null);
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     submitted: 0,
//     verified: 0,
//     rejected: 0,
//   });

//   const itemsPerPage = 10;

//   // Fetch charities
//   const fetchCharities = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const statusMap = ['pending', 'submitted', 'verified', 'rejected', 'all'];
//       const response = await verificationService.getPendingVerifications({
//         page,
//         limit: itemsPerPage,
//         search: searchTerm,
//         status: statusMap[tabValue] || 'all',
//       });
//       setCharities(response.data || []);
//       setTotalPages(response.totalPages || 1);
//       if (response.stats) {
//         setStats(response.stats);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch charities');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCharities();
//   }, [page, searchTerm, tabValue, filterStatus]);

//   // Handle document verification
//   const handleVerifyDocument = async (charityId, documentId, status, notes = '') => {
//     try {
//       await verificationService.verifyDocument(charityId, documentId, status, notes);
//       setSuccess(`Document ${status === 'verified' ? 'approved' : 'rejected'} successfully`);
//       // Refresh data
//       fetchCharities();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to verify document');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // Handle verify all documents
//   const handleVerifyAll = async (charityId) => {
//     try {
//       await verificationService.verifyAllDocuments(charityId);
//       setSuccess('All documents verified successfully!');
//       fetchCharities();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to verify all documents');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // Get verification progress
//   const getProgress = (documents) => {
//     if (!documents || documents.length === 0) return 0;
//     const required = documents.filter(d => d.required);
//     const verified = required.filter(d => d.status === 'verified');
//     return (verified.length / required.length) * 100;
//   };

//   // Get document stats
//   const getDocumentStats = (documents) => {
//     const stats = {
//       total: documents?.length || 0,
//       verified: documents?.filter(d => d.status === 'verified').length || 0,
//       rejected: documents?.filter(d => d.status === 'rejected').length || 0,
//       pending: documents?.filter(d => d.status === 'pending' || d.status === 'submitted').length || 0,
//     };
//     return stats;
//   };

//   // Stats cards
//   const statCards = [
//     { label: 'Total Applications', value: stats.total, icon: <BusinessIcon />, color: '#3498db' },
//     { label: 'Pending Review', value: stats.pending + stats.submitted, icon: <PendingIcon />, color: '#f39c12' },
//     { label: 'Verified', value: stats.verified, icon: <VerifiedIcon />, color: '#2ecc71' },
//     { label: 'Rejected', value: stats.rejected, icon: <ErrorIcon />, color: '#e74c3c' },
//   ];

//   return (
//     <Box sx={{ py: 3 }}>
//       <Container maxWidth="xl">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//             <Box>
//               <Typography
//                 variant="h4"
//                 sx={{
//                   fontWeight: 700,
//                   color: isDark ? '#e8e8f0' : '#1a1a2e',
//                 }}
//               >
//                 Charity Verification
//               </Typography>
//               <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
//                 Review and verify charity applications
//               </Typography>
//             </Box>
//             <Button
//               variant="outlined"
//               startIcon={<RefreshIcon />}
//               onClick={fetchCharities}
//               disabled={loading}
//               sx={{ borderRadius: 2 }}
//             >
//               Refresh
//             </Button>
//           </Box>
//         </motion.div>

//         {/* Error/Success Messages */}
//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//             {error}
//           </Alert>
//         )}
//         {success && (
//           <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
//             {success}
//           </Alert>
//         )}

//         {/* Stats Cards */}
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           {statCards.map((stat, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <Card
//                   sx={{
//                     background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
//                     border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
//                     borderRadius: 3,
//                   }}
//                 >
//                   <CardContent>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                       <Avatar sx={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
//                         {stat.icon}
//                       </Avatar>
//                       <Box>
//                         <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
//                           {stat.value}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
//                           {stat.label}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Filters & Tabs */}
//         <Paper
//           sx={{
//             borderRadius: 3,
//             background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
//             border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
//             overflow: 'hidden',
//           }}
//         >
//           <Box sx={{ p: 2, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
//             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
//               <TextField
//                 placeholder="Search charities..."
//                 size="small"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 sx={{ flex: 1, minWidth: 200 }}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }} />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <FormControl size="small" sx={{ minWidth: 150 }}>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   label="Status"
//                 >
//                   <MenuItem value="all">All</MenuItem>
//                   <MenuItem value="pending">Pending</MenuItem>
//                   <MenuItem value="submitted">Submitted</MenuItem>
//                   <MenuItem value="verified">Verified</MenuItem>
//                   <MenuItem value="rejected">Rejected</MenuItem>
//                 </Select>
//               </FormControl>
//               <Button
//                 variant="outlined"
//                 startIcon={<FilterIcon />}
//                 onClick={() => {
//                   setSearchTerm('');
//                   setFilterStatus('all');
//                 }}
//                 sx={{ borderRadius: 2 }}
//               >
//                 Reset
//               </Button>
//             </Box>
//           </Box>

//           <Tabs
//             value={tabValue}
//             onChange={(e, v) => setTabValue(v)}
//             sx={{
//               borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
//               px: 2,
//               '& .MuiTab-root': {
//                 color: isDark ? '#a0a0b8' : '#4a4a6a',
//                 '&.Mui-selected': {
//                   color: '#667eea',
//                 },
//               },
//             }}
//           >
//             <Tab label={`Pending (${stats.pending + stats.submitted})`} />
//             <Tab label={`Verified (${stats.verified})`} />
//             <Tab label={`Rejected (${stats.rejected})`} />
//             <Tab label="All" />
//           </Tabs>

//           {/* Charity List */}
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Charity</TableCell>
//                   <TableCell>Contact</TableCell>
//                   <TableCell>Documents</TableCell>
//                   <TableCell>Progress</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell align="center">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
//                       <CircularProgress />
//                     </TableCell>
//                   </TableRow>
//                 ) : charities.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={6} align="center" sx={{ py: 4, color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
//                       No charities found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   charities.map((charity) => {
//                     const progress = getProgress(charity.documents);
//                     const docStats = getDocumentStats(charity.documents);
//                     const isEligible = docStats.verified === docStats.total && docStats.rejected === 0;

//                     return (
//                       <TableRow key={charity._id}>
//                         <TableCell>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                             <Avatar
//                               src={charity.profileImage}
//                               sx={{ width: 40, height: 40 }}
//                             >
//                               {charity.charityDetails?.organizationName?.charAt(0) || 'C'}
//                             </Avatar>
//                             <Box>
//                               <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
//                                 {charity.charityDetails?.organizationName || charity.fullName}
//                               </Typography>
//                               <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
//                                 {charity.email}
//                               </Typography>
//                             </Box>
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
//                             {charity.phone}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
//                             {charity.address?.city || 'N/A'}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
//                             <Chip
//                               label={`${docStats.verified}/${docStats.total}`}
//                               size="small"
//                               sx={{
//                                 backgroundColor: 'rgba(46, 204, 113, 0.15)',
//                                 color: '#2ecc71',
//                                 fontWeight: 600,
//                               }}
//                             />
//                             {docStats.rejected > 0 && (
//                               <Chip
//                                 label={`${docStats.rejected} rejected`}
//                                 size="small"
//                                 sx={{
//                                   backgroundColor: 'rgba(231, 76, 60, 0.15)',
//                                   color: '#e74c3c',
//                                   fontWeight: 600,
//                                 }}
//                               />
//                             )}
//                           </Box>
//                         </TableCell>
//                         <TableCell sx={{ minWidth: 100 }}>
//                           <Box>
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                               <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
//                                 {Math.round(progress)}%
//                               </Typography>
//                             </Box>
//                             <LinearProgress
//                               variant="determinate"
//                               value={progress}
//                               sx={{
//                                 height: 4,
//                                 borderRadius: 2,
//                                 backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
//                                 '& .MuiLinearProgress-bar': {
//                                   background: isEligible
//                                     ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
//                                     : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                 },
//                               }}
//                             />
//                           </Box>
//                         </TableCell>
//                         <TableCell>
//                           <StatusChip status={charity.verificationStatus || charity.status} />
//                         </TableCell>
//                         <TableCell align="center">
//                           <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
//                             <Tooltip title="View Documents">
//                               <IconButton
//                                 size="small"
//                                 onClick={() => {
//                                   setSelectedCharity(charity);
//                                   setOpenDetailsDialog(true);
//                                 }}
//                                 sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}
//                               >
//                                 <VisibilityIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
//                             {(charity.verificationStatus === 'pending' || charity.verificationStatus === 'submitted') && (
//                               <Tooltip title="Verify All">
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => handleVerifyAll(charity._id)}
//                                   sx={{ color: '#2ecc71' }}
//                                 >
//                                   <VerifiedIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                             )}
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination */}
//           {charities.length > 0 && (
//             <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
//               <Pagination
//                 count={totalPages}
//                 page={page}
//                 onChange={(e, value) => setPage(value)}
//                 color="primary"
//                 sx={{
//                   '& .MuiPaginationItem-root': {
//                     color: isDark ? '#a0a0b8' : '#4a4a6a',
//                   },
//                 }}
//               />
//             </Box>
//           )}
//         </Paper>

//         {/* Document Details Dialog */}
//         <DocumentDetailsDialog
//           open={openDetailsDialog}
//           onClose={() => {
//             setOpenDetailsDialog(false);
//             setSelectedCharity(null);
//           }}
//           document={selectedCharity?.documents?.find(d => d.documentId === selectedDocument?.documentId) || null}
//           onVerify={handleVerifyDocument}
//           charityId={selectedCharity?._id}
//         />
//       </Container>
//     </Box>
//   );
// };

// export default AdminVerification;

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from '@mui/material';
import {
  AdminPanelSettings as ShieldCheckIcon,
  FindInPage as FileSearchIcon,          
  PrivacyTip as ShieldAlertIcon,          
  CheckCircleOutlineOutlined as CheckCircle2Icon,
  WarningAmber as AlertTriangleIcon,     
  CancelOutlined as XCircleIcon,         
  Launch as ExternalLinkIcon,            
  AccountBalance as LandmarkIcon,        
  Verified as VerifiedIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../Theme/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';
import { useNavigate, useParams } from 'react-router-dom';

// Utility to format INR
const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// Verification Sources - Indian Government Portals
const VERIFICATION_SOURCES = [
  {
    id: 'darpan',
    label: 'NGO Darpan (NITI Aayog)',
    url: 'https://ngodarpan.gov.in',
    field: 'darpanId',
    what: 'Confirms the org is a government-recognised voluntary organisation and pulls up its registered profile.',
  },
  {
    id: 'incometax',
    label: 'Income Tax e-filing portal',
    url: 'https://www.incometax.gov.in',
    field: 'urn12a80g',
    what: 'Confirms the 12A (tax-exempt status) and 80G (donor tax deduction) registration is active, not expired or withdrawn.',
  },
  {
    id: 'mca',
    label: 'MCA21 company/LLP search',
    url: 'https://www.mca.gov.in/mcafoportal/companyLLPMasterData.do',
    field: 'cin',
    what: 'For Section 8 companies — confirms the CIN is active and the registered name matches exactly.',
  },
  {
    id: 'fcra',
    label: 'FCRA Online (Ministry of Home Affairs)',
    url: 'https://fcraonline.nic.in',
    field: 'fcraNumber',
    what: 'Required only if the charity accepts foreign donations — confirms FCRA registration is valid.',
  },
];

// Fraud Red Flags
const RED_FLAGS = [
  { id: 'name_mismatch', label: "Bank account name doesn't exactly match registered org name" },
  { id: 'not_on_darpan', label: 'Organisation not found on NGO Darpan despite claiming registration' },
  { id: 'no_12a80g', label: 'No valid 12A/80G, or certificate shows as expired/withdrawn' },
  { id: 'new_org_large_ask', label: 'Registered under 2 years ago but requesting an unusually large amount' },
  { id: 'no_financials', label: 'No audited financials or annual report provided' },
  { id: 'address_mismatch', label: 'Registered address doesn\'t match address proof document' },
  { id: 'no_online_presence', label: 'No verifiable website, social presence, or past campaign history' },
  { id: 'urgency_pressure', label: 'Campaign copy uses high-pressure urgency with vague fund usage' },
  { id: 'duplicate_bank', label: 'Bank account already linked to a different organisation on the platform' },
];

// Main Component
const AdminVerification = () => {
  const { id } = useParams();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [charity, setCharity] = useState(null);
  const [verification, setVerification] = useState(null);
  const [org, setOrg] = useState({
    orgName: '',
    panNumber: '',
    darpanId: '',
    urn12a80g: '',
    cin: '',
    fcraNumber: '',
    bankAccountName: '',
    requestedAmount: 0,
  });
  const [sourceChecked, setSourceChecked] = useState({});
  const [flags, setFlags] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const charityResponse = await api.get(`/admin/charities/${user.userId}`);
        if (charityResponse.data.success) {
          const charityData = charityResponse.data.data;
          setCharity(charityData);
          
          
          const verificationResponse = await api.get(`/verification/status/${user.userId}`);
          if (verificationResponse.data.success) {
            const verificationData = verificationResponse.data.data;
            setVerification(verificationData);
            
            
            const fraudReviewDoc = verificationData.documents?.find(d => d.documentId === 'fraud_review');
            if (fraudReviewDoc && fraudReviewDoc.status === 'verified') {
              const reviewData = JSON.parse(fraudReviewDoc.adminNotes || '{}');
              setSourceChecked(reviewData.sourceChecked || {});
              setFlags(reviewData.flags || {});
              setOrg(reviewData.org || {
                orgName: charityData.charityDetails?.organizationName || '',
                panNumber: charityData.charityDetails?.panNumber || '',
                darpanId: charityData.charityDetails?.darpanId || '',
                urn12a80g: charityData.charityDetails?.urn12a80g || '',
                cin: charityData.charityDetails?.cin || '',
                fcraNumber: charityData.charityDetails?.fcraNumber || '',
                bankAccountName: charityData.charityDetails?.bankDetails?.accountHolderName || '',
                requestedAmount: 0,
              });
            } else {
              // Initialize with charity data
              setOrg({
                orgName: charityData.charityDetails?.organizationName || '',
                panNumber: charityData.charityDetails?.panNumber || '',
                darpanId: charityData.charityDetails?.darpanId || '',
                urn12a80g: charityData.charityDetails?.urn12a80g || '',
                cin: charityData.charityDetails?.cin || '',
                fcraNumber: charityData.charityDetails?.fcraNumber || '',
                bankAccountName: charityData.charityDetails?.bankDetails?.accountHolderName || '',
                requestedAmount: 0,
              });
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    if (user.userId) {
      fetchData();
    }
  }, [user.userId]);

  const flaggedCount = Object.values(flags).filter(Boolean).length;
  const sourcesConfirmed = Object.values(sourceChecked).filter(Boolean).length;

  const riskLevel = useMemo(() => {
    if (flaggedCount >= 3) return 'high';
    if (flaggedCount >= 1) return 'medium';
    return 'low';
  }, [flaggedCount]);

  const eligible = sourcesConfirmed === VERIFICATION_SOURCES.length && flaggedCount === 0;

  const updateOrg = (field, value) => setOrg((prev) => ({ ...prev, [field]: value }));
  const toggleSource = (id) => setSourceChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleFlag = (id) => setFlags((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSaveReview = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const reviewData = {
        sourceChecked,
        flags,
        org,
        riskLevel,
        eligible,
      };

      
      const response = await api.put(`/verification/documents/${id}/fraud_review`, {
        status: 'submitted',
        adminNotes: JSON.stringify(reviewData),
      });

      if (response.data.success) {
        setSuccess('Review saved successfully!');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save review');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    setSaving(true);
    try {
      const reviewData = {
        sourceChecked,
        flags,
        org,
        riskLevel,
        eligible,
      };

      // Save fraud review as verified
      await api.put(`/verification/documents/${id}/fraud_review`, {
        status: 'verified',
        adminNotes: JSON.stringify(reviewData),
      });

      // Approve the charity
      await api.put(`/admin/charities/${id}/approve`);

      setSuccess('Charity approved successfully! 🎉');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/admin/verification');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve charity');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
      setShowConfirmDialog(false);
    }
  };

  const handleReject = async () => {
    setSaving(true);
    try {
      const reviewData = {
        sourceChecked,
        flags,
        org,
        riskLevel,
        eligible,
        rejectionReason: 'Fraud review failed',
      };

      // Save fraud review as rejected
      await api.put(`/verification/documents/${id}/fraud_review`, {
        status: 'rejected',
        adminNotes: JSON.stringify(reviewData),
      });

      // Reject the charity
      await api.put(`/admin/charities/${id}/reject`, {
        rejectionReason: 'Failed fraud and legitimacy review',
      });

      setSuccess('Charity rejected.');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/admin/verification');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject charity');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
      setShowConfirmDialog(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh', backgroundColor: isDark ? '#0a0a12' : '#f8f9fa' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Fraud & Legitimacy Review
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon size={18} />}
                onClick={() => window.location.reload()}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<SaveIcon size={18} />}
                onClick={handleSaveReview}
                disabled={saving}
                sx={{ borderRadius: 2 }}
              >
                {saving ? <CircularProgress size={20} /> : 'Save Draft'}
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Error/Success Snackbar */}
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

        {/* Charity Info Banner */}
        {charity && (
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {charity.charityDetails?.organizationName || charity.fullName}
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                  {charity.email} • {charity.phone}
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  Registration: {charity.charityDetails?.registrationNumber || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Risk: ${riskLevel.toUpperCase()}`}
                    sx={{
                      backgroundColor: riskLevel === 'low' 
                        ? 'rgba(46, 204, 113, 0.15)' 
                        : riskLevel === 'medium'
                        ? 'rgba(243, 156, 18, 0.15)'
                        : 'rgba(231, 76, 60, 0.15)',
                      color: riskLevel === 'low' ? '#2ecc71' : riskLevel === 'medium' ? '#f39c12' : '#e74c3c',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={eligible ? '✅ Eligible' : '⚠️ Not Eligible'}
                    sx={{
                      backgroundColor: eligible ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
                      color: eligible ? '#2ecc71' : '#e74c3c',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Organisation Details */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Organisation Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organisation Name"
                value={org.orgName}
                onChange={(e) => updateOrg('orgName', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PAN Number"
                value={org.panNumber}
                onChange={(e) => updateOrg('panNumber', e.target.value)}
                placeholder="AAAAA0000A"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NGO Darpan ID"
                value={org.darpanId}
                onChange={(e) => updateOrg('darpanId', e.target.value)}
                placeholder="MH/2024/0000000"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="12A / 80G URN"
                value={org.urn12a80g}
                onChange={(e) => updateOrg('urn12a80g', e.target.value)}
                placeholder="16-digit URN"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="MCA CIN (if Sec. 8 co.)"
                value={org.cin}
                onChange={(e) => updateOrg('cin', e.target.value)}
                placeholder="U85300MH2020NPL000000"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="FCRA Number (if applicable)"
                value={org.fcraNumber}
                onChange={(e) => updateOrg('fcraNumber', e.target.value)}
                placeholder="Optional"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bank Account Holder Name"
                value={org.bankAccountName}
                onChange={(e) => updateOrg('bankAccountName', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requested Campaign Amount"
                type="number"
                value={org.requestedAmount}
                onChange={(e) => updateOrg('requestedAmount', Number(e.target.value))}
                helperText={formatINR(org.requestedAmount)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Verification Sources */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <FileSearchIcon className="h-5 w-5 text-slate-400" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Cross-check on Official Indian Portals
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {VERIFICATION_SOURCES.map((src) => (
              <Card
                key={src.id}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${sourceChecked[src.id] ? 'rgba(46, 204, 113, 0.3)' : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  background: sourceChecked[src.id] 
                    ? isDark ? 'rgba(46, 204, 113, 0.05)' : 'rgba(46, 204, 113, 0.02)'
                    : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {src.label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', fontSize: '0.875rem' }}>
                        {src.what}
                      </Typography>
                      {org[src.field] && (
                        <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block', mt: 0.5 }}>
                          Check ID: <span className="font-mono">{org[src.field]}</span>
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        endIcon={<ExternalLinkIcon size={14} />}
                        sx={{
                          borderRadius: 2,
                          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                        }}
                      >
                        Open Portal
                      </Button>
                      <Button
                        variant={sourceChecked[src.id] ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => toggleSource(src.id)}
                        startIcon={sourceChecked[src.id] ? <CheckCircle2Icon size={14} /> : null}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: sourceChecked[src.id] 
                            ? '#2ecc71'
                            : isDark ? 'rgba(255,255,255,0.05)' : 'transparent',
                          borderColor: sourceChecked[src.id] 
                            ? '#2ecc71'
                            : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                          color: sourceChecked[src.id] ? '#fff' : 'inherit',
                          '&:hover': {
                            backgroundColor: sourceChecked[src.id] ? '#27ae60' : undefined,
                          },
                        }}
                      >
                        {sourceChecked[src.id] ? 'Confirmed' : 'Mark Confirmed'}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={(sourcesConfirmed / VERIFICATION_SOURCES.length) * 100}
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
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', mt: 0.5 }}>
              {sourcesConfirmed}/{VERIFICATION_SOURCES.length} sources confirmed
            </Typography>
          </Box>
        </Paper>

        {/* Fraud Red Flags */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <ShieldAlertIcon className="h-5 w-5 text-slate-400" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Fraud Red Flags
            </Typography>
            <Chip
              label={`${flaggedCount} flagged`}
              size="small"
              sx={{
                backgroundColor: flaggedCount > 0 ? 'rgba(231, 76, 60, 0.15)' : 'rgba(46, 204, 113, 0.15)',
                color: flaggedCount > 0 ? '#e74c3c' : '#2ecc71',
                fontWeight: 600,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {RED_FLAGS.map((flag) => (
              <FormControlLabel
                key={flag.id}
                control={
                  <Checkbox
                    checked={!!flags[flag.id]}
                    onChange={() => toggleFlag(flag.id)}
                    sx={{
                      color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                      '&.Mui-checked': {
                        color: '#e74c3c',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    {flag.label}
                  </Typography>
                }
                sx={{
                  width: '100%',
                  margin: 0,
                  padding: 1.5,
                  borderRadius: 2,
                  backgroundColor: flags[flag.id] 
                    ? isDark ? 'rgba(231, 76, 60, 0.08)' : 'rgba(231, 76, 60, 0.04)'
                    : 'transparent',
                  border: `1px solid ${flags[flag.id] 
                    ? 'rgba(231, 76, 60, 0.2)' 
                    : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Risk Summary */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            border: `1px solid ${riskLevel === 'high' ? 'rgba(231, 76, 60, 0.3)' : riskLevel === 'medium' ? 'rgba(243, 156, 18, 0.3)' : 'rgba(46, 204, 113, 0.3)'}`,
            background: riskLevel === 'high' 
              ? isDark ? 'rgba(231, 76, 60, 0.08)' : 'rgba(231, 76, 60, 0.04)'
              : riskLevel === 'medium'
              ? isDark ? 'rgba(243, 156, 18, 0.08)' : 'rgba(243, 156, 18, 0.04)'
              : isDark ? 'rgba(46, 204, 113, 0.08)' : 'rgba(46, 204, 113, 0.04)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {riskLevel === 'low' ? (
              <CheckCircle2Icon className="h-6 w-6 text-emerald-600" />
            ) : riskLevel === 'medium' ? (
              <AlertTriangleIcon className="h-6 w-6 text-amber-600" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-600" />
            )}
            <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {riskLevel} Risk Level
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                Red Flags
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: flaggedCount > 0 ? '#e74c3c' : '#2ecc71' }}>
                {flaggedCount}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                Sources Confirmed
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {sourcesConfirmed}/{VERIFICATION_SOURCES.length}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                Requested Amount
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatINR(org.requestedAmount)}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <LandmarkIcon className="h-5 w-5 text-slate-400" />
            {eligible ? (
              <Typography variant="body2" sx={{ color: '#2ecc71', fontWeight: 500 }}>
                ✅ All portals confirmed, zero red flags — eligible to be approved for fundraising.
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                ⚠️ Not eligible yet — confirm all portals and clear every red flag before approving.
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => {
                setActionType('approve');
                setShowConfirmDialog(true);
              }}
              disabled={!eligible || saving}
              startIcon={<VerifiedIcon size={18} />}
              sx={{
                borderRadius: 2,
                backgroundColor: '#2ecc71',
                '&:hover': { backgroundColor: '#27ae60' },
                '&:disabled': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
            >
              Approve Charity
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setActionType('reject');
                setShowConfirmDialog(true);
              }}
              disabled={saving}
              startIcon={<CancelIcon size={18} />}
              sx={{
                borderRadius: 2,
                backgroundColor: '#e74c3c',
                '&:hover': { backgroundColor: '#c0392b' },
              }}
            >
              Reject Charity
            </Button>
            <Button
              variant="outlined"
              onClick={handleSaveReview}
              disabled={saving}
              startIcon={<SaveIcon size={18} />}
              sx={{
                borderRadius: 2,
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
              }}
            >
              Save Draft
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.print()}
              startIcon={<PrintIcon size={18} />}
              sx={{
                borderRadius: 2,
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
              }}
            >
              Print Report
            </Button>
          </Box>
        </Paper>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          maxWidth="sm"
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
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {actionType === 'approve' ? 'Approve Charity' : 'Reject Charity'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              {actionType === 'approve' ? (
                <>
                  Are you sure you want to approve <strong>{charity?.charityDetails?.organizationName || charity?.fullName}</strong>?
                  <br /><br />
                  This will allow them to start fundraising on the platform.
                </>
              ) : (
                <>
                  Are you sure you want to reject <strong>{charity?.charityDetails?.organizationName || charity?.fullName}</strong>?
                  <br /><br />
                  This will prevent them from fundraising on the platform.
                </>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={actionType === 'approve' ? handleApprove : handleReject}
              disabled={saving}
              sx={{
                borderRadius: 2,
                backgroundColor: actionType === 'approve' ? '#2ecc71' : '#e74c3c',
                '&:hover': {
                  backgroundColor: actionType === 'approve' ? '#27ae60' : '#c0392b',
                },
              }}
            >
              {saving ? <CircularProgress size={24} /> : actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminVerification;