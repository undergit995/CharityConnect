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
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Verified as VerifiedIcon,
  Error as ErrorIcon,
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
  Group as GroupIcon,
  Article as ArticleIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../Theme/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';
import { useNavigate } from 'react-router-dom';
import verificationServices from '../../Services/verificationServices';

// Document requirements configuration
const DOCUMENT_REQUIREMENTS = [
  {
    id: 'certificateOfIncorporation',
    label: 'Certificate of Incorporation / NGO Registration Certificate',
    description: 'Proves legal existence of your organization',
    icon: <BusinessIcon />,
    required: true,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '5MB',
  },
  {
    id: 'taxExemptionCertificate',
    label: 'Tax Exemption Certificate (e.g., 501(c)(3), 12A/80G)',
    description: 'Proves tax-exempt/nonprofit status',
    icon: <ReceiptIcon />,
    required: true,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '5MB',
  },
  {
    id: 'panNumber',
    label: 'PAN / Tax Identification Number',
    description: 'Financial identity verification',
    icon: <AssignmentIcon />,
    required: true,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '5MB',
  },
  {
    id: 'trustDeed',
    label: 'Trust Deed / MOA & AOA',
    description: 'Defines governance structure & purpose',
    icon: <GavelIcon />,
    required: true,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '5MB',
  },
  {
    id: 'authorizedSignatoryId',
    label: 'Government-issued ID of authorized signatory',
    description: 'Verifies the person representing the organization',
    icon: <PersonIcon />,
    required: true,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '5MB',
  },
  {
    id: 'proofOfAddress',
    label: 'Proof of registered address',
    description: 'Confirms physical presence of the organization',
    icon: <LocationIcon />,
    required: true,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '5MB',
  },
  {
    id: 'bankAccountProof',
    label: 'Cancelled cheque / Bank account proof',
    description: 'Confirms fund destination matches organization name',
    icon: <MoneyIcon />,
    required: true,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '5MB',
  },
  {
    id: 'auditedFinancials',
    label: 'Audited financial statements (last 1-3 years)',
    description: 'Financial transparency and accountability',
    icon: <ArticleIcon />,
    required: true,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '10MB',
  },
  {
    id: 'boardMembersList',
    label: 'List of board members/trustees',
    description: 'Governance transparency',
    icon: <GroupIcon />,
    required: true,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '5MB',
  },
  {
    id: 'annualReport',
    label: 'Annual report (if available)',
    description: 'Track record of activities and achievements',
    icon: <DescriptionIcon />,
    required: false,
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '10MB',
  },
  {
    id: 'pastWorkPhotos',
    label: 'Photos/proof of past work or ongoing projects',
    description: 'Credibility boost (optional)',
    icon: <SecurityIcon />,
    required: false,
    acceptedFormats: 'JPG, PNG, GIF',
    maxSize: '5MB',
  },
];

