import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Chip,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../Theme/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import { api } from '../../Services/authServices';

const AdminInfo = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const [footerData, setFooterData] = useState({
    brandName: '',
    tagline: '',
    quickLinks: [],
    supportLinks: [],
    contactInfo: {
      email: '',
      phone: '',
      address: '',
    },
    socialLinks: [],
    copyright: '',
    madeWithLove: '',
  });

  const [newQuickLink, setNewQuickLink] = useState({ label: '', path: '' });
  const [newSupportLink, setNewSupportLink] = useState({ label: '', path: '' });
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  // Fetch footer settings
  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/info/footer');
      if (response.data.success) {
        setFooterData(response.data.data);
      }
    } catch (err) {
      setError('Failed to load footer settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.put('/info/footer', footerData);
      if (response.data.success) {
        setSuccess('Footer settings saved successfully!');
        setSnackbarOpen(true);
        setFooterData(response.data.data);
      }
    } catch (err) {
      setError('Failed to save footer settings');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuickLink = () => {
    if (newQuickLink.label && newQuickLink.path) {
      setFooterData({
        ...footerData,
        quickLinks: [...footerData.quickLinks, { ...newQuickLink }],
      });
      setNewQuickLink({ label: '', path: '' });
    }
  };

  const handleRemoveQuickLink = (index) => {
    const updated = footerData.quickLinks.filter((_, i) => i !== index);
    setFooterData({ ...footerData, quickLinks: updated });
  };

  const handleAddSupportLink = () => {
    if (newSupportLink.label && newSupportLink.path) {
      setFooterData({
        ...footerData,
        supportLinks: [...footerData.supportLinks, { ...newSupportLink }],
      });
      setNewSupportLink({ label: '', path: '' });
    }
  };

  const handleRemoveSupportLink = (index) => {
    const updated = footerData.supportLinks.filter((_, i) => i !== index);
    setFooterData({ ...footerData, supportLinks: updated });
  };

  const handleAddSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setFooterData({
        ...footerData,
        socialLinks: [...footerData.socialLinks, { ...newSocialLink }],
      });
      setNewSocialLink({ platform: '', url: '' });
    }
  };

  const handleRemoveSocialLink = (index) => {
    const updated = footerData.socialLinks.filter((_, i) => i !== index);
    setFooterData({ ...footerData, socialLinks: updated });
  };

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Footer Settings
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Customize the footer content displayed on your website
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchFooterSettings}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {saving ? <CircularProgress size={20} /> : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </motion.div>

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

        {/* Brand Section */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Brand Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Brand Name"
                value={footerData.brandName}
                onChange={(e) => setFooterData({ ...footerData, brandName: e.target.value })}
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
                label="Tagline"
                multiline
                rows={2}
                value={footerData.tagline}
                onChange={(e) => setFooterData({ ...footerData, tagline: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Links */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Quick Links
          </Typography>
          <Grid container spacing={2}>
            {footerData.quickLinks.map((link, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Label"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...footerData.quickLinks];
                      updated[index].label = e.target.value;
                      setFooterData({ ...footerData, quickLinks: updated });
                    }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Path"
                    value={link.path}
                    onChange={(e) => {
                      const updated = [...footerData.quickLinks];
                      updated[index].path = e.target.value;
                      setFooterData({ ...footerData, quickLinks: updated });
                    }}
                  />
                  <IconButton onClick={() => handleRemoveQuickLink(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  label="New Link Label"
                  value={newQuickLink.label}
                  onChange={(e) => setNewQuickLink({ ...newQuickLink, label: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size="small"
                  label="New Link Path"
                  value={newQuickLink.path}
                  onChange={(e) => setNewQuickLink({ ...newQuickLink, path: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddQuickLink}
                  sx={{ borderRadius: 2 }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Support Links */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Support Links
          </Typography>
          <Grid container spacing={2}>
            {footerData.supportLinks.map((link, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Label"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...footerData.supportLinks];
                      updated[index].label = e.target.value;
                      setFooterData({ ...footerData, supportLinks: updated });
                    }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Path"
                    value={link.path}
                    onChange={(e) => {
                      const updated = [...footerData.supportLinks];
                      updated[index].path = e.target.value;
                      setFooterData({ ...footerData, supportLinks: updated });
                    }}
                  />
                  <IconButton onClick={() => handleRemoveSupportLink(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  label="New Link Label"
                  value={newSupportLink.label}
                  onChange={(e) => setNewSupportLink({ ...newSupportLink, label: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size="small"
                  label="New Link Path"
                  value={newSupportLink.path}
                  onChange={(e) => setNewSupportLink({ ...newSupportLink, path: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddSupportLink}
                  sx={{ borderRadius: 2 }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Contact Info */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Contact Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={footerData.contactInfo.email}
                onChange={(e) =>
                  setFooterData({
                    ...footerData,
                    contactInfo: { ...footerData.contactInfo, email: e.target.value },
                  })
                }
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
                label="Phone"
                value={footerData.contactInfo.phone}
                onChange={(e) =>
                  setFooterData({
                    ...footerData,
                    contactInfo: { ...footerData.contactInfo, phone: e.target.value },
                  })
                }
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
                label="Address"
                value={footerData.contactInfo.address}
                onChange={(e) =>
                  setFooterData({
                    ...footerData,
                    contactInfo: { ...footerData.contactInfo, address: e.target.value },
                  })
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Social Links */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Social Media Links
          </Typography>
          <Grid container spacing={2}>
            {footerData.socialLinks.map((link, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Platform"
                    value={link.platform}
                    onChange={(e) => {
                      const updated = [...footerData.socialLinks];
                      updated[index].platform = e.target.value;
                      setFooterData({ ...footerData, socialLinks: updated });
                    }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="URL"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...footerData.socialLinks];
                      updated[index].url = e.target.value;
                      setFooterData({ ...footerData, socialLinks: updated });
                    }}
                  />
                  <IconButton onClick={() => handleRemoveSocialLink(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  label="New Platform"
                  value={newSocialLink.platform}
                  onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size="small"
                  label="New URL"
                  value={newSocialLink.url}
                  onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddSocialLink}
                  sx={{ borderRadius: 2 }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Footer Text */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Footer Text
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Copyright Text"
                value={footerData.copyright}
                onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
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
                label="Made With Love Text"
                value={footerData.madeWithLove}
                onChange={(e) => setFooterData({ ...footerData, madeWithLove: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminInfo;