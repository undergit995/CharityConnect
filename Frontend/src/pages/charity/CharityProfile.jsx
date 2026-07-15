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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Business as CharityIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Verified as VerifiedIcon,
  Campaign as CampaignIcon,
  VolunteerActivism as DonateIcon,
  TrendingUp as TrendingUpIcon,
  DateRange as DateRangeIcon,
  LocationOn as LocationIcon,
  Share as ShareIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';


const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const CharityProfile = () => {
  const { isDark } = useTheme();
  const { user, updateProfile } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({ totalRaised: 0, totalDonors: 0, activeCampaigns: 0 });
  const [campaigns, setCampaigns] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
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
    charityDetails: {
      organizationName: '',
      organizationType: 'Non-Profit',
      registrationNumber: '',
      website: '',
      missionStatement: '',
      foundingYear: '',
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');

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
        charityDetails: user.charityDetails || {
          organizationName: '',
          organizationType: 'Non-Profit',
          registrationNumber: '',
          website: '',
          missionStatement: '',
          foundingYear: '',
        },
        notifications: user.notificationPreferences || {
          email: true,
          push: true,
          sms: false,
        },
      });
      if (user.profileImage) setPreviewUrl(user.profileImage);
      if (user.coverImage) setCoverPreviewUrl(user.coverImage);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;
      setDataLoading(true);
      try {
        const [statsRes, campaignsRes, donationsRes] = await Promise.all([
          api.get('/charity/dashboard/stats'),
          api.get('/charity/campaigns', { params: { limit: 5 } }),
          api.get('/charity/donations', { params: { limit: 5 } })
        ]);

        if (statsRes.data.success) {
          const { stats: summaryStats, campaignStatus } = statsRes.data.data;
          setStats({
            totalRaised: summaryStats?.totalRaised || 0,
            totalDonors: statsRes.data.data.stats?.totalDonors || 0,
            activeCampaigns: campaignStatus?.active || 0,
          });
        }

        if (campaignsRes.data) {
          setCampaigns(campaignsRes.data.campaigns || []);
        }

        if (donationsRes.data) {
          setRecentDonations(donationsRes.data.donations || []);
        }
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        
        setDataLoading(false);
      }
    };
    fetchData();
  }, [user?.userId]);

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
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreviewUrl(reader.result);
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
      if (profileImage) formDataToSend.append('profileImage', profileImage);
      if (coverImage) formDataToSend.append('coverImage', coverImage);

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
        charityDetails: user.charityDetails || {
          organizationName: '',
          organizationType: 'Non-Profit',
          registrationNumber: '',
          website: '',
          missionStatement: '',
          foundingYear: '',
        },
        notifications: user.notificationPreferences || {
          email: true,
          push: true,
          sms: false,
        },
      });
    }
  };

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
                Charity Profile
                <Chip
                  icon={<CharityIcon sx={{ fontSize: 16 }} />}
                  label="Charity"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(155, 89, 182, 0.15)',
                    color: '#9b59b6',
                    fontWeight: 600,
                  }}
                />
                {user?.charityDetails?.verified && (
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                    label="Verified"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(46, 204, 113, 0.15)',
                      color: '#2ecc71',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Manage your charity organization profile
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

        {/* Messages */}
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
              borderRadius: 4,
              overflow: 'hidden',
              background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              mb: 4,
            }}
          >
            {/* Cover Image */}
            <Box sx={{ position: 'relative', height: 200, backgroundColor: '#9b59b6' }}>
              {coverPreviewUrl && (
                <Box
                  component="img"
                  src={coverPreviewUrl}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              {isEditing && (
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <PhotoCameraIcon />
                  <input type="file" accept="image/*" hidden onChange={handleCoverChange} />
                </IconButton>
              )}
            </Box>

            {/* Profile Section */}
            <Box sx={{ p: { xs: 3, md: 4 }, pt: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mt: -4 }}>
                {/* Avatar */}
                <Box sx={{ textAlign: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      isEditing && (
                        <IconButton
                          component="label"
                          sx={{
                            backgroundColor: '#9b59b6',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#8e44ad' },
                            width: 36,
                            height: 36,
                          }}
                        >
                          <PhotoCameraIcon sx={{ fontSize: 18 }} />
                          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        </IconButton>
                      )
                    }
                  >
                    <Avatar
                      src={previewUrl}
                      sx={{
                        width: 120,
                        height: 120,
                        border: `4px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#ffffff'}`,
                        backgroundColor: '#9b59b6',
                        fontSize: 48,
                      }}
                    >
                      {!previewUrl && (user?.charityDetails?.organizationName?.charAt(0) || 'C')}
                    </Avatar>
                  </Badge>
                </Box>

                {/* Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    {user?.charityDetails?.organizationName || user?.fullName || 'Charity'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 1 }}>
                    {user?.email}
                  </Typography>
                  {user?.charityDetails?.missionStatement && (
                    <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a', mb: 2 }}>
                      {user.charityDetails.missionStatement}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                        {dataLoading ? <CircularProgress size={20} /> : stats.activeCampaigns}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                        Active Campaigns
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                        {dataLoading ? <CircularProgress size={20} /> : `₹${stats.totalRaised.toLocaleString('en-IN')}`}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                        Total Raised
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                        {dataLoading ? <CircularProgress size={20} /> : stats.totalDonors.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                        Total Donors
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Edit Form */}
              {isEditing && (
                <Box sx={{ mt: 4 }}>
                  <Divider sx={{ mb: 3 }} />
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Organization Name"
                          name="charityDetails.organizationName"
                          value={formData.charityDetails.organizationName}
                          onChange={handleChange}
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
                          label="Registration Number"
                          name="charityDetails.registrationNumber"
                          value={formData.charityDetails.registrationNumber}
                          onChange={handleChange}
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
                          label="Website"
                          name="charityDetails.website"
                          value={formData.charityDetails.website}
                          onChange={handleChange}
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
                          label="Founding Year"
                          name="charityDetails.foundingYear"
                          value={formData.charityDetails.foundingYear}
                          onChange={handleChange}
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
                          label="Mission Statement"
                          name="charityDetails.missionStatement"
                          multiline
                          rows={3}
                          value={formData.charityDetails.missionStatement}
                          onChange={handleChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button variant="outlined" onClick={handleCancel} sx={{ borderRadius: 2 }}>
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
                    </Grid>
                  </form>
                </Box>
              )}
            </Box>
          </Paper>
        </motion.div>

        {/* Tabs */}
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
                  color: '#9b59b6',
                },
              },
            }}
          >
            <Tab icon={<CampaignIcon />} label="Campaigns" />
            <Tab icon={<DonateIcon />} label="Donations" />
            <Tab icon={<SettingsIcon />} label="Settings" />
          </Tabs>

          {/* Campaigns Tab */}
          <TabPanel value={tabValue} index={0}>
            <AnimatePresence>
              <Box sx={{ p: 3 }}>
                {dataLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Campaign</TableCell>
                          <TableCell align="right">Raised</TableCell>
                          <TableCell align="right">Goal</TableCell>
                          <TableCell align="right">Donors</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {campaigns.map((campaign) => (
                          <TableRow key={campaign._id}>
                            <TableCell sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                              {campaign.title}
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#2ecc71', fontWeight: 600 }}>
                              ₹{(campaign.raisedAmount || 0).toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell align="right" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                              ₹{(campaign.goalAmount || 0).toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell align="right" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                              {(campaign.stats?.donorCount || 0).toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={campaign.status}
                                size="small"
                                sx={{
                                  backgroundColor: campaign.status === 'active'
                                    ? 'rgba(46, 204, 113, 0.15)'
                                    : campaign.status === 'completed'
                                      ? 'rgba(155, 89, 182, 0.15)'
                                      : 'rgba(243, 156, 18, 0.15)',
                                  color: campaign.status === 'active'
                                    ? '#2ecc71'
                                    : campaign.status === 'completed'
                                      ? '#9b59b6'
                                      : '#f39c12',
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </AnimatePresence>
          </TabPanel>

          {/* Donations Tab */}
          <TabPanel value={tabValue} index={1}>
            <AnimatePresence>
              <Box sx={{ p: 3 }}>
                {dataLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Donor</TableCell>
                          <TableCell>Campaign</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Date</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentDonations.map((donation) => (
                          <TableRow key={donation._id}>
                            <TableCell sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                              {donation.isAnonymous ? 'Anonymous' : donation.donorId?.fullName || 'N/A'}
                            </TableCell>
                            <TableCell sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                              {donation.campaignId?.title || 'N/A'}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, color: '#2ecc71' }}>
                              ₹{donation.amount.toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell align="right" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                              {new Date(donation.donationDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">
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
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </AnimatePresence>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                Notification Preferences
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications.email}
                        onChange={handleChange}
                        name="notifications.email"
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                    sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications.push}
                        onChange={handleChange}
                        name="notifications.push"
                        color="primary"
                      />
                    }
                    label="Push Notifications"
                    sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications.sms}
                        onChange={handleChange}
                        name="notifications.sms"
                        color="primary"
                      />
                    }
                    label="SMS Notifications"
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

export default CharityProfile;