// Document Card Component
const DocumentCard = ({ document, onUpload, index }) => {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      const maxSize = parseInt(document.maxSize);
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size exceeds ${document.maxSize}`);
        return;
      }
      setSelectedFile(file);
      setError('');
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      await onUpload(document.documentId, file, (progress) => {
        setUploadProgress(progress);
      });
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        setSelectedFile(null);
      }, 500);
    } catch (err) {
      setError(err.message || 'Upload failed');
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#2ecc71';
      case 'rejected': return '#e74c3c';
      case 'submitted': return '#3498db';
      default: return '#f39c12';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircleIcon />;
      case 'rejected': return <CancelIcon />;
      case 'submitted': return <UploadIcon />;
      default: return <PendingIcon />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
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
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
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
                flexShrink: 0,
              }}
            >
                {document.icon || <DescriptionIcon />}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                  {document.label}
                </Typography>
                {document.required && (
                  <Chip
                    label="Required"
                    size="small"
                    sx={{
                      height: 18,
                      backgroundColor: 'rgba(231, 76, 60, 0.15)',
                      color: '#e74c3c',
                      '& .MuiChip-label': { fontSize: '0.6rem', px: 1 },
                    }}
                  />
                )}
                {document.status && document.status !== 'pending' && (
                  <Chip
                    icon={getStatusIcon(document.status)}
                    label={document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    size="small"
                    sx={{
                      height: 18,
                      backgroundColor: `${getStatusColor(document.status)}20`,
                      color: getStatusColor(document.status),
                      '& .MuiChip-label': { fontSize: '0.6rem', px: 1 },
                    }}
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block', mt: 0.5 }}>
                {document.description}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block' }}>
                Accepted formats: {document.acceptedFormats || "PDF, Word, Excel, PPT"} • Max size: {document.maxSize || "10mb"}
              </Typography>

              {document.fileUrl && (
                <Typography variant="caption" sx={{ color: '#2ecc71', display: 'block', mt: 0.5 }}>
                  ✅ File uploaded: {document.fileName || 'Document'}
                </Typography>
              )}

              {error && (
                <Typography variant="caption" sx={{ color: '#e74c3c', display: 'block', mt: 0.5 }}>
                  ❌ {error}
                </Typography>
              )}

              {uploading && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                    Uploading... {Math.round(uploadProgress)}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Box>
              <Button
                variant="outlined"
                component="label"
                size="small"
                disabled={uploading || document.status === 'verified'}
                startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
                sx={{
                  borderRadius: 2,
                  borderColor: document.status === 'verified' ? '#2ecc71' : undefined,
                  color: document.status === 'verified' ? '#2ecc71' : undefined,
                }}
              >
                {document.status === 'verified' ? 'Verified' : document.fileUrl ? 'Replace' : 'Upload'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  disabled={document.status === 'verified'}
                />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Charity Documents Component
const CharityDocuments = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Load documents
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await verificationServices.getVerificationStatus(user.userId);
      if (data) {
        setDocuments(data.documents || []);
        setVerificationStatus(data.status || 'pending');
        setIsEligible(data.eligibility?.isEligible || false);
        
        const requiredDocs = (data.documents || []).filter(d => d.required);
        const allUploaded = requiredDocs.every(d => d.status !== 'pending' && d.status !== 'rejected');
        if (allUploaded && data.status !== 'verified' && data.status !== 'submitted') {
          setActiveStep(1);
        }
      }
    } catch (err) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (documentId, file, onProgress) => {
    try {
      const response = await verificationServices.uploadDocument(user.userId, documentId, file, (progressEvent) => {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          onProgress(percentCompleted);
      }
    });
      if (response.success) {
        setDocuments(prev =>
          prev.map(doc =>
            doc.documentId === documentId
              ? { ...doc, status: 'submitted', fileUrl: response.data.fileUrl, fileName: file.name }
              : doc
          )
        );
        setSuccess(`${file.name} uploaded successfully!`);
        setTimeout(() => setSuccess(''), 3000);

        const updatedDocs = documents.map(doc =>
          doc.id === documentId
            ? { ...doc, status: 'submitted', fileUrl: response.data.data.fileUrl, fileName: file.name }
            : doc
        );
        const requiredDocs = updatedDocs.filter(d => d.required);
        const allUploaded = requiredDocs.every(d => d.status !== 'pending');
        if (allUploaded) {
          setActiveStep(1);
        }
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleSubmitForVerification = async () => {
    try {
      await verificationServices.submitForVerification(user.userId);
      setVerificationStatus('submitted');
      setShowSuccessDialog(true);
      setTimeout(() => {
        setShowSuccessDialog(false);
        navigate('/charity/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit for verification');
    }
  };

  const getProgress = () => {
    const required = documents.filter(d => d.required);
    const uploaded = required.filter(d => d.status !== 'pending' && d.status !== 'rejected');
    return (uploaded.length / required.length) * 100;
  };

  const isAllUploaded = () => {
    const required = documents.filter(d => d.required);
    return required.every(d => d.status !== 'pending' && d.status !== 'rejected');
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
          <Box sx={{ mb: 4 }}>
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
              Complete your verification to start fundraising
            </Typography>
          </Box>
        </motion.div>

        {/* Error/Success */}
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

        {/* Stepper */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Upload Documents</StepLabel>
            </Step>
            <Step>
              <StepLabel>Submit for Review</StepLabel>
            </Step>
            <Step>
              <StepLabel>Verification Complete</StepLabel>
            </Step>
          </Stepper>
        </Paper>

        {/* Progress */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Verification Progress
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
              {Math.round(getProgress())}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getProgress()}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
              {documents.filter(d => d.required && d.status !== 'pending' && d.status !== 'rejected').length} of {documents.filter(d => d.required).length} documents uploaded
            </Typography>
            {isAllUploaded() && (
              <Chip
                label="All documents uploaded! 🎉"
                size="small"
                sx={{
                  backgroundColor: 'rgba(46, 204, 113, 0.15)',
                  color: '#2ecc71',
                }}
              />
            )}
          </Box>
        </Paper>

        {/* Status Banner */}
        {verificationStatus === 'verified' && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            icon={<VerifiedIcon />}
          >
            <Typography variant="body2">
              <strong>Congratulations!</strong> Your charity is verified and eligible for fundraising.
            </Typography>
          </Alert>
        )}

        {verificationStatus === 'submitted' && (
          <Alert
            severity="info"
            sx={{ mb: 3 }}
          >
            <Typography variant="body2">
              <strong>Under Review!</strong> Your documents have been submitted for review. We'll notify you once the verification is complete.
            </Typography>
          </Alert>
        )}

        {verificationStatus === 'rejected' && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            <Typography variant="body2">
              <strong>Verification Failed!</strong> Please review the feedback and re-upload the required documents.
            </Typography>
          </Alert>
        )}

        {/* Documents List */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Required Documents
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 3 }}>
          Please upload all required documents for verification. Once all documents are uploaded, you can submit for review.
        </Typography>

        <Grid container spacing={2}>
          {documents.map((doc, index) => (
            <Grid item xs={12} key={doc.id}>
              <DocumentCard
                document={doc}
                onUpload={handleUpload}
                index={index}
              />
            </Grid>
          ))}
        </Grid>

        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmitForVerification}
            disabled={!isAllUploaded() || verificationStatus === 'submitted' || verificationStatus === 'verified'}
            startIcon={<VerifiedIcon />}
            sx={{
              py: 1.5,
              px: 6,
              borderRadius: 2,
              background: isAllUploaded()
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              '&:hover': {
                background: isAllUploaded()
                  ? 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)'
                  : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              },
            }}
          >
            {verificationStatus === 'verified' ? '✅ Verified' :
             verificationStatus === 'submitted' ? '⏳ Under Review' :
             isAllUploaded() ? 'Submit for Verification' : 'Upload All Documents to Submit'}
          </Button>
        </Box>

        {/* Success Dialog */}
        <Dialog
          open={showSuccessDialog}
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
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: '#2ecc71', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Documents Submitted! 🎉
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Your documents have been submitted for verification. Our team will review them and notify you within 24-48 hours.
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block', mt: 2 }}>
                Redirecting to dashboard...
              </Typography>
              <CircularProgress size={24} sx={{ mt: 2 }} />
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CharityDocuments;