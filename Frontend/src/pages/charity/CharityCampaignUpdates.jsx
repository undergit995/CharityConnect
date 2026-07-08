// pages/charity/CharityCampaignUpdates.jsx
import React, { useState, useEffect } from 'react';
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
  CardHeader,
  Avatar,
  IconButton,
  Tooltip,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Send as SendIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Update as UpdateIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../Services/authServices';
import { formatDistanceToNow } from 'date-fns';

const CharityCampaignUpdates = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/charity/campaigns');
        setCampaigns(response.data || []);
        if (response.data.length > 0) {
          setSelectedCampaign(response.data[0]._id);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch campaigns');
      }
    };
    fetchCampaigns();
  }, []);

  // Fetch updates when campaign changes
  useEffect(() => {
    if (selectedCampaign) {
      fetchUpdates();
    }
  }, [selectedCampaign]);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/charity/campaigns/${selectedCampaign}/updates`);
      setUpdates(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampaign) {
      setError('Please select a campaign');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('campaignId', selectedCampaign);
      
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      if (editingUpdate) {
        await api.put(`/charity/campaigns/${selectedCampaign}/updates/${editingUpdate._id}`, formDataToSend);
        setSuccess('Update edited successfully!');
      } else {
        await api.post(`/charity/campaigns/${selectedCampaign}/updates`, formDataToSend);
        setSuccess('Update posted successfully!');
      }

      setOpenDialog(false);
      resetForm();
      fetchUpdates();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;

    try {
      await api.delete(`/charity/campaigns/${selectedCampaign}/updates/${updateId}`);
      setSuccess('Update deleted successfully!');
      fetchUpdates();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete update');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      images: [],
    });
    setImageFiles([]);
    setImagePreviews([]);
    setEditingUpdate(null);
  };

  const openEditDialog = (update) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title,
      content: update.content,
      type: update.type,
      images: [],
    });
    setImageFiles([]);
    setImagePreviews(update.images || []);
    setOpenDialog(true);
  };

  const getTypeChip = (type) => {
    const typeMap = {
      general: { label: 'General', color: '#3498db' },
      milestone: { label: 'Milestone', color: '#2ecc71' },
      urgent: { label: 'Urgent', color: '#e74c3c' },
      thank_you: { label: 'Thank You', color: '#9b59b6' },
    };
    const t = typeMap[type] || typeMap.general;
    return (
      <Chip
        label={t.label}
        size="small"
        sx={{ backgroundColor: `${t.color}20`, color: t.color }}
      />
    );
  };

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
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                }}
              >
                Campaign Updates
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                Keep your donors informed with campaign progress updates
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                },
              }}
            >
              New Update
            </Button>
          </Box>
        </motion.div>

        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

        {/* Campaign Selector */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Select Campaign</InputLabel>
            <Select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              label="Select Campaign"
            >
              {campaigns.map((campaign) => (
                <MenuItem key={campaign._id} value={campaign._id}>
                  {campaign.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Updates List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : updates.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <UpdateIcon sx={{ fontSize: 48, color: isDark ? '#6a6a80' : '#9a9ab0', mb: 2 }} />
            <Typography variant="h6" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
              No Updates Yet
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
              Start keeping your donors informed by posting your first update.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
              sx={{ mt: 2 }}
            >
              Post First Update
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {updates.map((update) => (
              <motion.div
                key={update._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    overflow: 'hidden',
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ backgroundColor: '#667eea' }}>
                        <UpdateIcon />
                      </Avatar>
                    }
                    action={
                      <Box>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => openEditDialog(update)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(update._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {update.title}
                        </Typography>
                        {getTypeChip(update.type)}
                      </Box>
                    }
                    subheader={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                          {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                        </Typography>
                        {update.donorsNotified && (
                          <Chip
                            label="Donors Notified"
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(46, 204, 113, 0.15)',
                              color: '#2ecc71',
                              height: 20,
                            }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <CardContent>
                    <Typography variant="body1" sx={{ color: isDark ? '#e8e8f0' : '#1a1a2e', whiteSpace: 'pre-wrap' }}>
                      {update.content}
                    </Typography>
                    
                    {update.images && update.images.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                        {update.images.map((image, index) => (
                          <Box
                            key={index}
                            component="img"
                            src={image}
                            alt={`Update image ${index + 1}`}
                            sx={{
                              width: 150,
                              height: 150,
                              objectFit: 'cover',
                              borderRadius: 2,
                              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Create/Edit Update Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            resetForm();
          }}
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
            {editingUpdate ? 'Edit Update' : 'Post New Update'}
            <IconButton
              onClick={() => {
                setOpenDialog(false);
                resetForm();
              }}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Update Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Give your update a clear title"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Update Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      label="Update Type"
                    >
                      <MenuItem value="general">General</MenuItem>
                      <MenuItem value="milestone">Milestone</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                      <MenuItem value="thank_you">Thank You</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Content"
                    multiline
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    placeholder="Write your update message here..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                    Images (Optional)
                  </Typography>
                  <Box
                    sx={{
                      border: `2px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: 2,
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#667eea',
                      },
                    }}
                    onClick={() => document.getElementById('updateImages').click()}
                  >
                    <input
                      id="updateImages"
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImageUpload}
                    />
                    <ImageIcon sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                    <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0', display: 'block' }}>
                      Click to upload images
                    </Typography>
                  </Box>

                  {imagePreviews.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                      {imagePreviews.map((preview, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <Box
                            component="img"
                            src={preview}
                            alt={`Upload ${index + 1}`}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 2,
                              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
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
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={() => {
                  setOpenDialog(false);
                  resetForm();
                }}
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                  },
                }}
              >
                {submitting ? 'Posting...' : editingUpdate ? 'Update' : 'Post Update'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CharityCampaignUpdates;