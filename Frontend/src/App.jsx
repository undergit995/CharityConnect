import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Maintenance from "./pages/Maintenance";
import axios from "axios";
import { ThemeProvider } from "./Theme/ThemeContext";
import LandingPage from "./pages/auth/LandingPage";
import LandingPageLayout from "./pages/LandingPageLayout";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { ProtectedRoute } from "./routes/ProtectedRoutes";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import DonorRoutes from "./routes/DonorRoutes";
import CharityRoutes from "./routes/CharityRoutes";
import OfflinePage from "./pages/auth/OfflinePage";

// import { ProtectedRoute, AdminRoute, CharityRoute, DonorRoute } from './components/ProtectedRoute';
// import { theme } from './styles/theme';

// Lazy load components for better performance
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Registration"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/EmailVerify"));
const VerifyOTP = lazy(() => import("./pages/auth/VerifyOTP"));
const AuthLoader = lazy(() => import("./commonComponents/AuthLoader"));

// Dashboard components
// const Dashboard = lazy(() => import('./pages/Dashboard'));
// const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
// const CharityDashboard = lazy(() => import('./pages/CharityDashboard'));
// const DonorDashboard = lazy(() => import('./pages/DonorDashboard'));

// // Profile and Settings
// const Profile = lazy(() => import('./pages/Profile'));
// const Settings = lazy(() => import('./pages/Settings'));
// const NotificationPreferences = lazy(() => import('./pages/NotificationPreferences'));

// // Campaign pages
// const CampaignList = lazy(() => import('./pages/CampaignList'));
// const CampaignDetails = lazy(() => import('./pages/CampaignDetails'));
// const CreateCampaign = lazy(() => import('./pages/CreateCampaign'));
// const EditCampaign = lazy(() => import('./pages/EditCampaign'));
// const CampaignManagement = lazy(() => import('./pages/CampaignManagement'));

// // Donation pages
// const DonationPage = lazy(() => import('./pages/DonationPage'));
// const DonationHistory = lazy(() => import('./pages/DonationHistory'));
// const DonationReceipt = lazy(() => import('./pages/DonationReceipt'));

// // Charity pages
// const CharityProfile = lazy(() => import('./pages/CharityProfile'));
// const CharityManagement = lazy(() => import('./pages/CharityManagement'));

// Common pages
// const HomePage = lazy(() => import('./pages/HomePage'));
// const About = lazy(() => import('./pages/About'));
// const Contact = lazy(() => import('./pages/Contact'));
// const FAQ = lazy(() => import('./pages/FAQ'));
// const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
// const TermsConditions = lazy(() => import('./pages/TermsConditions'));

// Error pages
// const NotFound = lazy(() => import('./pages/NotFound'));
// const Unauthorized = lazy(() => import('./pages/Unauthorized'));

const globalStyles = {
  "*": {
    transition:
      "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
  },
  "::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "::-webkit-scrollbar-track": {
    background: (theme) => theme.palette.background.default,
  },
  "::-webkit-scrollbar-thumb": {
    background: (theme) => theme.palette.primary.main,
    borderRadius: "4px",
    "&:hover": {
      background: (theme) => theme.palette.primary.dark,
    },
  },
  ".dark-mode": {
    "& ::-webkit-scrollbar-track": {
      background: "#0a0a12",
    },
  },
};

// Loading Components
const PageLoader = () => {    
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = theme.isDark;
  } catch {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          border: "4px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
          borderTopColor: "#fff",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p
        style={{
          color: "#fff",
          marginTop: 20,
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: "0.5px",
        }}
      >
        Loading...
      </p>
      <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
    </div>
  );
};

const SkeletonLoader = () => (
  <div style={{ padding: 20 }}>
    <div
      style={{
        height: 200,
        background:
          "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        borderRadius: 12,
        animation: "shimmer 1.5s infinite",
      }}
    />
    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
);

