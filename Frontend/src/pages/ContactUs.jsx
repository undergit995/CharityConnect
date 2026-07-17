import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Snackbar,
  Divider,
  useMediaQuery,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../Theme/ThemeContext';
import { useAuth } from '../Context/AuthContext';
import { api } from '../Services/authServices';

// Contact Info Card Component
const ContactInfoCard = ({ icon, title, value, subtitle, color }) => {
  const { isDark } = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDark
            ? '0 8px 40px rgba(0,0,0,0.3)'
            : '0 8px 40px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            margin: '0 auto',
            mb: 2,
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Main Contact Us Component
const ContactUs = () => {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Contact info from backend
  const [contactInfo, setContactInfo] = useState({
    email: 'support@charityconnect.com',
    phone: '+91 9234567890',
    address: '123 Charity Street, Hyderabad, 12345',
    workingHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    socialMedia: {
      facebook: 'https://facebook.com/charityconnect',
      twitter: 'https://twitter.com/charityconnect',
      instagram: 'https://instagram.com/charityconnect',
      linkedin: 'https://linkedin.com/company/charityconnect',
      youtube: 'https://youtube.com/charityconnect',
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch contact info from backend
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await api.get('/settings/contact');
        
        if (response.data.success) {
          setContactInfo(response.data.data);
        }
      } catch (err) {
        //console.error('Failed to fetch contact info:', err);
        // Use default values if API fails
      }
    };
    fetchContactInfo();
  }, []);

  // Set form data if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        email: user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/contact', formData);
      if (response.data.success) {
        setSuccess(true);
        setSnackbarOpen(true);
        setFormData(prev => ({
          ...prev,
          subject: '',
          message: '',
        }));
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: <FacebookIcon />, url: contactInfo.socialMedia.facebook, label: 'Facebook', color: '#1877f2' },
    { icon: <TwitterIcon />, url: contactInfo.socialMedia.twitter, label: 'Twitter', color: '#1DA1F2' },
    { icon: <InstagramIcon />, url: contactInfo.socialMedia.instagram, label: 'Instagram', color: '#E4405F' },
    { icon: <LinkedInIcon />, url: contactInfo.socialMedia.linkedin, label: 'LinkedIn', color: '#0A66C2' },
    { icon: <YouTubeIcon />, url: contactInfo.socialMedia.youtube, label: 'YouTube', color: '#FF0000' },
  ];

  return (
    <Box sx={{ py: 6, minHeight: '100vh', backgroundColor: isDark ? '#0a0a12' : '#f8f9fa' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
                mb: 2,
              }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#a0a0b8' : '#4a4a6a',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Have questions or feedback? We'd love to hear from you. Reach out to us and we'll get back to you as soon as possible.
            </Typography>
          </Box>
        </motion.div>

        {/* Contact Info Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ContactInfoCard
                icon={<EmailIcon />}
                title="Email Us"
                value={contactInfo.email}
                color="#3498db"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ContactInfoCard
                icon={<PhoneIcon />}
                title="Call Us"
                value={contactInfo.phone}
                color="#2ecc71"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ContactInfoCard
                icon={<LocationIcon />}
                title="Visit Us"
                value={contactInfo.address}
                color="#f39c12"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ContactInfoCard
                icon={<AccessTimeIcon />}
                title="Working Hours"
                value={contactInfo.workingHours}
                color="#9b59b6"
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Contact Form & Map */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                    mb: 3,
                  }}
                >
                  Send us a Message
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          setFormErrors({ ...formErrors, name: '' });
                        }}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        disabled={isAuthenticated}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                            </InputAdornment>
                          ),
                        }}
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
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setFormErrors({ ...formErrors, email: '' });
                        }}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        disabled={isAuthenticated}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                            </InputAdornment>
                          ),
                        }}
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
                        label="Subject"
                        value={formData.subject}
                        onChange={(e) => {
                          setFormData({ ...formData, subject: e.target.value });
                          setFormErrors({ ...formErrors, subject: '' });
                        }}
                        error={!!formErrors.subject}
                        helperText={formErrors.subject}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MessageIcon sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                            </InputAdornment>
                          ),
                        }}
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
                        label="Message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          setFormErrors({ ...formErrors, message: '' });
                        }}
                        error={!!formErrors.message}
                        helperText={formErrors.message}
                        placeholder="Write your message here..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 30px rgba(102,126,234,0.3)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          {/* Right Column - Map & Social */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                    mb: 2,
                  }}
                >
                  Find Us
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 250,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    position: 'relative',
                  }}
                >
                  {/* Google Maps Embed */}
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY || "g"}&q=${encodeURIComponent(contactInfo.address)}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="CharityConnect Location"
                  />
                </Box>
              </Paper>

              {/* Social Media */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: isDark ? '#e8e8f0' : '#1a1a2e',
                    mb: 2,
                  }}
                >
                  Connect With Us
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? '#a0a0b8' : '#4a4a6a',
                    mb: 3,
                  }}
                >
                  Follow us on social media for updates and news
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {socialLinks.map((social, index) => (
                    <Tooltip key={index} title={social.label}>
                      <IconButton
                        component="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          color: isDark ? '#a0a0b8' : '#4a4a6a',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: `${social.color}20`,
                            color: social.color,
                            transform: 'translateY(-4px)',
                          },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Snackbar for notifications */}
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
            icon={error ? <ErrorIcon /> : <CheckCircleIcon />}
          >
            {error || 'Message sent successfully! We\'ll get back to you soon.'}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ContactUs;