import React, { lazy } from 'react';

// Create a function to lazy load components with prefetching
export const lazyLoad = (importFn, moduleName) => {
  const Component = lazy(importFn);
  
  // Add display name for better debugging
  Component.displayName = `LazyLoad(${moduleName})`;
  
  // Prefetch function
  Component.prefetch = () => {
    importFn();
  };
  
  return Component;
};

// Public Routes
export const PublicRoutes = {
  Home: lazyLoad(() => import('./pages/HomePage'), 'HomePage'),
  About: lazyLoad(() => import('./pages/About'), 'About'),
  Contact: lazyLoad(() => import('./pages/Contact'), 'Contact'),
  FAQ: lazyLoad(() => import('./pages/FAQ'), 'FAQ'),
  Privacy: lazyLoad(() => import('./pages/PrivacyPolicy'), 'PrivacyPolicy'),
  Terms: lazyLoad(() => import('./pages/TermsConditions'), 'TermsConditions'),
};

// Auth Routes
export const AuthRoutes = {
  Login: lazyLoad(() => import('./pages/auth/Login'), 'Login'),
  Register: lazyLoad(() => import('./pages/auth/Register'), 'Register'),
  ForgotPassword: lazyLoad(() => import('./pages/auth/ForgotPassword'), 'ForgotPassword'),
  ResetPassword: lazyLoad(() => import('./pages/auth/ResetPassword'), 'ResetPassword'),
  VerifyEmail: lazyLoad(() => import('./pages/auth/VerifyEmail'), 'VerifyEmail'),
  VerifyOTP: lazyLoad(() => import('./pages/auth/VerifyOTP'), 'VerifyOTP'),
};

// Dashboard Routes
export const DashboardRoutes = {
  Dashboard: lazyLoad(() => import('./pages/Dashboard'), 'Dashboard'),
  AdminDashboard: lazyLoad(() => import('./pages/AdminDashboard'), 'AdminDashboard'),
  CharityDashboard: lazyLoad(() => import('./pages/CharityDashboard'), 'CharityDashboard'),
  DonorDashboard: lazyLoad(() => import('./pages/DonorDashboard'), 'DonorDashboard'),
};

// Campaign Routes
export const CampaignRoutes = {
  List: lazyLoad(() => import('./pages/CampaignList'), 'CampaignList'),
  Details: lazyLoad(() => import('./pages/CampaignDetails'), 'CampaignDetails'),
  Create: lazyLoad(() => import('./pages/CreateCampaign'), 'CreateCampaign'),
  Edit: lazyLoad(() => import('./pages/EditCampaign'), 'EditCampaign'),
  Manage: lazyLoad(() => import('./pages/CampaignManagement'), 'CampaignManagement'),
};

// Donation Routes
export const DonationRoutes = {
  Donate: lazyLoad(() => import('./pages/DonationPage'), 'DonationPage'),
  History: lazyLoad(() => import('./pages/DonationHistory'), 'DonationHistory'),
  Receipt: lazyLoad(() => import('./pages/DonationReceipt'), 'DonationReceipt'),
};

// Profile Routes
export const ProfileRoutes = {
  Profile: lazyLoad(() => import('./pages/Profile'), 'Profile'),
  Settings: lazyLoad(() => import('./pages/Settings'), 'Settings'),
  Notifications: lazyLoad(() => import('./pages/NotificationPreferences'), 'NotificationPreferences'),
};

// Error Routes
export const ErrorRoutes = {
  NotFound: lazyLoad(() => import('./pages/NotFound'), 'NotFound'),
  Unauthorized: lazyLoad(() => import('./pages/Unauthorized'), 'Unauthorized'),
  Maintenance: lazyLoad(() => import('./pages/Maintenance'), 'Maintenance'),
};

