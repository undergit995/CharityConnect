import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  InputBase,
  alpha,
  useMediaQuery,
  Container,
  Tooltip,
  Collapse,
  ListSubheader,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Campaign as CampaignIcon,
  VolunteerActivism as DonateIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Business as CharityIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  Receipt as ReceiptIcon,
  Help as HelpIcon,
  ContactSupport as ContactIcon,
  Info as AboutIcon,
  PrivacyTip as PrivacyIcon,
  Gavel as TermsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../context/AuthContext';

// Navigation Items Configuration
const navItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Campaigns', path: '/campaigns', icon: <CampaignIcon /> },
  { label: 'Donate', path: '/donate', icon: <DonateIcon /> },
];

const adminNavItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Manage Charities', path: '/admin/charities', icon: <CharityIcon /> },
  { label: 'Manage Campaigns', path: '/admin/campaigns', icon: <CampaignIcon /> },
];

const charityNavItems = [
  { label: 'Dashboard', path: '/charity/dashboard', icon: <DashboardIcon /> },
  { label: 'My Campaigns', path: '/charity/campaigns', icon: <CampaignIcon /> },
  { label: 'Create Campaign', path: '/charity/campaigns/create', icon: <DonateIcon /> },
];

const donorNavItems = [
  { label: 'Dashboard', path: '/donor', icon: <DashboardIcon /> },
  { label: 'My Donations', path: '/donations', icon: <ReceiptIcon /> },
  { label: 'Saved Campaigns', path: '/saved', icon: <FavoriteIcon /> },
];

const AppBarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, permissions, hasRole } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifMenuOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifMenuClose = () => {
    setNotifAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
    navigate('/auth/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/campaigns?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get user role based navigation
  const getRoleBasedNav = () => {
    if (hasRole('admin')) return adminNavItems;
    if (hasRole('charity')) return charityNavItems;
    if (hasRole('donor')) return donorNavItems;
    return [];
  };

  const roleNavItems = getRoleBasedNav();

  // Mobile Drawer Content
  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', overflow: 'auto' }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CharityConnect
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* User Info */}
      {isAuthenticated && user && (
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{ width: 48, height: 48 }}
          >
            {user.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {user.name || 'User'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      <List sx={{ p: 1 }}>
        {/* Main Navigation */}
        <ListItem>
          <Typography variant="caption" color="textSecondary" sx={{ px: 1 }}>
            Main Menu
          </Typography>
        </ListItem>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                background: isDark 
                  ? 'rgba(102, 126, 234, 0.15)' 
                  : 'rgba(102, 126, 234, 0.08)',
                '&:hover': {
                  background: isDark 
                    ? 'rgba(102, 126, 234, 0.25)' 
                    : 'rgba(102, 126, 234, 0.15)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#667eea' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}

        {/* Role-based Navigation */}
        {isAuthenticated && roleNavItems.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem>
              <Typography variant="caption" color="textSecondary" sx={{ px: 1 }}>
                Your Dashboard
              </Typography>
            </ListItem>
            {roleNavItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  handleDrawerToggle();
                }}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    background: isDark 
                      ? 'rgba(102, 126, 234, 0.15)' 
                      : 'rgba(102, 126, 234, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? '#667eea' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Footer Links */}
        <ListItem button onClick={() => { navigate('/about'); handleDrawerToggle(); }}>
          <ListItemIcon><AboutIcon /></ListItemIcon>
          <ListItemText primary="About Us" />
        </ListItem>
        <ListItem button onClick={() => { navigate('/contact'); handleDrawerToggle(); }}>
          <ListItemIcon><ContactIcon /></ListItemIcon>
          <ListItemText primary="Contact" />
        </ListItem>
        <ListItem button onClick={() => { navigate('/faq'); handleDrawerToggle(); }}>
          <ListItemIcon><HelpIcon /></ListItemIcon>
          <ListItemText primary="FAQ" />
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Theme Toggle */}
        <ListItem button onClick={toggleTheme}>
          <ListItemIcon>
            {isDark ? <LightIcon /> : <DarkIcon />}
          </ListItemIcon>
          <ListItemText primary={isDark ? 'Light Mode' : 'Dark Mode'} />
        </ListItem>

        {/* Auth Buttons */}
        {!isAuthenticated ? (
          <>
            <ListItem
              button
              onClick={() => { navigate('/auth/login'); handleDrawerToggle(); }}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              button
              onClick={() => { navigate('/auth/register'); handleDrawerToggle(); }}
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#fff' }}>
                <RegisterIcon />
              </ListItemIcon>
              <ListItemText primary="Register" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>
          </>
        ) : (
          <ListItem
            button
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: isDark
            ? scrolled 
              ? 'rgba(10, 10, 18, 0.92)' 
              : 'rgba(10, 10, 18, 0.8)'
            : scrolled 
              ? 'rgba(255, 255, 255, 0.92)' 
              : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: scrolled
            ? isDark
              ? '0 4px 30px rgba(0,0,0,0.3)'
              : '0 4px 30px rgba(0,0,0,0.08)'
            : 'none',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1, minHeight: { xs: 64, md: 72 } }}>
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 },
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px',
                  }}
                >
                  CharityConnect
                </Typography>
              </motion.div>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4, gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    position: 'relative',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? '#667eea' : 'inherit',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: location.pathname === item.path ? '20px' : '0',
                      height: '3px',
                      borderRadius: '2px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    },
                    '&:hover::after': {
                      width: '20px',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Role-based navigation items */}
              {isAuthenticated && roleNavItems.length > 0 && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  {roleNavItems.slice(0, 2).map((item) => (
                    <Button
                      key={item.path}
                      component={Link}
                      to={item.path}
                      color="inherit"
                      sx={{
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        color: location.pathname === item.path ? '#667eea' : 'inherit',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </>
              )}
            </Box>

            {/* Right Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              {/* Search Button - Mobile */}
              {!isMobile && (
                <IconButton
                  onClick={() => setSearchOpen(!searchOpen)}
                  sx={{ color: isDark ? '#a0a0b8' : '#4a4a6a' }}
                >
                  <SearchIcon />
                </IconButton>
              )}

              {/* Theme Toggle */}
              <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(30deg)',
                    },
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDark ? <LightIcon /> : <DarkIcon />}
                  </motion.div>
                </IconButton>
              </Tooltip>

              {/* Notifications */}
              {isAuthenticated && (
                <Tooltip title="Notifications">
                  <IconButton onClick={handleNotifMenuOpen}>
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {/* Profile / Auth */}
              {isAuthenticated ? (
                <>
                  <Tooltip title="Profile">
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      sx={{ p: 0.5 }}
                    >
                      <Avatar
                        src={user?.avatar}
                        alt={user?.name || 'User'}
                        sx={{
                          width: 36,
                          height: 36,
                          border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                        }}
                      >
                        {user?.name?.charAt(0) || 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: 3,
                        background: isDark ? 'rgba(20,20,32,0.95)' : '#ffffff',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        boxShadow: isDark
                          ? '0 8px 40px rgba(0,0,0,0.3)'
                          : '0 8px 40px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user?.name || 'User'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
                      <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
                      <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                      Settings
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    color="inherit"
                    onClick={() => navigate('/auth/login')}
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      borderRadius: 2,
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/auth/register')}
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Register
                  </Button>
                  {/* Mobile Auth Buttons */}
                  <IconButton
                    onClick={() => navigate('/auth/login')}
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                  >
                    <LoginIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Toolbar>

          {/* Search Bar - Expandable */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  component="form"
                  onSubmit={handleSearch}
                  sx={{
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <SearchIcon sx={{ color: isDark ? '#6a6a80' : '#9a9ab0' }} />
                  <InputBase
                    placeholder="Search campaigns, charities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    sx={{
                      flex: 1,
                      '& input': {
                        color: isDark ? '#e8e8f0' : '#1a1a2e',
                        fontSize: '1rem',
                      },
                    }}
                  />
                  <IconButton onClick={() => setSearchOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 280,
            background: isDark ? 'rgba(10,10,18,0.98)' : '#ffffff',
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={handleNotifMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 320,
            maxHeight: 400,
            borderRadius: 3,
            background: isDark ? 'rgba(20,20,32,0.95)' : '#ffffff',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
        </Box>
        <MenuItem onClick={handleNotifMenuClose}>
          <Box>
            <Typography variant="body2">Donation Received</Typography>
            <Typography variant="caption" color="textSecondary">
              You received a donation of $100
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotifMenuClose}>
          <Box>
            <Typography variant="body2">Campaign Approved</Typography>
            <Typography variant="caption" color="textSecondary">
              Your campaign has been approved
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotifMenuClose}>
          <Box>
            <Typography variant="body2">New Donor</Typography>
            <Typography variant="caption" color="textSecondary">
              Someone donated to your campaign
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      {/* Spacer for fixed AppBar */}
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }} />
    </>
  );
};

export default AppBarComponent;