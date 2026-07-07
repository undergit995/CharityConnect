import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AuthLoader from '../commonComponents/AuthLoader';
import { api } from '../Services/authServices';

// Create Auth Context
export const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API base URL - FIXED: Defined here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // State variables
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        
        if (token) {
          const decoded = jwtDecode(token);
          
          // Check if token is expired
          if (decoded.exp * 1000 > Date.now()) {
            setUser(decoded);
            setIsAuthenticated(true);
            setPermissions(decoded.permissions || []);
            
            // Start session timeout warning
            startSessionTimeout(decoded.exp * 1000);
          } else {
            // Try to refresh token
            try {
              await refreshAccessToken();
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              logout();
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Session timeout management
  const startSessionTimeout = (expiryTime) => {
    if (sessionTimeout) clearTimeout(sessionTimeout);
    
    const timeUntilExpiry = expiryTime - Date.now();
    const warningTime = timeUntilExpiry - 5 * 60 * 1000; // 5 minutes before expiry
    
    if (warningTime > 0) {
      const timeout = setTimeout(() => {
        // Show session expiry warning
        window.dispatchEvent(new CustomEvent('session-warning'));
      }, warningTime);
      
      setSessionTimeout(timeout);
    }
  };

  // Refresh access token
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Use axios directly to avoid interceptor loop
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
      const { accessToken } = response.data;

      // Update stored token
      if (localStorage.getItem('refreshToken')) {
        localStorage.setItem('accessToken', accessToken);
      } else {
        sessionStorage.setItem('accessToken', accessToken);
      }

      // Update axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      return accessToken;
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
      throw err;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      
      // Clear axios headers
      delete api.defaults.headers.common['Authorization'];
      
      setUser(null);
      setIsAuthenticated(false);
      setPermissions([]);
      setError(null);
      
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
        setSessionTimeout(null);
      }

      // Redirect to login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/login';
      }
    }
  }, [sessionTimeout]);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        rememberMe,
      });

      const { accessToken, refreshToken, user, permissions } = response.data;

      // Store tokens
      if (rememberMe) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
      }

      // Set user state
      setUser(user);
      setIsAuthenticated(true);
      setPermissions(permissions || []);
      
      // Start session timeout
      const decoded = jwtDecode(accessToken);
      startSessionTimeout(decoded.exp * 1000);

      return { user, permissions };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', userData);
      
      // Auto-login after registration (if configured)
      if (response.data.autoLogin) {
        const { accessToken, refreshToken, user, permissions } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        setUser(user);
        setIsAuthenticated(true);
        setPermissions(permissions || []);
        
        const decoded = jwtDecode(accessToken);
        startSessionTimeout(decoded.exp * 1000);
      }

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/forgot-password', { email });
      return { success: true, message: 'Password reset email sent' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/reset-password', { token, newPassword });
      return { success: true, message: 'Password reset successfully' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return { success: true, message: 'Password changed successfully' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/verify-email', { token });
      if (user) {
        setUser({ ...user, emailVerified: true });
      }
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Email verification failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email) => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/resend-verification', { email });
      return { success: true, message: 'Verification email sent' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resend verification';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (phone, otp) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'OTP verification failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const sendOTP = async (phone) => {
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/send-otp', { phone });
      return { success: true, message: 'OTP sent successfully' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Social login
  const socialLogin = async (provider, token) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/social-login', {
        provider,
        token,
      });

      const { accessToken, refreshToken, user, permissions } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUser(user);
      setIsAuthenticated(true);
      setPermissions(permissions || []);

      const decoded = jwtDecode(accessToken);
      startSessionTimeout(decoded.exp * 1000);

      return { user, permissions };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Social login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put('/users/profile', profileData);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check permissions
  const hasPermission = useCallback((permission) => {
    if (!permissions.length) return false;
    return permissions.includes(permission) || permissions.includes('*');
  }, [permissions]);

  // Check role
  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auth context value
  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    permissions,
    
    // Authentication methods
    login,
    register,
    logout,
    refreshAccessToken,
    
    // Password management
    forgotPassword,
    resetPassword,
    changePassword,
    
    // Email verification
    verifyEmail,
    resendVerificationEmail,
    
    // OTP methods
    verifyOTP,
    sendOTP,
    
    // Social login
    socialLogin,
    
    // User management
    updateProfile,
    
    // Permission helpers
    hasPermission,
    hasRole,
    
    // Utility
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <AuthLoader />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;