// Route Configuration Object
export const routeConfig = {
  public: {
    path: '/',
    children: [
      { path: '/', component: PublicRoutes.Home, exact: true },
      { path: '/about', component: PublicRoutes.About },
      { path: '/contact', component: PublicRoutes.Contact },
      { path: '/faq', component: PublicRoutes.FAQ },
      { path: '/privacy', component: PublicRoutes.Privacy },
      { path: '/terms', component: PublicRoutes.Terms },
    ]
  },
  auth: {
    path: '/auth',
    children: [
      { path: 'login', component: AuthRoutes.Login },
      { path: 'register', component: AuthRoutes.Register },
      { path: 'forgot-password', component: AuthRoutes.ForgotPassword },
      { path: 'reset-password', component: AuthRoutes.ResetPassword },
      { path: 'verify-email', component: AuthRoutes.VerifyEmail },
      { path: 'verify-otp', component: AuthRoutes.VerifyOTP },
    ]
  },
  campaigns: {
    path: '/campaigns',
    children: [
      { path: '', component: CampaignRoutes.List },
      { path: ':id', component: CampaignRoutes.Details },
      { path: ':id/donate', component: DonationRoutes.Donate },
    ]
  },
  dashboard: {
    path: '/dashboard',
    protected: true,
    component: DashboardRoutes.Dashboard,
  },
  admin: {
    path: '/admin',
    protected: true,
    roles: ['admin'],
    children: [
      { path: 'dashboard', component: DashboardRoutes.AdminDashboard },
      { path: 'charities', component: lazyLoad(() => import('./pages/CharityManagement'), 'CharityManagement') },
      { path: 'campaigns', component: CampaignRoutes.Manage },
    ]
  },
  charity: {
    path: '/charity',
    protected: true,
    roles: ['admin', 'charity'],
    children: [
      { path: 'dashboard', component: DashboardRoutes.CharityDashboard },
      { path: 'campaigns/create', component: CampaignRoutes.Create },
      { path: 'campaigns/:id/edit', component: CampaignRoutes.Edit },
      { path: 'campaigns/manage', component: CampaignRoutes.Manage },
      { path: ':id', component: lazyLoad(() => import('./pages/CharityProfile'), 'CharityProfile') },
    ]
  },
  donor: {
    path: '/donor',
    protected: true,
    roles: ['admin', 'charity', 'donor'],
    children: [
      { path: 'dashboard', component: DashboardRoutes.DonorDashboard },
    ]
  },
  profile: {
    path: '/profile',
    protected: true,
    component: ProfileRoutes.Profile,
  },
  settings: {
    path: '/settings',
    protected: true,
    component: ProfileRoutes.Settings,
  },
  notifications: {
    path: '/notifications',
    protected: true,
    component: ProfileRoutes.Notifications,
  },
  donations: {
    path: '/donations',
    protected: true,
    children: [
      { path: '', component: DonationRoutes.History },
      { path: ':id/receipt', component: DonationRoutes.Receipt },
    ]
  },
  error: {
    children: [
      { path: '/unauthorized', component: ErrorRoutes.Unauthorized },
      { path: '/maintenance', component: ErrorRoutes.Maintenance },
      { path: '*', component: ErrorRoutes.NotFound },
    ]
  }
};

// Route Paths Helper
export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  VERIFY_OTP: '/auth/verify-otp',
  
  // Campaigns
  CAMPAIGNS: '/campaigns',
  CAMPAIGN_DETAILS: (id) => `/campaigns/${id}`,
  CAMPAIGN_DONATE: (id) => `/campaigns/${id}/donate`,
  
  // Charity
  CHARITY_PROFILE: (id) => `/charity/${id}`,
  CHARITY_DASHBOARD: '/charity/dashboard',
  CHARITY_CREATE_CAMPAIGN: '/charity/campaigns/create',
  CHARITY_EDIT_CAMPAIGN: (id) => `/charity/campaigns/${id}/edit`,
  CHARITY_MANAGE_CAMPAIGNS: '/charity/campaigns/manage',
  
  // Donor
  DONOR_DASHBOARD: '/donor/dashboard',
  DONATIONS: '/donations',
  DONATION_RECEIPT: (id) => `/donations/${id}/receipt`,
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CHARITIES: '/admin/charities',
  ADMIN_CAMPAIGNS: '/admin/campaigns',
  
  // User
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  
  // Error
  UNAUTHORIZED: '/unauthorized',
  MAINTENANCE: '/maintenance',
};