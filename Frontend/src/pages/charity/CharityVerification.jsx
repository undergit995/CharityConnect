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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Upload as UploadIcon,
  Verified as VerifiedIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
  Gavel as GavelIcon,
  Money as MoneyIcon,
  Security as SecurityIcon,
  Flag as FlagIcon,
  Group as GroupIcon,
  Article as ArticleIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../Theme/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import verificationService from '../../Services/verificationServices';

// Document requirements configuration
const DOCUMENT_REQUIREMENTS = [
  {
    id: 'certificateOfIncorporation',
    label: 'Certificate of Incorporation / NGO Registration Certificate',
    description: 'Proves legal existence',
    icon: <BusinessIcon />,
    required: true,
  },
  {
    id: 'taxExemptionCertificate',
    label: 'Tax Exemption Certificate (e.g., 501(c)(3), 12A/80G)',
    description: 'Proves tax-exempt/nonprofit status',
    icon: <ReceiptIcon />,
    required: true,
  },
  {
    id: 'panNumber',
    label: 'PAN / Tax Identification Number',
    description: 'Financial identity verification',
    icon: <AssignmentIcon />,
    required: true,
  },
  {
    id: 'trustDeed',
    label: 'Trust Deed / MOA & AOA',
    description: 'Defines governance structure & purpose',
    icon: <GavelIcon />,
    required: true,
  },
  {
    id: 'authorizedSignatoryId',
    label: 'Government-issued ID of authorized signatory',
    description: 'Verifies the person representing the org',
    icon: <PersonIcon />,
    required: true,
  },
  {
    id: 'proofOfAddress',
    label: 'Proof of registered address',
    description: 'Confirms physical presence',
    icon: <LocationIcon />,
    required: true,
  },
  {
    id: 'bankAccountProof',
    label: 'Cancelled cheque / Bank account proof',
    description: 'Confirms fund destination matches org name',
    icon: <MoneyIcon />,
    required: true,
  },
  {
    id: 'auditedFinancials',
    label: 'Audited financial statements (last 1-3 years)',
    description: 'Financial transparency',
    icon: <ArticleIcon />,
    required: true,
  },
  {
    id: 'boardMembersList',
    label: 'List of board members/trustees',
    description: 'Governance transparency',
    icon: <GroupIcon />,
    required: true,
  },
  {
    id: 'annualReport',
    label: 'Annual report (if available)',
    description: 'Track record of activities',
    icon: <DescriptionIcon />,
    required: false,
  },
  {
    id: 'pastWorkPhotos',
    label: 'Photos/proof of past work or ongoing projects',
    description: 'Credibility boost',
    icon: <SecurityIcon />,
    required: false,
  },
];

// Document Status Component
const DocumentStatus = ({ status }) => {
  const { isDark } = useTheme();
  
  const statusMap = {
    pending: { label: 'Pending', color: '#f39c12', icon: <PendingIcon /> },
    submitted: { label: 'Submitted', color: '#3498db', icon: <UploadIcon /> },
    verified: { label: 'Verified', color: '#2ecc71', icon: <VerifiedIcon /> },
    rejected: { label: 'Rejected', color: '#e74c3c', icon: <ErrorIcon /> },
    'needs-info': { label: 'Needs Info', color: '#e67e22', icon: <ErrorIcon /> },
  };

  const statusData = statusMap[status] || statusMap.pending;

  return (
    <Chip
      icon={statusData.icon}
      label={statusData.label}
      size="small"
      sx={{
        backgroundColor: `${statusData.color}20`,
        color: statusData.color,
        fontWeight: 600,
      }}
    />
  );
};

