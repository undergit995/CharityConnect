import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';

// Create and export axios instance with interceptors
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Flag to prevent multiple token refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    // Skip adding token for auth endpoints if needed
    const skipAuthPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
    const shouldSkip = skipAuthPaths.some(path => config.url?.includes(path));
    
    if (!shouldSkip) {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't attempt refresh for login/register endpoints
    const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh-token'];
    if (authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If already refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }).catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh token endpoint
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      // Update stored token
      if (localStorage.getItem('refreshToken')) {
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
      } else {
        sessionStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) sessionStorage.setItem('refreshToken', newRefreshToken);
      }

      // Update axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Process queued requests
      processQueue(null, accessToken);
      
      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);

    } catch (refreshError) {
      // Refresh failed - process queue with error
      processQueue(refreshError, null);
      
      // Logout user
      logout();
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// class AuthService {
//   constructor() {
//     this.api = axios.create({
//       baseURL: process.env.REACT_APP_API_URL || 'http://localhost:7000/api',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     // Request interceptor
//     this.api.interceptors.request.use(
//       (config) => {
//         const token = this.getAccessToken();
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Response interceptor
//     this.api.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;
        
//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;
//           try {
//             const newToken = await this.refreshToken();
//             originalRequest.headers.Authorization = `Bearer ${newToken}`;
//             return this.api(originalRequest);
//           } catch (refreshError) {
//             this.logout();
//             return Promise.reject(refreshError);
//           }
//         }
//         return Promise.reject(error);
//       }
//     );
//   }

//   // Token management
//   getAccessToken() {
//     return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
//   }

//   getRefreshToken() {
//     return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
//   }

//   setTokens(accessToken, refreshToken, rememberMe) {
//     if (rememberMe) {
//       localStorage.setItem('accessToken', accessToken);
//       localStorage.setItem('refreshToken', refreshToken);
//     } else {
//       sessionStorage.setItem('accessToken', accessToken);
//       sessionStorage.setItem('refreshToken', refreshToken);
//     }
//   }

//   clearTokens() {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     sessionStorage.removeItem('accessToken');
//     sessionStorage.removeItem('refreshToken');
//   }

//   // Auth methods
//   async login(email, password, rememberMe) {
//     try {
//       const response = await this.api.post('/auth/login', {
//         email,
//         password,
//         rememberMe,
//       });
      
//       const { accessToken, refreshToken, user, permissions } = response.data;
//       this.setTokens(accessToken, refreshToken, rememberMe);
      
//       return { user, permissions };
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async register(userData) {
//     try {
//       const response = await this.api.post('/auth/register', userData);
      
//       if (response.data.autoLogin) {
//         const { accessToken, refreshToken, user, permissions } = response.data;
//         this.setTokens(accessToken, refreshToken, true);
//         return { user, permissions };
//       }
      
//       return response.data;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async logout() {
//     try {
//       const refreshToken = this.getRefreshToken();
//       if (refreshToken) {
//         await this.api.post('/auth/logout', { refreshToken });
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       this.clearTokens();
//     }
//   }

//   async refreshToken() {
//     try {
//       const refreshToken = this.getRefreshToken();
//       if (!refreshToken) {
//         throw new Error('No refresh token');
//       }

//       const response = await this.api.post('/auth/refresh-token', { refreshToken });
//       const { accessToken } = response.data;
      
//       if (localStorage.getItem('refreshToken')) {
//         localStorage.setItem('accessToken', accessToken);
//       } else {
//         sessionStorage.setItem('accessToken', accessToken);
//       }
      
//       return accessToken;
//     } catch (error) {
//       this.clearTokens();
//       throw this.handleError(error);
//     }
//   }

//   async forgotPassword(email) {
//     try {
//       await this.api.post('/auth/forgot-password', { email });
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async resetPassword(token, newPassword) {
//     try {
//       await this.api.post('/auth/reset-password', { token, newPassword });
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async changePassword(currentPassword, newPassword) {
//     try {
//       await this.api.post('/auth/change-password', {
//         currentPassword,
//         newPassword,
//       });
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async verifyEmail(token) {
//     try {
//       await this.api.post('/auth/verify-email', { token });
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async resendVerification(email) {
//     try {
//       await this.api.post('/auth/resend-verification', { email });
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async sendOTP(phone) {
//     try {
//       await this.api.post('/auth/send-otp', { phone });
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async verifyOTP(phone, otp) {
//     try {
//       const response = await this.api.post('/auth/verify-otp', { phone, otp });
//       return response.data;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async socialLogin(provider, token) {
//     try {
//       const response = await this.api.post('/auth/social-login', {
//         provider,
//         token,
//       });
      
//       const { accessToken, refreshToken, user, permissions } = response.data;
//       this.setTokens(accessToken, refreshToken, true);
      
//       return { user, permissions };
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async getUserProfile() {
//     try {
//       const response = await this.api.get('/users/profile');
//       return response.data.user;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async updateProfile(profileData) {
//     try {
//       const response = await this.api.put('/users/profile', profileData);
//       return response.data.user;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   // Error handler
//   handleError(error) {
//     if (error.response) {
//       const { data, status } = error.response;
//       return new Error(data.message || `Error ${status}: ${data.error}`);
//     } else if (error.request) {
//       return new Error('No response from server. Please check your connection.');
//     } else {
//       return new Error(error.message || 'An unexpected error occurred');
//     }
//   }

//   // Utility methods
//   isAuthenticated() {
//     const token = this.getAccessToken();
//     if (!token) return false;
    
//     try {
//       const decoded = jwtDecode(token);
//       return decoded.exp * 1000 > Date.now();
//     } catch {
//       return false;
//     }
//   }

//   getUserFromToken() {
//     const token = this.getAccessToken();
//     if (!token) return null;
    
//     try {
//       const decoded = jwtDecode(token);
//       return decoded;
//     } catch {
//       return null;
//     }
//   }
// }

// export default new AuthService();