// Error Fallback Component with Theme Support
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  // Try to use theme if available, fallback to light mode
  let isDark = false;
  try {
    const theme = useTheme();
    isDark = theme.isDark;
  } catch {
    // Theme not available, use system preference or default to light
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      isDark = true;
    }
  }

  useEffect(() => {
    // Log error to error tracking service
    console.error("Application Error:", error);
  }, [error]);

  const handleGoHome = () => {
    resetErrorBoundary();
    window.location.href = "/";
  };

  const handleTryAgain = () => {
    resetErrorBoundary();
    window.location.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 20,
        background: isDark ? "#0a0a12" : "#f8f9fa",
        transition: "background-color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          width: "100%",
          padding: 40,
          backgroundColor: isDark ? "#141420" : "#ffffff",
          borderRadius: 16,
          boxShadow: isDark
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.06)",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            fontSize: 64,
            marginBottom: 16,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span role="img" aria-label="error">
            <WarningAmberIcon/>
          </span>
        </div>

        <h2
          style={{
            color: isDark ? "#e8e8f0" : "#1a1a2e",
            marginBottom: 8,
            fontSize: "1.75rem",
            fontWeight: 700,
          }}
        >
          Oops! Something went wrong
        </h2>

        <p
          style={{
            color: isDark ? "#a0a0b8" : "#4a4a6a",
            marginBottom: 8,
            fontSize: "1rem",
          }}
        >
          We're sorry for the inconvenience. Please try again or go back home.
        </p>

        {error && (
          <div
            style={{
              padding: 12,
              margin: "16px 0",
              backgroundColor: isDark
                ? "rgba(231, 76, 60, 0.1)"
                : "rgba(231, 76, 60, 0.05)",
              borderRadius: 8,
              border: `1px solid ${isDark ? "rgba(231, 76, 60, 0.2)" : "rgba(231, 76, 60, 0.1)"}`,
            }}
          >
            <p
              style={{
                color: isDark ? "#e74c3c" : "#d32f2f",
                fontSize: "0.875rem",
                margin: 0,
                wordBreak: "break-word",
              }}
            >
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 24,
          }}
        >
          <button
            onClick={handleTryAgain}
            style={{
              padding: "12px 32px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "0.9375rem",
              fontWeight: 600,
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              flex: "1 1 auto",
              minWidth: "120px",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
            }}
          >
            🔄 Try Again
          </button>

          <button
            onClick={handleGoHome}
            style={{
              padding: "12px 32px",
              backgroundColor: "transparent",
              color: isDark ? "#e8e8f0" : "#1a1a2e",
              border: `2px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "0.9375rem",
              fontWeight: 600,
              transition: "all 0.3s ease",
              flex: "1 1 auto",
              minWidth: "120px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Go Home
          </button>
        </div>

        {/* Support Link */}
        <p
          style={{
            marginTop: 24,
            fontSize: "0.875rem",
            color: isDark ? "#6a6a80" : "#9a9ab0",
          }}
        >
          Need help?{" "}
          <a
            href="/contact"
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontWeight: 500,
            }}
            onClick={(e) => {
              e.preventDefault();
              resetErrorBoundary();
              window.location.href = "/contact";
            }}
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};


// Routes Configuration
// const AppRoutes = () => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <PageLoader />;
//   }

//   return (
//     <Suspense
//       fallback={<AuthLoader variant="logo" message="Initializing..." />}
//     >
//       {/* <Routes>
//         {/* Public Routes
//          <Route path="/" element={<LandingPageLayout />} >
//           <Route index element={<LandingPage />} />
//           <Route path="/home" element={<LandingPage />} />
//         </Route>
//         {/*<Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/faq" element={<FAQ />} />
//         <Route path="/privacy" element={<PrivacyPolicy />} />
//         <Route path="/terms" element={<TermsConditions />} /> 

//         {/* Auth Routes 
//         <Route
//           path="/auth/login"
//           element={
//             isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
//           }
//         />
//         <Route
//           path="/auth/register"
//           element={
//             isAuthenticated ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <Register />
//             )
//           }
//         />
//         <Route path="/auth/forgot-password" element={<ForgotPassword />} />
//         <Route path="/auth/verify-email" element={<VerifyEmail />} />
//         <Route path="/auth/verify-otp" element={<VerifyOTP />} />

//         {/* Campaign Routes 
//         {/* <Route path="/campaigns" element={<CampaignList />} /> 
//         {/* <Route path="/campaigns/:id" element={<CampaignDetails />} />
//         <Route path="/campaigns/:id/donate" element={<DonationPage />} />

//         <Route path="/charity/:id" element={<CharityProfile />} /> 

//         <Route element={<ProtectedRoute />}>
//           {/* <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/notifications" element={<NotificationPreferences />} />
//           <Route path="/donations" element={<DonationHistory />} />
//           <Route path="/donations/:id/receipt" element={<DonationReceipt />} /> 
//         </Route>

//         {/* Donor Routes 
//          <Route element={<DonorRoute />}>
//           <Route path="/donor/dashboard" element={<DonorDashboard />} />
//         </Route>

//         {/* Charity Routes 
//         <Route element={<CharityRoute />}>
//           <Route path="/charity/dashboard" element={<CharityDashboard />} />
//           <Route
//             path="/charity/campaigns/create"
//             element={<CreateCampaign />}
//           />
//           <Route
//             path="/charity/campaigns/:id/edit"
//             element={<EditCampaign />}
//           />
//           <Route
//             path="/charity/campaigns/manage"
//             element={<CampaignManagement />}
//           />
//         </Route>

//         {/* Admin Routes 
//         <Route element={<AdminRoute />}>
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/charities" element={<CharityManagement />} />
//           <Route path="/admin/campaigns" element={<CampaignManagement />} />
//         </Route>

//         {/* Error Routes 
//         <Route path="/unauthorized" element={<Unauthorized />} />
//         <Route path="/maintenance" element={<Maintenance />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Suspense>
//   );
// }; */}

// // Main App Component



//       <Routes>
//         {/* Public Routes */}
//          <Route path="/" element={<LandingPageLayout />} >
//           <Route index element={<LandingPage />} />
//           <Route path="/home" element={<LandingPage />} />
//         </Route>
//         {/*<Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/faq" element={<FAQ />} />
//         <Route path="/privacy" element={<PrivacyPolicy />} />
//         <Route path="/terms" element={<TermsConditions />} /> */}

//         {/* Auth Routes */}
//         <Route
//           path="/auth/login"
//           element={
//             isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
//           }
//         />
//         <Route
//           path="/auth/register"
//           element={
//             isAuthenticated ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <Register />
//             )
//           }
//         />
//         <Route path="/auth/forgot-password" element={<ForgotPassword />} />
//         <Route path="/auth/verify-email" element={<VerifyEmail />} />
//         <Route path="/auth/verify-otp" element={<VerifyOTP />} />

//         {/* Campaign Routes */}
//         {/* <Route path="/campaigns" element={<CampaignList />} /> */}
//         {/* <Route path="/campaigns/:id" element={<CampaignDetails />} />
//         <Route path="/campaigns/:id/donate" element={<DonationPage />} />

//         <Route path="/charity/:id" element={<CharityProfile />} /> */}

//         <Route element={<ProtectedRoute />}>
//           {/* <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/notifications" element={<NotificationPreferences />} />
//           <Route path="/donations" element={<DonationHistory />} />
//           <Route path="/donations/:id/receipt" element={<DonationReceipt />} /> */}
//         </Route>

//         {/* Donor Routes */}
//         {/* <Route element={<DonorRoute />}>
//           <Route path="/donor/dashboard" element={<DonorDashboard />} />
//         </Route>

//         {/* Charity Routes 
//         <Route element={<CharityRoute />}>
//           <Route path="/charity/dashboard" element={<CharityDashboard />} />
//           <Route
//             path="/charity/campaigns/create"
//             element={<CreateCampaign />}
//           />
//           <Route
//             path="/charity/campaigns/:id/edit"
//             element={<EditCampaign />}
//           />
//           <Route
//             path="/charity/campaigns/manage"
//             element={<CampaignManagement />}
//           />
//         </Route>

//         {/* Admin Routes 
//         <Route element={<AdminRoute />}>
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/charities" element={<CharityManagement />} />
//           <Route path="/admin/campaigns" element={<CampaignManagement />} />
//         </Route>

//         {/* Error Routes 
//         <Route path="/unauthorized" element={<Unauthorized />} />
//         <Route path="/maintenance" element={<Maintenance />} />
//         <Route path="*" element={<NotFound />} /> */}
//       </Routes>
//     </Suspense>
//   );
// };


// Main App Component

// function App() {
//   const [isMaintenance, setIsMaintenance] = useState(false);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [isLoading, setIsLoading] = useState(true);

//   // API base URL
//   const API_BASE_URL = import.meta.env.VITE_REACT_APP__API_URL || 'http://localhost:7000/api';

//   // Create axios instance for maintenance check
//   const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

  
//   useEffect(() => {
//     const checkMaintenance = async () => {
//       try {
//         const response = await api.get('/maintenance');
//         setIsMaintenance(response.data.maintenance || false);
//       } catch (error) {
        
//         const maintenanceMode = localStorage.getItem('maintenanceMode') === 'true';
//         setIsMaintenance(maintenanceMode);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkMaintenance();
//   }, []);

  
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // Loading state
//   if (isLoading) {
//     return (
//       <ThemeProvider>
//         <PageLoader />
//       </ThemeProvider>
//     );
//   }

//   // Maintenance page
//   if (isMaintenance) {
//     return (
//       <ThemeProvider>
//         <GlobalStyles styles={globalStyles} />
//         <Maintenance />
//       </ThemeProvider>
//     );
//   }

//   // Offline page
//   if (!isOnline) {
//     return (
//       <ThemeProvider>
//         <GlobalStyles styles={globalStyles} />
//         <OfflinePage />
//       </ThemeProvider>
//     );
//   }

//   // Main App - Everything wrapped with ThemeProvider at the top level
//   return (
//     <ErrorBoundary
//       FallbackComponent={ErrorFallback}
//       onReset={() => {
//         window.location.href = '/';
//       }}
//     >
//       <ThemeProvider>
//         <GlobalStyles styles={globalStyles} />
//         <BrowserRouter>
//           <AuthProvider>
//             <AppRoutes />
//           </AuthProvider>
//         </BrowserRouter>
//       </ThemeProvider>
//     </ErrorBoundary>
//   );
// }

// App Routes Component - This uses useAuth so it MUST be inside AuthProvider
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<AuthLoader variant="logo" message="Loading..." />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPageLayout />} >
           <Route index element={<LandingPage />} />
           <Route path="/home" element={<LandingPage />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} /> */}
        </Route>


        {/* Auth Routes */}
        <Route
          path="/auth/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/auth/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/verify-otp" element={<VerifyOTP />} />

        {/* Campaign Routes */}
        {/* <Route path="/campaigns" element={<CampaignList />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
        <Route path="/campaigns/:id/donate" element={<DonationPage />} />
        <Route path="/charity/:id" element={<CharityProfile />} /> */}

        {/* Protected Routes - Require Authentication */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<NotificationPreferences />} />
          <Route path="/donations" element={<DonationHistory />} />
          <Route path="/donations/:id/receipt" element={<DonationReceipt />} />
        </Route> */}

        {/* Donor Routes */}
        {/* <Route element={<DonorRoute />}>
          <Route path="/donor/dashboard" element={<DonorDashboard />} />
        </Route> */}

        {/* Charity Routes */}
        {/* <Route element={<CharityRoute />}>
          <Route path="/charity/dashboard" element={<CharityDashboard />} />
          <Route path="/charity/campaigns/create" element={<CreateCampaign />} />
          <Route path="/charity/campaigns/:id/edit" element={<EditCampaign />} />
          <Route path="/charity/campaigns/manage" element={<CampaignManagement />} />
        </Route> */}


        <Route path="/admin" element={
    <AdminLayout/>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* <Route path="/admin/charities" element={<CharityManagement />} />
          <Route path="/admin/campaigns" element={<CampaignManagement />} /> */}
        </Route>

        {/* Donor Routes */}
      <Route 
        path="/donor/*" 
        element={
          // <ProtectedRoute requiredRoles={['donor']}>
            <DonorRoutes />
          // </ProtectedRoute>
        } 
      />
      
      {/* Charity Routes */}
      <Route 
        path="/charity/*" 
        element={
          <ProtectedRoute requiredRoles={['charity']}>
            <CharityRoutes />
          </ProtectedRoute>
        } 
      />
      
      
      <Route path="*" element={<Navigate to="/" replace />} />

        {/* Error Routes */}
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
        <Route path="/maintenance" element={<Maintenance />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Suspense>
  );
};

// Main App Component
function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await api.get('/maintenance');
        setIsMaintenance(response.data.maintenance || false);
      } catch (error) {
        const maintenanceMode = localStorage.getItem('maintenanceMode') === 'true';
        setIsMaintenance(maintenanceMode);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenance();
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider>
        <PageLoader />
      </ThemeProvider>
    );
  }

  if (isMaintenance) {
    return (
      <ThemeProvider>
        <GlobalStyles styles={globalStyles} />
        <Maintenance />
      </ThemeProvider>
    );
  }

  if (!isOnline) {
    return (
      <ThemeProvider>
        <GlobalStyles styles={globalStyles} />
        <OfflinePage />
      </ThemeProvider>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.href = '/';
      }}
    >
      <ThemeProvider>
        <GlobalStyles styles={globalStyles} />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


// function App() {
//   const [isMaintenance, setIsMaintenance] = useState(false);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [isLoading, setIsLoading] = useState(true);

//   // API base URL
//   const API_BASE_URL = import.meta.env.VITE_REACT_APP__API_URL || 'http://localhost:7000/api';

//   // Create axios instance for maintenance check
//   const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   // Check for maintenance mode
//   useEffect(() => {
//     const checkMaintenance = async () => {
//       try {
//         const response = await api.get('/maintenance');
//         setIsMaintenance(response.data.maintenance || false);
//       } catch (error) {
//         // If API is down, check localStorage or env variable
//         const maintenanceMode = localStorage.getItem('maintenanceMode') === 'true';
//         setIsMaintenance(maintenanceMode);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkMaintenance();
//   }, []);

//   // Online/Offline detection
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // Loading state
//   if (isLoading) {
//     return (
//       <ThemeProvider>
//         <PageLoader />
//       </ThemeProvider>
//     );
//   }

//   // Maintenance page
//   if (isMaintenance) {
//     return (
//       <ThemeProvider>
//         <GlobalStyles styles={globalStyles} />
//         <Maintenance />
//       </ThemeProvider>
//     );
//   }

//   // Offline page
//   if (!isOnline) {
//     return (
//       <ThemeProvider>
//         <GlobalStyles styles={globalStyles} />
//         <OfflinePage />
//       </ThemeProvider>
//     );
//   }

//   // Main App - Everything wrapped with ThemeProvider at the top level
//   return (
//     <ErrorBoundary
//       FallbackComponent={ErrorFallback}
//       onReset={() => {
//         window.location.href = '/';
//       }}
//     >
//       <ThemeProvider>
//         <GlobalStyles styles={globalStyles} />
//         <BrowserRouter>
//           <AuthProvider>
//             <AppRoutes />
//           </AuthProvider>
//         </BrowserRouter>
//       </ThemeProvider>
//     </ErrorBoundary>
//   );
// }
export default App;