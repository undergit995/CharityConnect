import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
   if (!context) {
    return {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      permissions: [],
      login: async () => {},
      register: async () => {},
      logout: () => {},
      forgotPassword: async () => {},
      resetPassword: async () => {},
      changePassword: async () => {},
      verifyEmail: async () => {},
      resendVerificationEmail: async () => {},
      verifyOTP: async () => {},
      sendOTP: async () => {},
      socialLogin: async () => {},
      updateProfile: async () => {},
      hasPermission: () => false,
      hasRole: () => false,
      clearError: () => {},
    };
  }
  
  return context;
};

// Specific hooks for common use cases
export const useUser = () => {
  const { user } = useAuth();
  return user;
};

export const usePermissions = () => {
  const { permissions, hasPermission, hasRole } = useAuth();
  return { permissions, hasPermission, hasRole };
};

export const useAuthLoading = () => {
  const { loading } = useAuth();
  return loading;
};

export const useAuthError = () => {
  const { error, clearError } = useAuth();
  return { error, clearError };
};

export const useAuthLogout = () => {
  const { logout } = useAuth();
  return logout;
};

export const useAuthLogin = () => {
  const { login } = useAuth();
  return login;
};

export const useAuthRegister = () => {
  const { register } = useAuth();
  return register;
};

export const useAuthForgotPassword = () => {
  const { forgotPassword } = useAuth();
  return forgotPassword;
};

export const useAuthResetPassword = () => {
  const { resetPassword } = useAuth();
  return resetPassword;
};

export const useAuthChangePassword = () => {
  const { changePassword } = useAuth();
  return changePassword;
};

export const useAuthVerifyEmail = () => {
  const { verifyEmail } = useAuth();
  return verifyEmail;
};

export const useAuthResendVerification = () => {
  const { resendVerification } = useAuth();
  return resendVerification;
};

export const useAuthSendOTP = () => {
  const { sendOTP } = useAuth();
  return sendOTP;
};

export const useAuthVerifyOTP = () => {
  const { verifyOTP } = useAuth();
  return verifyOTP;
};

export const useAuthSocialLogin = () => {
  const { socialLogin } = useAuth();
  return socialLogin;
};

export const useAuthUserProfile = () => {
  const { getUserProfile } = useAuth();
  return getUserProfile;
};

export const useAuthUpdateProfile = () => {
  const { updateProfile } = useAuth();
  return updateProfile;
};

export const useAuthIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

export const useAuthGetUserFromToken = () => {
  const { getUserFromToken } = useAuth();
  return getUserFromToken;
};

export const useAuthSetTokens = () => {
  const { setTokens } = useAuth();
  return setTokens;
};

export const useAuthClearTokens = () => {
  const { clearTokens } = useAuth();
  return clearTokens;
};

export const useAuthGetAccessToken = () => {
  const { getAccessToken } = useAuth();
  return getAccessToken;
};

export const useAuthGetRefreshToken = () => {
  const { getRefreshToken } = useAuth();
  return getRefreshToken;
};

export const useAuthRefreshToken = () => {
  const { refreshToken } = useAuth();
  return refreshToken;
};
