import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import AuthLoader from '../commonComponents/AuthLoader';
import { authService, api } from '../Services/authServices';

// Create Auth Context
export const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn('⚠️ useAuth used outside of AuthProvider - returning fallback');
    return {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      permissions: [],
      login: async () => ({ success: false, error: 'Auth not available' }),
      logout: () => {},
    };
  }
  return context;
};

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
          
          if (decoded.exp * 1000 > Date.now()) {
            setUser(decoded);
            setIsAuthenticated(true);
            setPermissions(decoded.permissions || []);
            
            startSessionTimeout(decoded.exp * 1000);
          } else {
            try {
              const newAccessToken = await authService.refreshToken();
              const newDecoded = jwtDecode(newAccessToken);
              setUser(newDecoded);
              setIsAuthenticated(true);
              setPermissions(newDecoded.permissions || []);
              startSessionTimeout(newDecoded.exp * 1000);
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
                logout();
              }
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        logout();
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 50);
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
        window.dispatchEvent(new CustomEvent('session-warning'));
      }, warningTime);
      
      setSessionTimeout(timeout);
    }
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      return await authService.refreshToken();
    } catch (err) {
      console.error('Token refresh failed:', err);
      await logout();
      throw err;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      authService.clearTokens();
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
      const response = await authService.api.post('/auth/login', {
        email,
        password,
        rememberMe,
      });

      const payload = response.data.data || response.data; 
      const { accessToken, refreshToken, user, permissions = [] } = payload;
      authService.setTokens(accessToken, refreshToken, rememberMe);

      setUser(user);
      setIsAuthenticated(true);
      setPermissions(permissions || []);
      
      
      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          if (decoded && decoded.exp) {
            startSessionTimeout(decoded.exp * 1000);
          }
        } catch (jwtError) {
          console.warn("⚠️ jwtDecode failed or startSessionTimeout missing, bypassing timeout hook:", jwtError);
        }
      }

      return { user, permissions };

    } catch (err) {
      console.error("Real internal error inside AuthContext try block:", err);
      
      const errorMessage = err.response?.data?.message || err.message || 'Login failed.';
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
      const response = await authService.api.post('/auth/register', userData);
      
      // Auto-login after registration (if configured)
      if (response.data.autoLogin) {
        const { accessToken, refreshToken, user, permissions } = response.data;
        authService.setTokens(accessToken, refreshToken, true);
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
      await authService.api.post('/auth/forgot-password', { email });
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
      await authService.api.post('/auth/reset-password', { token, newPassword });
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
      await authService.api.post('/auth/change-password', {
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
      const response = await authService.api.post('/auth/verify', { token });
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
      await authService.api.post('/auth/resend-verification', { email });
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
  const verifyOTP = async (identifier, otp, purpose = 'verification') => {
    try {
      const response = await authService.api.post('/otp/verify', {
        identifier,
        otp,
        purpose,
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'OTP verification failed';
      throw new Error(errorMessage);
    }
  };

  // Send OTP
  const sendOTP = async (identifier, purpose = 'verification') => {
    try {
      const response = await authService.api.post('/otp/send-email', {
        email: identifier,
        purpose,
      });
      return {
        success: true,
        message: 'OTP sent successfully',
        ...response.data,
      };
    } catch (err) {
      console.log(err.response);      
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      throw new Error(errorMessage);
    }
  };

  // Social login
  const socialLogin = async (provider, token) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.api.post('/auth/social-login', {
        provider,
        token,
      });

      const { accessToken, refreshToken, user, permissions } = response.data;
      authService.setTokens(accessToken, refreshToken, true);
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
      const response = await authService.api.put('/users/profile', profileData);
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