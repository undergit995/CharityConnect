import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { useTheme } from "../../../hooks/useTheme";

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function handleCredentialResponse(response) {
  const idToken = response.credential;
  console.log("Encoded JWT ID token: " + idToken);
}

export function initializeGoogleSignIn() {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    const buttonTarget = document.getElementById("google-btn");
    if (buttonTarget) {
      window.google.accounts.id.renderButton(
        buttonTarget,
        { theme: "outline", size: "large", text: "signin_with" }, 
      );
    }

    window.google.accounts.id.prompt();
  } else {
    console.error("Google Identity Services script not loaded.");
  }
}
const SocialLogin = ({ redirectPath = "/" }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { socialLogin, loading, error } = useAuth();
  const [socialLoading, setSocialLoading] = useState(false);

  // Load Google API script
  const loadGoogleScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("google-script")) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.id = "google-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setSocialLoading(true);
    try {
      await loadGoogleScript();

      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const result = await socialLogin("google", response.credential);
            if (result?.user) {
              navigate(redirectPath);
            }
          } catch (error) {
            console.error("Google login error:", error);
          } finally {
            setSocialLoading(false);
          }
        },
        cancel_on_tap_outside: false,
      });

      
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error("Google login error:", error);
      setSocialLoading(false);
    }
  };

  // Facebook Login
  const handleFacebookLogin = async () => {
    setSocialLoading(true);
    try {
      // Load Facebook SDK
      await loadFacebookSDK();

      window.FB.login(
        async (response) => {
          if (response.authResponse) {
            try {
              const result = await socialLogin(
                "facebook",
                response.authResponse.accessToken,
              );
              if (result?.user) {
                navigate(redirectPath);
              }
            } catch (error) {
              console.error("Facebook login error:", error);
            }
          } else {
            console.log("Facebook login cancelled");
          }
          setSocialLoading(false);
        },
        { scope: "email,public_profile" },
      );
    } catch (error) {
      console.error("Facebook login error:", error);
      setSocialLoading(false);
    }
  };

  // Load Facebook SDK
  const loadFacebookSDK = () => {
    return new Promise((resolve) => {
      if (window.FB) {
        resolve();
        return;
      }

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
        resolve();
      };

      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    });
  };

  // Apple Login
  const handleAppleLogin = async () => {
    setSocialLoading(true);
    try {
      // Apple Sign-In configuration
      const appleConfig = {
        clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
        redirectURI: `${window.location.origin}/auth/callback`,
        scope: "name email",
        responseType: "code id_token",
        responseMode: "form_post",
      };

      // Open Apple login popup
      const appleAuthUrl =
        `https://appleid.apple.com/auth/authorize?` +
        `client_id=${appleConfig.clientId}&` +
        `redirect_uri=${encodeURIComponent(appleConfig.redirectURI)}&` +
        `response_type=${appleConfig.responseType}&` +
        `scope=${appleConfig.scope}&` +
        `response_mode=${appleConfig.responseMode}`;

      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const popup = window.open(
        appleAuthUrl,
        "apple-login",
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      // Listen for message from popup
      const messageHandler = async (event) => {
        if (event.data?.type === "apple-login-success") {
          try {
            const result = await socialLogin("apple", event.data.token);
            if (result?.user) {
              navigate(redirectPath);
            }
          } catch (error) {
            console.error("Apple login error:", error);
          } finally {
            setSocialLoading(false);
            window.removeEventListener("message", messageHandler);
          }
        }
      };

      window.addEventListener("message", messageHandler);

      const checkPopup = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopup);
          setSocialLoading(false);
          window.removeEventListener("message", messageHandler);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(checkPopup);
        window.removeEventListener("message", messageHandler);
        if (popup && !popup.closed) {
          popup.close();
        }
        setSocialLoading(false);
      }, 300000);
    } catch (error) {
      console.error("Apple login error:", error);
      setSocialLoading(false);
    }
  };

  const isAnyLoading = loading || socialLoading;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <div id="google-btn"></div>
      <Button
        fullWidth
        variant="outlined"
        size="large"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        disabled={isAnyLoading}
        sx={{
          mb: 1.5,
          py: 1.5,
          borderRadius: 2,
          borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
          color: isDark ? "#e8e8f0" : "#1a1a2e",
          "&:hover": {
            borderColor: "#ea4335",
            backgroundColor: isDark
              ? "rgba(234,67,53,0.1)"
              : "rgba(234,67,53,0.05)",
          },
          position: "relative",
        }}
      >
        {isAnyLoading && socialLoading ? (
          <CircularProgress size={24} sx={{ position: "absolute" }} />
        ) : (
          "Continue with Google"
        )}
      </Button>
    </Box>
  );
};

export default SocialLogin;
