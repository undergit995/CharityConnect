// // hooks/useAuth.js
// import { useContext } from 'react'; // ← THIS WAS MISSING
// import { AuthContext } from '../context/AuthContext';

// export const useAuth = () => {
//   const context = useContext(AuthContext);
  
//   if (!context) {
//     // Return fallback instead of throwing error
//     //console.warn('useAuth used outside of AuthProvider - returning fallback');
//     return {
//       user: null,
//       loading: false,
//       error: null,
//       isAuthenticated: false,
//       permissions: [],
//       login: async () => ({ success: false, error: 'Auth not available' }),
//       register: async () => ({ success: false, error: 'Auth not available' }),
//       logout: () => {},
//       forgotPassword: async () => ({ success: false, error: 'Auth not available' }),
//       resetPassword: async () => ({ success: false, error: 'Auth not available' }),
//       changePassword: async () => ({ success: false, error: 'Auth not available' }),
//       verifyEmail: async () => ({ success: false, error: 'Auth not available' }),
//       resendVerificationEmail: async () => ({ success: false, error: 'Auth not available' }),
//       verifyOTP: async () => ({ success: false, error: 'Auth not available' }),
//       sendOTP: async () => ({ success: false, error: 'Auth not available' }),
//       socialLogin: async () => ({ success: false, error: 'Auth not available' }),
//       updateProfile: async () => ({ success: false, error: 'Auth not available' }),
//       hasPermission: () => false,
//       hasRole: () => false,
//       clearError: () => {},
//     };
//   }
  
//   return context;
// };

// // Specific hooks for common use cases
// export const useUser = () => {
//   const { user } = useAuth();
//   return user;
// };

// export const usePermissions = () => {
//   const { permissions, hasPermission, hasRole } = useAuth();
//   return { permissions, hasPermission, hasRole };
// };

// export const useAuthLoading = () => {
//   const { loading } = useAuth();
//   return loading;
// };

// export const useAuthError = () => {
//   const { error, clearError } = useAuth();
//   return { error, clearError };
// };

// export const useAuthLogout = () => {
//   const { logout } = useAuth();
//   return logout;
// };

// export const useAuthLogin = () => {
//   const { login } = useAuth();
//   return login;
// };

// export const useAuthRegister = () => {
//   const { register } = useAuth();
//   return register;
// };

// export const useAuthForgotPassword = () => {
//   const { forgotPassword } = useAuth();
//   return forgotPassword;
// };

// export const useAuthResetPassword = () => {
//   const { resetPassword } = useAuth();
//   return resetPassword;
// };

// export const useAuthChangePassword = () => {
//   const { changePassword } = useAuth();
//   return changePassword;
// };

// export const useAuthVerifyEmail = () => {
//   const { verifyEmail } = useAuth();
//   return verifyEmail;
// };

// export const useAuthResendVerification = () => {
//   const { resendVerificationEmail } = useAuth();
//   return resendVerificationEmail;
// };

// export const useAuthSendOTP = () => {
//   const { sendOTP } = useAuth();
//   return sendOTP;
// };

// export const useAuthVerifyOTP = () => {
//   const { verifyOTP } = useAuth();
//   return verifyOTP;
// };

// export const useAuthSocialLogin = () => {
//   const { socialLogin } = useAuth();
//   return socialLogin;
// };

// export const useAuthUpdateProfile = () => {
//   const { updateProfile } = useAuth();
//   return updateProfile;
// };

// export const useAuthIsAuthenticated = () => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated;
// };

// export default useAuth;