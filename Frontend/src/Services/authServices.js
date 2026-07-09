import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      timeout: 30000,
    });

    this.isRefreshing = false;
    this.failedQueue = [];

    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // The AuthContext will handle the logout
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  getAccessToken() {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  }

  setTokens(accessToken, refreshToken, rememberMe) {
    if (rememberMe) {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    } else {
      sessionStorage.setItem('accessToken', accessToken);
      if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken);
    }
    this.api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    delete this.api.defaults.headers.common['Authorization'];
  }

  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    const rememberMe = !!localStorage.getItem('refreshToken');
    this.setTokens(accessToken, newRefreshToken, rememberMe);

    return accessToken;
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || `Error: ${error.response.status}`);
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

const authService = new AuthService();

export { authService };

// For components that need direct access to the configured axios instance
export const api = authService.api;