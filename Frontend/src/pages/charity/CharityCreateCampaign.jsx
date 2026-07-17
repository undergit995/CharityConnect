import React, { useEffect, useState } from 'react';
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  VideoCall as VideoIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
  Verified as VerifiedIcon
} from "@mui/icons-material";
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';
import verificationService from '../../Services/verificationServices';

const categories = [
  'Medical', 'Education', 'Food', 'Disaster Relief', 
  'Animal Welfare', 'Children', 'Women', 'Elderly', 
  'Environment', 'Community', 'Other'
];

const CharityCreateCampaign = () => {
  const { isDark } = useTheme();
  const { user, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    shortDescription: '',
    goalAmount: '',
    endDate: '',
    location: '',
    beneficiaryInfo: '',
    impactDetails: '',
  });
  
  const [errors, setErrors] = useState({});
 const [eligibility, setEligibility] = useState({
    isEligible: false,
    isLoading: false,
    status: 'checking',
    reason: '',
    missingDocs: [],
    progress: 0,
  });
  const [showEligibilityDialog, setShowEligibilityDialog] = useState(false);

    useEffect(() => {
    const checkEligibility = async () => {
      if (!user?._id) return;

      const freshUser = await updateCurrentUser();
      const targetUser = freshUser || user;

      setEligibility(prev => ({ ...prev, isLoading: true, status: 'checking' }));
      try {
        const data = await verificationService.checkEligibility(user._id);
        if (data) {
          setEligibility({
            isEligible: data.isEligible,
            status: data.isEligible ? 'eligible' : 'not_eligible',
            reason: data.reason || 'Your charity is not eligible to create campaigns.',
            missingDocs: data.missingDocs || [],
            progress: data.progress || 0,
          });
          
          if (!data.isEligible) {
            setShowEligibilityDialog(true);
          }
        } else {
          setEligibility(prev => ({
            ...prev,
            status: 'error'
          }));
        }
      } catch (err) {
        setEligibility({
          isEligible: false,
          status: 'error',
          reason: 'Failed to check eligibility',
          missingDocs: [],
          progress: 0,
        });
      } finally {
        // setEligibility(prev => ({ ...prev, isLoading: false }));
        // setEligibility(prev => ({ ...prev, isLoading: false }));
      }
    };
    checkEligibility();
  }, [user?._id]);

  // Fetch campaign data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCampaignData = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/charity/campaigns/${id}`);
          const campaign = response.data.data;
          setFormData({
            title: campaign.title || '',
            category: campaign.category || '',
            description: campaign.description || '',
            shortDescription: campaign.shortDescription || '',
            goalAmount: campaign.goalAmount || '',
            endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
            location: campaign.location || '',
            beneficiaryInfo: campaign.beneficiaryInfo || '',
            impactDetails: campaign.impactDetails || '',
          });
          // Note: Image editing is more complex and not handled in this diff.
        } catch (err) {
          setError('Failed to load campaign data for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchCampaignData();
    }
  }, [isEditMode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    updateProgress();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploadProgress: 0,
    }));
    setImages(prev => [...prev, ...newImages]);
    updateProgress();
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
    updateProgress();
  };
  const updateProgress = () => {
    const fields = ['title', 'category', 'description', 'goalAmount', 'endDate'];
    const filled = fields.filter(f => formData[f] && formData[f].trim() !== '').length;
    const total = fields.length;
    let progress = (filled / total) * 70;
    
    if (images.length > 0) progress += 15;
    if (formData.shortDescription) progress += 5;
    if (formData.location) progress += 5;
    if (formData.impactDetails) progress += 5;
    
    setProgress(Math.min(progress, 100));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Campaign title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.goalAmount) newErrors.goalAmount = 'Goal amount is required';
    if (parseFloat(formData.goalAmount) < 100) newErrors.goalAmount = 'Minimum goal is ₹100';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    if (images.length > 5) newErrors.images = 'Maximum 5 images allowed';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (!eligibility.isEligible) {
      setShowEligibilityDialog(true);
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    images.forEach(image => {
      formDataToSend.append('campaignImages', image.file);
    });

    try {
      let response;
      if (isEditMode) {
        // Update existing campaign
        response = await api.put(`/charity/campaigns/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setProgress(percentCompleted);
          },
        });
      } else {
        // Create new campaign
        formDataToSend.append('charityId', user._id);
        response = await api.post('/campaigns', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setProgress(percentCompleted);
          },
        });
      }

      if (response.data.success) {
        setSuccess(
          isEditMode
            ? 'Campaign updated successfully! It will be reviewed again.'
            : 'Campaign created successfully! It will be reviewed by an admin.'
        );
        setTimeout(() => {
          navigate('/charity/campaigns');
        }, 2000);
      }
    } catch (err) {
      //console.log(err.message);
      if (err.response?.status === 403) {
        setShowEligibilityDialog(true);
        setError(err.response?.data?.message || 'Your charity is not eligible for fundraising.');
      } else {
        setError(err.response?.data?.message || 'Failed to create campaign');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoToVerification = () => {
    setShowEligibilityDialog(false);
    navigate('/charity/documents');
  };

  // Eligibility Dialog
  const EligibilityDialog = () => (
    <Dialog
      open={showEligibilityDialog}
      onClose={() => setShowEligibilityDialog(false)}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {eligibility.status === 'eligible' ? (
            <VerifiedIcon sx={{ color: '#2ecc71' }} />
          ) : eligibility.status === 'pending_approval' ? (
            <PendingIcon sx={{ color: '#f39c12' }} />
          ) : (
            <WarningIcon sx={{ color: '#e74c3c' }} />
          )}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {eligibility.isEligible ? 'Eligible for Fundraising!' : 'Verification Required'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {eligibility.isEligible ? (
          <Alert severity="success">
            Your charity is verified and eligible for fundraising! 🎉
          </Alert>
        ) : (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              {eligibility.reason || 'Complete verification to start fundraising'}
            </Alert>
            
            {eligibility.missingDocs.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Missing Documents:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {eligibility.missingDocs.map((doc, index) => (
                    <Chip
                      key={index}
                      label={doc}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(231, 76, 60, 0.15)',
                        color: '#e74c3c',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Verification Progress: {Math.round(eligibility.progress)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={eligibility.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  mt: 0.5,
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {eligibility.isEligible ? (
          <Button onClick={() => setShowEligibilityDialog(false)} sx={{ borderRadius: 2 }}>
            Continue
          </Button>
        ) : (
          <>
            <Button onClick={() => setShowEligibilityDialog(false)} sx={{ borderRadius: 2 }}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleGoToVerification}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Complete Verification
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );

  if (eligibility.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!eligibility.isEligible) {
    return (
      <Box sx={{ py: 3 }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <WarningIcon sx={{ fontSize: 48, color: '#f39c12', mb: 2 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
                mb: 1,
              }}
            >
              Verification Required
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 3 }}>
              {eligibility.reason || 'Your charity must be verified before you can create a fundraising campaign.'}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGoToVerification}
              sx={{
                py: 1.5,
                px: 6,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                },
              }}
            >
              Complete Verification
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  
  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
         {!eligibility.isEligible && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleGoToVerification}>
                Complete Verification
              </Button>
            }
          >
            <Typography variant="body2">
              <strong>Verification Required:</strong> {eligibility.reason || 'Complete document verification to create campaigns.'}
            </Typography>
          </Alert>
        )}

        {eligibility.isEligible && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>✅ Verified!</strong> Your charity is eligible to create fundraising campaigns.
            </Typography>
          </Alert>
        )}
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
                  color: isDark ? '#e8e8f0' : '#1a1a2e'
                }}
              >
                {isEditMode ? 'Edit Campaign' : 'Create Campaign'}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                {isEditMode ? 'Update the details of your campaign.' : 'Launch a new fundraising campaign for your charity.'}
              </Typography>
            </Box>
            <Chip
              label={`${Math.round(progress)}% Complete`}
              sx={{
                backgroundColor: progress === 100 
                  ? 'rgba(46, 204, 113, 0.15)' 
                  : 'rgba(243, 156, 18, 0.15)',
                color: progress === 100 ? '#2ecc71' : '#f39c12',
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 4 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
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
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{justifyContent:'center'}}>
              {/* Left Column - Main Form */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  {/* Title */}
                  <TextField
                    fullWidth
                    label="Campaign Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    placeholder="Give your campaign a clear, compelling title"
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: <TitleIcon sx={{ mr: 1, color: isDark ? '#6a6a80' : '#9a9ab0' }} />,
                    }}
                  />

                  {/* Category */}
                  <FormControl fullWidth error={!!errors.category} sx={{ mb: 3 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Category"
                      startAdornment={<CategoryIcon sx={{ mr: 1, color: isDark ? '#6a6a80' : '#9a9ab0' }} />}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                    {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                  </FormControl>

                  {/* Short Description */}
                  <TextField
                    fullWidth
                    label="Short Description"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="A brief summary of your campaign (max 200 characters)"
                    multiline
                    rows={2}
                    sx={{ mb: 3 }}
                    inputProps={{ maxLength: 200 }}
                    helperText={`${formData.shortDescription.length}/200`}
                  />

                  {/* Full Description */}
                  <TextField
                    fullWidth
                    label="Full Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    error={!!errors.description}
                    helperText={errors.description}
                    placeholder="Tell the story of your campaign, the problem you're solving, and how donations will help"
                    multiline
                    rows={6}
                    sx={{ mb: 3 }}
                  />

                  {/* Images Upload */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      Campaign Images
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block', mb: 2 }}>
                      Upload up to 5 images (JPG, PNG, GIF). First image will be the cover.
                    </Typography>

                    <Box
                      sx={{
                        border: `2px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#667eea',
                          backgroundColor: isDark ? 'rgba(102, 126, 234, 0.05)' : 'rgba(102, 126, 234, 0.02)',
                        },
                      }}
                      onClick={() => document.getElementById('imageUpload').click()}
                    >
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleImageUpload}
                      />
                      <CloudUploadIcon sx={{ fontSize: 48, color: isDark ? '#6a6a80' : '#9a9ab0', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                        Click or drag images to upload
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                        Max 5 images • 10MB each
                      </Typography>
                    </Box>

                    {errors.images && (
                      <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                        {errors.images}
                      </Typography>
                    )}

                    {/* Image Previews */}
                    {images.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                        {images.map((image, index) => (
                          <Box key={index} sx={{ position: 'relative' }}>
                            <Box
                              component="img"
                              src={image.preview}
                              alt={`Campaign image ${index + 1}`}
                              sx={{
                                width: 100,
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: 2,
                                border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeImage(index)}
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                backgroundColor: '#e74c3c',
                                color: '#fff',
                                '&:hover': { backgroundColor: '#c0392b' },
                                width: 24,
                                height: 24,
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                            {index === 0 && (
                              <Chip
                                label="Cover"
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  bottom: -6,
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  backgroundColor: '#667eea',
                                  color: '#fff',
                                  height: 20,
                                }}
                              />
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column - Details */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  {/* Goal Amount */}
                  <TextField
                    fullWidth
                    label="Goal Amount (₹)"
                    name="goalAmount"
                    type="number"
                    value={formData.goalAmount}
                    onChange={handleChange}
                    error={!!errors.goalAmount}
                    helperText={errors.goalAmount}
                    placeholder="5000"
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: <MoneyIcon sx={{ mr: 1, color: isDark ? '#6a6a80' : '#9a9ab0' }} />,
                    }}
                  />

                  {/* End Date */}
                  <TextField
  fullWidth
  label="End Date"
  name="endDate"
  type="date"
  value={formData.endDate}
  onChange={handleChange}
  error={!!errors.endDate}
  helperText={errors.endDate}
  sx={{ mb: 3 }}
  slotProps={{
    inputLabel: { 
      shrink: true 
    },
    input: {
      startAdornment: <CalendarIcon sx={{ mr: 1, color: isDark ? '#6a6a80' : '#9a9ab0' }} />,
    }
  }}
/>

                  {/* Location */}
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: isDark ? '#6a6a80' : '#9a9ab0' }} />,
                    }}
                  />

                  {/* Impact Details */}
                  <TextField
                    fullWidth
                    label="Impact Details"
                    name="impactDetails"
                    value={formData.impactDetails}
                    onChange={handleChange}
                    placeholder="How will donations make a difference?"
                    multiline
                    rows={3}
                    sx={{ mb: 3 }}
                  />

                  <Divider sx={{ my: 2 }} />

                  {/* Submit Buttons */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                        },
                      }}
                    >
                {loading ? <CircularProgress size={24} color="inherit" /> : isEditMode ? 'Update Campaign' : 'Create Campaign'}
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate('/charity/campaigns')}
                      sx={{
                        borderRadius: 2,
                        borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </form>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CharityCreateCampaign;