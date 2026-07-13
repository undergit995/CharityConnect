import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  useMediaQuery,
  Badge,
  Stack,
  LinearProgress,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  VolunteerActivism as DonorIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Verified as VerifiedIcon,
  Favorite as FavoriteIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  DateRange as DateRangeIcon,
  LocationOn as LocationIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';

// Tab Panel Component
const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const DonorProfile = () => {
  const { isDark } = useTheme();
  const { user, updateProfile } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    donorPreferences: {
      categories: [],
      anonymousDonations: false,
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        country: user.address?.country || 'India',
        zipCode: user.address?.zipCode || '',
        donorPreferences: user.donorPreferences || {
          categories: [],
          anonymousDonations: false,
        },
        notifications: user.notificationPreferences || {
          email: true,
          push: true,
          sms: false,
        },
      });
      if (user.profileImage) {
        setPreviewUrl(user.profileImage);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      await updateProfile(formDataToSend);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        country: user.address?.country || 'India',
        zipCode: user.address?.zipCode || '',
        donorPreferences: user.donorPreferences || {
          categories: [],
          anonymousDonations: false,
        },
        notifications: user.notificationPreferences || {
          email: true,
          push: true,
          sms: false,
        },
      });
    }
  };

  const categories = ['Medical', 'Education', 'Food', 'Disaster Relief', 'Animal Welfare', 'Children', 'Women', 'Elderly', 'Environment', 'Community'];

  const donations = [
    { id: 1, campaign: 'Clean Water Initiative', amount: 100, date: '2024-01-15', status: 'Completed' },
    { id: 2, campaign: 'Education for All', amount: 50, date: '2024-01-10', status: 'Completed' },
    { id: 3, campaign: 'Medical Relief Fund', amount: 200, date: '2024-01-05', status: 'Pending' },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Donor Profile
                <Chip
                  icon={<DonorIcon sx={{ fontSize: 16 }} />}
                  label="Donor"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(46, 204, 113, 0.15)',
                    color: '#2ecc71',
                    fontWeight: 600,
                  }}
                />
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Manage your donor profile and preferences
              </Typography>
            </Box>
            <Button
              variant={isEditing ? 'outlined' : 'contained'}
              startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              sx={{
                borderRadius: 2,
                background: isEditing ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                '&:hover': {
                  background: isEditing ? 'transparent' : 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                },
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Box>
        </motion.div>

        {/* Success/Error Messages */}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              mb: 4,
            }}
          >
            <Grid container spacing={4}>
              {/* Avatar Section */}
              <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      isEditing && (
                        <IconButton
                          component="label"
                          sx={{
                            backgroundColor: '#2ecc71',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#27ae60' },
                            width: 36,
                            height: 36,
                          }}
                        >
                          <PhotoCameraIcon sx={{ fontSize: 18 }} />
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                          />
                        </IconButton>
                      )
                    }
                  >
                    <Avatar
                      src={previewUrl}
                      sx={{
                        width: 150,
                        height: 150,
                        border: `4px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                        backgroundColor: '#2ecc71',
                        fontSize: 48,
                      }}
                    >
                      {!previewUrl && (user?.firstName?.charAt(0) || 'D')}
                    </Avatar>
                  </Badge>
                  {user?.emailVerified && (
                    <VerifiedIcon
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        right: 10,
                        color: '#2ecc71',
                        fontSize: 24,
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 2,
                    fontWeight: 600,
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                  }}
                >
                  {user?.fullName || 'Donor'}
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                  {user?.email}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Box textAlign="center">
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      12
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Donations
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      ₹2,450
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Total Given
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                      5
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                      Saved
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Profile Info */}
              <Grid item xs={12} md={9}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
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
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
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
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={true}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                          },
                        }}
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: isDark ? '#6a6a80' : '#9a9ab0' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                          },
                        }}
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: isDark ? '#6a6a80' : '#9a9ab0' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        multiline
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Share your giving story"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                          },
                        }}
                      />
                    </Grid>
                    {isEditing && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={handleCancel}
                            sx={{ borderRadius: 2 }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            sx={{
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                              },
                            }}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Tabs Section */}
        <Paper
          sx={{
            borderRadius: 4,
            background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              px: 2,
              '& .MuiTab-root': {
                color: isDark ? '#a0a0b8' : '#4a4a6a',
                '&.Mui-selected': {
                  color: '#2ecc71',
                },
              },
            }}
          >
            <Tab icon={<ReceiptIcon />} label="Donations" />
            <Tab icon={<FavoriteIcon />} label="Saved Campaigns" />
            <Tab icon={<SettingsIcon />} label="Preferences" />
          </Tabs>

          {/* Donations Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              {donations.map((donation) => (
                <Card
                  key={donation.id}
                  sx={{
                    mb: 2,
                    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                          {donation.campaign}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                          {donation.date}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2ecc71' }}>
                          ₹{donation.amount.toLocaleString('en-IN')}
                        </Typography>
                        <Chip
                          label={donation.status}
                          size="small"
                          sx={{
                            backgroundColor: donation.status === 'Completed' 
                              ? 'rgba(46, 204, 113, 0.15)' 
                              : 'rgba(243, 156, 18, 0.15)',
                            color: donation.status === 'Completed' ? '#2ecc71' : '#f39c12',
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </TabPanel>

          {/* Saved Campaigns Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                You haven't saved any campaigns yet.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
                onClick={() => window.location.href = '/campaigns'}
              >
                Explore Campaigns
              </Button>
            </Box>
          </TabPanel>

          {/* Preferences Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                Giving Preferences
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 1 }}>
                    Categories you care about:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {categories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        clickable
                        sx={{
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          color: isDark ? '#e8e8f0' : '#1a1a2e',
                          '&:hover': {
                            backgroundColor: 'rgba(46, 204, 113, 0.15)',
                            color: '#2ecc71',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.donorPreferences.anonymousDonations}
                        onChange={handleChange}
                        name="donorPreferences.anonymousDonations"
                        color="primary"
                      />
                    }
                    label="Make my donations anonymous by default"
                    sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}
                  />
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default DonorProfile;