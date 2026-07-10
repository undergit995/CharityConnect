import { useContext } from 'react';
import { ThemeContext } from '../Theme/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn('useTheme used outside of ThemeProvider, using default values');
    return {
      mode: 'light',
      isDark: false,
      isLight: true,
      toggleTheme: () => {},
      setThemeMode: () => {},
      theme: null,
    };
  }
  return context;
};

// Additional helper hooks
export const useThemeMode = () => {
  const { mode, isDark, isLight } = useTheme();
  return { mode, isDark, isLight };
};

export const useThemeToggle = () => {
  const { toggleTheme, setThemeMode } = useTheme();
  return { toggleTheme, setThemeMode };
};

export const useThemeStyles = () => {
  const { isDark } = useTheme();

  return {
    bg: {
      default: isDark ? '#0a0a12' : '#f8f9fa',
      paper: isDark ? '#141420' : '#ffffff',
      subtle: isDark ? '#1a1a2e' : '#f1f3f5',
      hover: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    },
    text: {
      primary: isDark ? '#e8e8f0' : '#1a1a2e',
      secondary: isDark ? '#a0a0b8' : '#4a4a6a',
      disabled: isDark ? '#6a6a80' : '#9a9ab0',
    },
    border: {
      default: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      light: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    },
    shadow: {
      default: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.06)',
      hover: isDark ? '0 8px 40px rgba(0,0,0,0.5)' : '0 8px 40px rgba(0,0,0,0.10)',
    },
    glass: {
      background: isDark 
        ? 'rgba(20, 20, 32, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
    },
  };
};

export const useThemeTransition = () => {
  return {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionFast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionSlow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  };
};

export const useThemeAwareStyles = () => {
  const { isDark } = useTheme();
  
  return {
    card: {
      background: isDark ? '#141420' : '#ffffff',
      borderRadius: 16,
      boxShadow: isDark 
        ? '0 4px 20px rgba(0,0,0,0.3)' 
        : '0 4px 20px rgba(0,0,0,0.06)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: isDark 
          ? '0 8px 40px rgba(0,0,0,0.5)' 
          : '0 8px 40px rgba(0,0,0,0.10)',
      },
    },
    button: {
      primary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        border: 'none',
        '&:hover': {
          background: 'linear-gradient(135deg, #5a67d8 0%, #6b4190 100%)',
        },
      },
      secondary: {
        background: 'transparent',
        color: isDark ? '#e8e8f0' : '#1a1a2e',
        border: `2px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
        '&:hover': {
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        },
      },
    },
    input: {
      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      color: isDark ? '#e8e8f0' : '#1a1a2e',
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      },
    },
  };
};