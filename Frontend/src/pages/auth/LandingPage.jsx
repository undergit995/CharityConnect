import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  LinearProgress,
  Divider,
  useMediaQuery,
  Stack,
  Fade,
  Slide,
  Zoom,
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  VolunteerActivism as VolunteerIcon,
  EmojiEvents as ImpactIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Share as ShareIcon,
  ArrowForward as ArrowForwardIcon,
  PlayCircle as PlayCircleIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  StarHalf as StarHalfIcon,
  People as PeopleIcon,
  MedicalServices as MedicalIcon,
  School as EducationIcon,
  Restaurant as FoodIcon,
  Pets as AnimalIcon,
  ChildCare as ChildrenIcon,
  Female as WomenIcon,
  Elderly as ElderlyIcon,
  Forest as EnvironmentIcon,
  Groups as CommunityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

// Import images (you'll need to add these)
// import heroImage from '../../assets/images/hero-bg.jpg';
// import charity1 from '../../assets/images/charity1.jpg';
// import charity2 from '../../assets/images/charity2.jpg';
// import charity3 from '../../assets/images/charity3.jpg';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// Category Icons Mapping
const categoryIcons = {
  Medical: <MedicalIcon />,
  Education: <EducationIcon />,
  Food: <FoodIcon />,
  'Disaster Relief': <VolunteerIcon />,
  'Animal Welfare': <AnimalIcon />,
  Children: <ChildrenIcon />,
  Women: <WomenIcon />,
  Elderly: <ElderlyIcon />,
  Environment: <EnvironmentIcon />,
  Community: <CommunityIcon />,
};

// Category Colors
const categoryColors = {
  Medical: '#e74c3c',
  Education: '#3498db',
  Food: '#f39c12',
  'Disaster Relief': '#e67e22',
  'Animal Welfare': '#2ecc71',
  Children: '#1abc9c',
  Women: '#9b59b6',
  Elderly: '#34495e',
  Environment: '#27ae60',
  Community: '#2980b9',
};

const LandingPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);

  // Hero Section Animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto-rotate featured campaigns
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredCampaigns.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Featured Campaigns Data
  const featuredCampaigns = [
    {
      id: 1,
      title: 'Emergency Medical Relief',
      organization: 'Doctors Without Borders',
      description: 'Providing urgent medical care to communities in crisis zones around the world.',
      image: "noIMG",
      raised: 125000,
      goal: 200000,
      donors: 3450,
      daysLeft: 12,
      category: 'Medical',
      verified: true,
    },
    {
      id: 2,
      title: 'Education for All',
      organization: 'Global Education Fund',
      description: 'Building schools and providing educational resources to underprivileged children.',
      image: "charity2",
      raised: 89000,
      goal: 150000,
      donors: 2100,
      daysLeft: 18,
      category: 'Education',
      verified: true,
    },
    {
      id: 3,
      title: 'Food Security Initiative',
      organization: 'World Food Program',
      description: 'Combating hunger by providing nutritious meals to vulnerable communities.',
      image: "charity3",
      raised: 215000,
      goal: 300000,
      donors: 5600,
      daysLeft: 25,
      category: 'Food',
      verified: true,
    },
  ];

  const categories = [
    { name: 'Medical', icon: <MedicalIcon />, color: '#e74c3c' },
    { name: 'Education', icon: <EducationIcon />, color: '#3498db' },
    { name: 'Food', icon: <FoodIcon />, color: '#f39c12' },
    { name: 'Disaster Relief', icon: <VolunteerIcon />, color: '#e67e22' },
    { name: 'Animal Welfare', icon: <AnimalIcon />, color: '#2ecc71' },
    { name: 'Children', icon: <ChildrenIcon />, color: '#1abc9c' },
    { name: 'Women', icon: <WomenIcon />, color: '#9b59b6' },
    { name: 'Elderly', icon: <ElderlyIcon />, color: '#34495e' },
    { name: 'Environment', icon: <EnvironmentIcon />, color: '#27ae60' },
    { name: 'Community', icon: <CommunityIcon />, color: '#2980b9' },
  ];

  const successStories = [
    {
      id: 1,
      title: 'Clean Water for 500 Families',
      description: 'Our donors helped provide clean water access to 500 families in rural communities.',
      image: "charity1",
      impact: '500+ Families',
      raised: 45,
    },
    {
      id: 2,
      title: 'School Built in Malawi',
      description: 'A new school was built, providing education to 300 children who previously had none.',
      image: "charity2",
      impact: '300 Students',
      raised: 75,
    },
    {
      id: 3,
      title: 'Emergency Food Distribution',
      description: 'Over 10,000 meals were distributed to families affected by natural disasters.',
      image: "charity3",
      impact: '10,000+ Meals',
      raised: 30,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Regular Donor',
      avatar: '',
      quote: 'CharityConnect makes it so easy to support causes I care about. I love seeing the impact of my donations in real-time.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Charity Organizer',
      avatar: '',
      quote: 'This platform has transformed how we raise funds. The transparency and ease of use have helped us grow our donor base significantly.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'First-time Donor',
      avatar: '',
      quote: 'I was hesitant to donate online, but CharityConnect made it so simple and secure. I\'m now a regular supporter!',
      rating: 4,
    },
  ];

  const stats = [
    { icon: <VolunteerIcon />, value: '50K+', label: 'Active Donors' },
    { icon: <ImpactIcon />, value: '₹2.5M+', label: 'Donations Raised' },
    { icon: <ImpactIcon />, value: '1.2K+', label: 'Campaigns Funded' },
    { icon: <PeopleIcon />, value: '500+', label: 'Trusted Charities' },
  ];

  const trustedCharities = [
    { name: 'Red Cross', logo: '/images/red-cross.svg' },
    { name: 'UNICEF', logo: '/images/unicef.svg' },
    { name: 'WWF', logo: '/images/wwf.svg' },
    { name: 'Oxfam', logo: '/images/oxfam.svg' },
    { name: 'Save the Children', logo: '/images/save-children.svg' },
  ];

  const features = [
    {
      icon: <SecurityIcon />,
      title: 'Secure Donations',
      description: 'Your donations are protected with enterprise-grade security and encryption.',
    },
    {
      icon: <SpeedIcon />,
      title: 'Fast & Easy',
      description: 'Donate in minutes with our streamlined checkout process and quick payment options.',
    },
    {
      icon: <TrendingIcon />,
      title: 'Transparent Impact',
      description: 'Track your donations and see the real-time impact of your contributions.',
    },
    {
      icon: <VolunteerIcon />,
      title: 'Verified Charities',
      description: 'Every charity on our platform is verified and vetted for legitimacy.',
    },
  ];

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/campaigns?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<StarIcon key={i} sx={{ color: '#f39c12', fontSize: 16 }} />);
      } else if (i < rating) {
        stars.push(<StarHalfIcon key={i} sx={{ color: '#f39c12', fontSize: 16 }} />);
      } else {
        stars.push(<StarIcon key={i} sx={{ color: isDark ? '#4a4a6a' : '#d1d1d1', fontSize: 16 }} />);
      }
    }
    return stars;
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* ===== HERO SECTION ===== */}
      <Box
        ref={heroRef}
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: isDark
            ? 'linear-gradient(135deg, #0a0a12 0%, #141420 50%, #1a1a2e 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          overflow: 'hidden',
          pt: { xs: 8, md: 10 },
        }}
      >
        {/* Animated Background Shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: isDark
              ? 'rgba(123, 147, 232, 0.05)'
              : 'rgba(255, 255, 255, 0.05)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: isDark
              ? 'rgba(123, 147, 232, 0.03)'
              : 'rgba(255, 255, 255, 0.03)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box sx={{ mb: 4 }}>
                  <Chip
                    label="🌟 Making a Difference Together"
                    sx={{
                      mb: 2,
                      backgroundColor: isDark
                        ? 'rgba(123, 147, 232, 0.15)'
                        : 'rgba(255, 255, 255, 0.2)',
                      color: isDark ? '#7b93e8' : '#ffffff',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isDark ? 'rgba(123, 147, 232, 0.2)' : 'rgba(255,255,255,0.2)'}`,
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.1,
                      mb: 2,
                      textShadow: '0 2px 40px rgba(0,0,0,0.1)',
                    }}
                  >
                    Give with
                    <br />
                    <span style={{
                      background: 'linear-gradient(135deg, #fff 0%, #f0e6ff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Confidence
                    </span>
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255,255,255,0.85)',
                      maxWidth: 500,
                      mb: 4,
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.25rem' },
                    }}
                  >
                    Connect with verified charities, make secure donations,
                    and track your impact in real-time.
                  </Typography>

                  {/* Search Bar */}
                  <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      maxWidth: 500,
                      flexWrap: 'wrap',
                    }}
                  >
                    <TextField
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 3,
                          '& fieldset': {
                            borderColor: isDark
                              ? 'rgba(255,255,255,0.1)'
                              : 'rgba(255,255,255,0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.4)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ffffff',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#ffffff',
                          py: 1.5,
                          '&::placeholder': {
                            color: 'rgba(255,255,255,0.6)',
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 3,
                        backgroundColor: '#ffffff',
                        color: '#667eea',
                        fontWeight: 700,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Search
                    </Button>
                  </Box>

                  {/* Stats */}
                  <Box sx={{ display: 'flex', gap: 4, mt: 4, flexWrap: 'wrap' }}>
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Box>
                          <Typography
                            variant="h4"
                            sx={{
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: { xs: '1.5rem', md: '2rem' },
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255,255,255,0.7)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            {stat.icon}
                            {stat.label}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/* Hero Image/Illustration */}
                  <Box
                    component="img"
                    src="https://i.dawn.com/primary/2025/04/171654146396dcc.jpg"
                    alt="Charity Illustration"
                    sx={{
                      width: '100%',
                      maxWidth: 500,
                      height: 'auto',
                      filter: isDark ? 'brightness(0.8)' : 'none',
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
            cursor: 'pointer',
          }}
          onClick={() => {
            document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 50,
              border: `2px solid rgba(255,255,255,0.3)`,
              borderRadius: 15,
              display: 'flex',
              justifyContent: 'center',
              pt: 1,
            }}
          >
            <Box
              sx={{
                width: 4,
                height: 10,
                borderRadius: 2,
                backgroundColor: '#ffffff',
                animation: 'scrollDown 2s infinite',
              }}
            />
          </Box>
        </Box>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
            40% { transform: translateX(-50%) translateY(-10px); }
            60% { transform: translateX(-50%) translateY(-5px); }
          }
          @keyframes scrollDown {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(20px); opacity: 0; }
          }
        `}</style>
      </Box>

      {/* ===== FEATURES SECTION ===== */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="overline"
                sx={{ color: '#667eea', fontWeight: 700, letterSpacing: 2 }}
              >
                Why Choose Us
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                }}
              >
                Making Giving Simple & Secure
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: isDark ? '#a0a0b8' : '#4a4a6a',
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                We've built a platform that connects donors with verified charities
                through a seamless, transparent experience.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        height: '100%',
                        background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: isDark
                            ? '0 8px 40px rgba(0,0,0,0.4)'
                            : '0 8px 40px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        {React.cloneElement(feature.icon, {
                          sx: { color: '#ffffff', fontSize: 30 },
                        })}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: isDark ? '#e8e8f0' : '#1a1a2e',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}
                      >
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ===== CATEGORIES SECTION ===== */}
      <Box id="categories" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="overline"
                sx={{ color: '#667eea', fontWeight: 700, letterSpacing: 2 }}
              >
                Categories
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: isDark ? '#e8e8f0' : '#1a1a2e',
                }}
              >
                Find Your Cause
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: isDark ? '#a0a0b8' : '#4a4a6a',
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Browse campaigns by category and find the cause that speaks to you.
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {categories.map((category, index) => (
                <Grid item xs={6} sm={4} md={2.4} key={index}>
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Paper
                      onClick={() => navigate(`/campaigns?category=${category.name}`)}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: isDark ? 'rgba(20,20,32,0.6)' : '#ffffff',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: isDark
                            ? '0 8px 30px rgba(0,0,0,0.3)'
                            : '0 8px 30px rgba(0,0,0,0.08)',
                          borderColor: category.color,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: `${category.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1,
                          color: category.color,
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: isDark ? '#e8e8f0' : '#1a1a2e',
                        }}
                      >
                        {category.name}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ===== FEATURED CAMPAIGNS SECTION ===== */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: '#667eea', fontWeight: 700, letterSpacing: 2 }}
            >
              Featured Campaigns
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
              }}
            >
              Urgent Causes Needing Support
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {featuredCampaigns.map((campaign, index) => (
              <Grid item xs={12} md={4} key={campaign.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: isDark ? 'rgba(20,20,32,0.8)' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: isDark
                          ? '0 12px 50px rgba(0,0,0,0.4)'
                          : '0 12px 50px rgba(0,0,0,0.1)',
                      },
                    }}
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={campaign.image}
                        alt={campaign.title}
                      />
                      <Chip
                        label={campaign.category}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          backgroundColor: categoryColors[campaign.category] || '#667eea',
                          color: '#ffffff',
                          fontWeight: 600,
                        }}
                      />
                      {campaign.verified && (
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                          label="Verified"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: '#2ecc71',
                            color: '#ffffff',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: isDark ? '#e8e8f0' : '#1a1a2e',
                        }}
                      >
                        {campaign.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark ? '#a0a0b8' : '#4a4a6a',
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {campaign.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isDark ? '#6a6a80' : '#9a9ab0',
                          display: 'block',
                          mb: 1,
                        }}
                      >
                        by {campaign.organization}
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                            ₹{campaign.raised.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}>
                            ₹{campaign.goal.toLocaleString()}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(campaign.raised / campaign.goal) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }}>
                          {campaign.donors.toLocaleString()} donors
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600 }}>
                          {campaign.daysLeft} days left
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/campaigns')}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View All Campaigns
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ===== SUCCESS STORIES ===== */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: '#667eea', fontWeight: 700, letterSpacing: 2 }}
            >
              Impact Stories
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: isDark ? '#e8e8f0' : '#1a1a2e',
              }}
            >
              Real Stories, Real Impact
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#a0a0b8' : '#4a4a6a',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              See how your donations are making a difference in communities around the world.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {successStories.map((story, index) => (
              <Grid item xs={12} md={4} key={story.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: 400,
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={story.image}
                      alt={story.title}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: isDark ? '#e8e8f0' : '#1a1a2e',
                        }}
                      >
                        {story.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark ? '#a0a0b8' : '#4a4a6a',
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {story.description}
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#e8e8f0' : '#1a1a2e' }}>
                            {story.impact}
                          </Typography>
                          </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(story.raised )}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }}
                        />
                        </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      </Box>
  );
}

export default LandingPage;