// Document Card Component
const DocumentCard = ({ document, onUpload, onVerify, onDelete, isAdmin, isEligible }) => {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUpload();
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(document.id, file);
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDark
            ? '0 8px 40px rgba(0,0,0,0.3)'
            : '0 8px 40px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(102,126,234,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#667eea',
              }}
            >
              {document.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                {document.label}
                {document.required && (
                  <Chip
                    label="Required"
                    size="small"
                    sx={{
                      ml: 1,
                      height: 18,
                      backgroundColor: 'rgba(231, 76, 60, 0.15)',
                      color: '#e74c3c',
                      '& .MuiChip-label': { fontSize: '0.6rem', px: 1 },
                    }}
                  />
                )}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                {document.description}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DocumentStatus status={document.status} />
            {isAdmin && document.status !== 'pending' && (
              <Tooltip title="View Document">
                <IconButton size="small" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Admin Actions */}
        {isAdmin && document.status !== 'pending' && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            {document.status !== 'verified' && document.status !== 'rejected' && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => onVerify(document.id, 'verified')}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#2ecc71',
                    '&:hover': { backgroundColor: '#27ae60' },
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CancelIcon />}
                  onClick={() => onVerify(document.id, 'rejected')}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#e74c3c',
                    '&:hover': { backgroundColor: '#c0392b' },
                  }}
                >
                  Reject
                </Button>
              </>
            )}
            {document.status === 'rejected' && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => onVerify(document.id, 'pending')}
                sx={{ borderRadius: 2 }}
              >
                Reset
              </Button>
            )}
          </Box>
        )}

        {/* Charity Upload */}
        {!isAdmin && document.status !== 'verified' && (
          <Box sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              component="label"
              startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
              disabled={uploading}
              sx={{ borderRadius: 2 }}
            >
              {document.status === 'pending' ? 'Upload Document' : 'Re-upload'}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};


const CharityVerification = ({ charityId, isAdmin = false }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [eligibility, setEligibility] = useState({
    isEligible: false,
    missingDocs: [],
    progress: 0,
  });

  const [rejectionDialog, setRejectionDialog] = useState({
    open: false,
    documentId: null,
    notes: '',
  });

  // Load verification data
  useEffect(() => {
    loadVerificationData();
  }, [user]);
  const loadVerificationData = async () => {
    setLoading(true);
    try {
      const data = await verificationService.getVerificationStatus(user?.userId);
      setDocuments(data.documents || DOCUMENT_REQUIREMENTS);
      setVerificationStatus(data.status || 'pending');
      setEligibility(data.eligibility || {
        isEligible: false,
        missingDocs: [],
        progress: 0,
      });
    } catch (err) {
      setError('Failed to load verification data');
    } finally {
      setLoading(false);
    }
  };

  // Handle document upload (Charity)
  const handleUpload = async (documentId, file) => {
    try {
      const response = await verificationService.uploadDocument(charityId, documentId, file);
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === documentId
            ? { ...doc, status: 'submitted', fileUrl: response.fileUrl }
            : doc
        )
      );
      setSuccess('Document uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
      // Recalculate eligibility
      updateEligibility();
    } catch (err) {
      setError('Failed to upload document');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle admin verification
  const handleVerify = async (documentId, status, notes = '') => {
    try {
      await verificationService.verifyDocument(charityId, documentId, status, notes);
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === documentId
            ? { ...doc, status, adminNotes: notes }
            : doc
        )
      );
      setSuccess(`Document ${status === 'verified' ? 'verified' : 'rejected'} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      
      if (status === 'rejected') {
        setRejectionDialog({ open: false, documentId: null, notes: '' });
      }
      
      // Recalculate eligibility
      updateEligibility();
    } catch (err) {
      setError('Failed to update document status');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle verify all documents (Admin)
  const handleVerifyAll = async () => {
    try {
      await verificationService.verifyAllDocuments(charityId);
      setDocuments(prev =>
        prev.map(doc =>
          doc.status === 'submitted' || doc.status === 'pending'
            ? { ...doc, status: 'verified' }
            : doc
        )
      );
      setSuccess('All documents verified successfully!');
      setTimeout(() => setSuccess(''), 3000);
      updateEligibility();
    } catch (err) {
      setError('Failed to verify all documents');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Update eligibility based on document status
  const updateEligibility = () => {
    const requiredDocs = documents.filter(doc => doc.required);
    const verifiedDocs = requiredDocs.filter(doc => doc.status === 'verified');
    const rejectedDocs = requiredDocs.filter(doc => doc.status === 'rejected');
    const missingDocs = requiredDocs.filter(doc => doc.status === 'pending' || doc.status === 'needs-info');

    const isEligible = verifiedDocs.length === requiredDocs.length && rejectedDocs.length === 0;
    const progress = (verifiedDocs.length / requiredDocs.length) * 100;

    setEligibility({
      isEligible,
      missingDocs: missingDocs.map(doc => doc.label),
      progress,
    });
  };

  // Get verification status info
  const getStatusInfo = () => {
    const statusMap = {
      pending: {
        label: 'Pending Verification',
        color: '#f39c12',
        icon: <PendingIcon />,
        message: 'Your application is pending review.',
      },
      submitted: {
        label: 'Under Review',
        color: '#3498db',
        icon: <UploadIcon />,
        message: 'Your documents are being reviewed by our team.',
      },
      verified: {
        label: 'Verified',
        color: '#2ecc71',
        icon: <VerifiedIcon />,
        message: 'Congratulations! Your charity is verified and eligible for fundraising.',
      },
      rejected: {
        label: 'Rejected',
        color: '#e74c3c',
        icon: <ErrorIcon />,
        message: 'Your application was rejected. Please review the feedback and resubmit.',
      },
      'needs-info': {
        label: 'Needs Information',
        color: '#e67e22',
        icon: <ErrorIcon />,
        message: 'Additional information is required. Please check the feedback below.',
      },
    };

    return statusMap[verificationStatus] || statusMap.pending;
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {isAdmin ? 'Charity Verification Panel' : 'Charity Verification'}
              <Chip
                icon={statusInfo.icon}
                label={statusInfo.label}
                sx={{
                  backgroundColor: `${statusInfo.color}20`,
                  color: statusInfo.color,
                  fontWeight: 600,
                }}
              />
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              {isAdmin ? 'Review and verify charity documents' : 'Complete your verification to start fundraising'}
            </Typography>
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

        {/* Status Message */}
        <Alert
          severity={verificationStatus === 'verified' ? 'success' : 'info'}
          sx={{ mb: 3 }}
          icon={statusInfo.icon}
        >
          <Typography variant="body2">
            <strong>{statusInfo.label}</strong> - {statusInfo.message}
          </Typography>
          {verificationStatus === 'rejected' && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              Please review the feedback and resubmit your application.
            </Typography>
          )}
        </Alert>

        {/* Eligibility Banner */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: eligibility.isEligible
              ? 'rgba(46, 204, 113, 0.08)'
              : isDark ? 'rgba(243, 156, 18, 0.08)' : 'rgba(243, 156, 18, 0.05)',
            border: `1px solid ${eligibility.isEligible ? 'rgba(46, 204, 113, 0.2)' : 'rgba(243, 156, 18, 0.2)'}`,
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {eligibility.isEligible ? (
                  <VerifiedIcon sx={{ fontSize: 40, color: '#2ecc71' }} />
                ) : (
                  <PendingIcon sx={{ fontSize: 40, color: '#f39c12' }} />
                )}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {eligibility.isEligible
                      ? '✅ Charity is Eligible for Fundraising'
                      : '⏳ Verification In Progress'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                    {eligibility.isEligible
                      ? 'All required documents are verified and approved'
                      : `${eligibility.missingDocs.length} required document(s) pending verification`}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {Math.round(eligibility.progress)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={eligibility.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    '& .MuiLinearProgress-bar': {
                      background: eligibility.isEligible
                        ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                  {eligibility.isEligible
                    ? 'All requirements met'
                    : `${eligibility.missingDocs.length} requirement(s) remaining`}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Admin Actions */}
        {isAdmin && (
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<VerifiedIcon />}
              onClick={handleVerifyAll}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Verify All Documents
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadVerificationData}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>
        )}

        {/* Documents List */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Required Documents
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 3 }}>
          {isAdmin
            ? 'Review each document and verify its authenticity'
            : 'Upload all required documents to complete verification'}
        </Typography>

        <Grid container spacing={2}>
          {documents.map((doc, index) => (
            <Grid item xs={12} key={doc.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DocumentCard
                  document={doc}
                  onUpload={handleUpload}
                  onVerify={handleVerify}
                  onDelete={() => {}}
                  isAdmin={isAdmin}
                  isEligible={eligibility.isEligible}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Rejection Dialog */}
        <Dialog
          open={rejectionDialog.open}
          onClose={() => setRejectionDialog({ open: false, documentId: null, notes: '' })}
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
          <DialogTitle>Reject Document</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Rejection Reason"
              multiline
              rows={3}
              value={rejectionDialog.notes}
              onChange={(e) =>
                setRejectionDialog({ ...rejectionDialog, notes: e.target.value })
              }
              placeholder="Please provide a reason for rejection..."
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectionDialog({ open: false, documentId: null, notes: '' })}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                handleVerify(rejectionDialog.documentId, 'rejected', rejectionDialog.notes)
              }
              sx={{
                backgroundColor: '#e74c3c',
                '&:hover': { backgroundColor: '#c0392b' },
              }}
            >
              Reject Document
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CharityVerification;