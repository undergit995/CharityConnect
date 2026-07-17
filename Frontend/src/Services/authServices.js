import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      timeout: 50000,
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

    
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return this.api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    this.isRefreshing = true;

    try {
      const newAccessToken = await this.refreshToken();

      this.processFailedQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return this.api(originalRequest);
    } catch (refreshError) {
      this.processFailedQueue(refreshError);

      this.clearTokens();

      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
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
  
  processFailedQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  async refreshToken() {
    const refreshToken = this.getRefreshToken();

if (!refreshToken) {
    this.clearTokens();
    return Promise.reject(new Error("No refresh token"));
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

export const api = authService.api;