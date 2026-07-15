import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  CircularProgress,
  LinearProgress,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../../Theme/ThemeContext';

const DocumentCard = ({ 
  document,
  onUpload,
  onTextChange, 
  index,
  onSaveFields,
  isEditing = true,
}) => {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [fieldValues, setFieldValues] = useState(document.fieldsData || {});
  const [editingFields, setEditingFields] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = parseInt(document.maxSize) || 10;
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size exceeds ${maxSize}MB`);
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

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFieldValues(prev => ({ ...prev, [name]: value }));
    if (onTextChange) {
      onTextChange(document.documentId, name, value);
    }
  };

  const handleSaveFields = () => {
    if (onSaveFields) {
      onSaveFields(document.documentId, fieldValues);
    }
    setEditingFields(false);
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
      case 'verified': return <CheckCircleIcon sx={{ fontSize: 14 }} />;
      case 'rejected': return <CancelIcon sx={{ fontSize: 14 }} />;
      case 'submitted': return <UploadIcon sx={{ fontSize: 14 }} />;
      default: return <PendingIcon sx={{ fontSize: 14 }} />;
    }
  };

  // Field labels mapping
  const fieldLabels = {
    organizationName: 'Organization Name',
    organizationType: 'Organization Type',
    registrationNumber: 'Registration Number',
    panNumber: 'PAN Number',
    darpanId: 'NGO Darpan ID',
    urn12a80g: '12A/80G URN',
    cin: 'MCA CIN',
    fcraNumber: 'FCRA Number',
    bankAccountName: 'Bank Account Holder Name',
    requestedAmount: 'Requested Campaign Amount',
  };

  // Field placeholders
  const fieldPlaceholders = {
    organizationName: 'Enter organization name',
    organizationType: 'e.g., Non-Profit, NGO, Trust',
    registrationNumber: 'Enter registration number',
    panNumber: 'AAAAA0000A',
    darpanId: 'MH/2024/0000000',
    urn12a80g: '16-digit URN',
    cin: 'U85300MH2020NPL000000',
    fcraNumber: 'Enter FCRA number',
    bankAccountName: 'Enter bank account holder name',
    requestedAmount: 'Enter amount',
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
            {/* Icon */}
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

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              {/* Header */}
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

              {/* Description */}
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block', mt: 0.5 }}>
                {document.description}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block' }}>
                Accepted formats: {document.acceptedFormats || 'PDF, Word, Excel, PPT'} • Max size: {document.maxSize || '10MB'}
              </Typography>

              {/* File Upload Status */}
              {document.fileUrl && (
                <Typography variant="caption" sx={{ color: '#2ecc71', display: 'block', mt: 0.5 }}>
                  ✅ File uploaded: {document.fileName || 'Document'}
                  {document.fileUrl && (
                    <Tooltip title="View Document">
                      <IconButton
                        size="small"
                        href={document.fileUrl}
                        target="_blank"
                        sx={{ ml: 0.5, color: '#667eea' }}
                      >
                        <VisibilityIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Typography>
              )}

              {error && (
                <Typography variant="caption" sx={{ color: '#e74c3c', display: 'block', mt: 0.5 }}>
                  ❌ {error}
                </Typography>
              )}

              {/* Text Fields for Organization Details */}
              {document.fields && document.fields.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      Organization Details
                    </Typography>
                    {!editingFields && document.status !== 'verified' && (
                      <IconButton
                        size="small"
                        onClick={() => setEditingFields(true)}
                        sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}
                      >
                        <EditIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                    {editingFields && (
                      <>
                        <IconButton
                          size="small"
                          onClick={handleSaveFields}
                          sx={{ color: '#2ecc71' }}
                        >
                          <SaveIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingFields(false);
                            setFieldValues(document.fieldsData || {});
                          }}
                          sx={{ color: '#e74c3c' }}
                        >
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </>
                    )}
                  </Box>

                  <Grid container spacing={1.5}>
                    {document.fields.map((field) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <TextField
                          fullWidth
                          size="small"
                          label={fieldLabels[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          name={field}
                          value={fieldValues[field] || ''}
                          onChange={handleFieldChange}
                          disabled={!editingFields || document.status === 'verified'}
                          placeholder={fieldPlaceholders[field] || `Enter ${field}`}
                          variant="outlined"
                          InputProps={{
                            endAdornment: fieldValues[field] && !editingFields && (
                              <InputAdornment position="end">
                                <CheckCircleIcon sx={{ fontSize: 14, color: '#2ecc71' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                              borderRadius: 1.5,
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.75rem',
                            },
                            '& .MuiInputBase-input': {
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  {/* Show saved indicator */}
                  {!editingFields && Object.values(fieldValues).some(v => v) && (
                    <Typography variant="caption" sx={{ color: '#2ecc71', display: 'block', mt: 1 }}>
                      ✅ Details saved to database
                    </Typography>
                  )}
                </Box>
              )}

              {/* Upload Progress */}
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

            {/* Upload Button */}
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
                  whiteSpace: 'nowrap',
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

export default DocumentCard;