// import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
// import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { createTheme } from '@mui/material/styles';

// // Create Theme Context
// export const ThemeContext = createContext(null);

// // Custom hook for theme
// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within ThemeProvider');
//   }
//   return context;
// };

// // Light Theme Configuration
// const lightThemeConfig = {
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#667eea',
//       light: '#8296e8',
//       dark: '#4a5fc7',
//       contrastText: '#ffffff',
//     },
//     secondary: {
//       main: '#764ba2',
//       light: '#9463c4',
//       dark: '#5a3a7d',
//       contrastText: '#ffffff',
//     },
//     background: {
//       default: '#f8f9fa',
//       paper: '#ffffff',
//     },
//     text: {
//       primary: '#1a1a2e',
//       secondary: '#4a4a6a',
//       disabled: '#9a9ab0',
//     },
//     success: {
//       main: '#2ecc71',
//       light: '#55d98a',
//       dark: '#25a25a',
//     },
//     warning: {
//       main: '#f39c12',
//       light: '#f5b342',
//       dark: '#c87f0a',
//     },
//     error: {
//       main: '#e74c3c',
//       light: '#ec7063',
//       dark: '#c0392b',
//     },
//     info: {
//       main: '#3498db',
//       light: '#5dade2',
//       dark: '#2a7fb8',
//     },
//     divider: 'rgba(0, 0, 0, 0.08)',
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h1: {
//       fontWeight: 700,
//       fontSize: '2.5rem',
//       lineHeight: 1.2,
//     },
//     h2: {
//       fontWeight: 600,
//       fontSize: '2rem',
//       lineHeight: 1.3,
//     },
//     h3: {
//       fontWeight: 600,
//       fontSize: '1.75rem',
//       lineHeight: 1.3,
//     },
//     h4: {
//       fontWeight: 600,
//       fontSize: '1.5rem',
//       lineHeight: 1.4,
//     },
//     h5: {
//       fontWeight: 500,
//       fontSize: '1.25rem',
//       lineHeight: 1.4,
//     },
//     h6: {
//       fontWeight: 500,
//       fontSize: '1rem',
//       lineHeight: 1.5,
//     },
//     body1: {
//       fontSize: '1rem',
//       lineHeight: 1.6,
//     },
//     body2: {
//       fontSize: '0.875rem',
//       lineHeight: 1.6,
//     },
//     button: {
//       textTransform: 'none',
//       fontWeight: 600,
//     },
//   },
//   shape: {
//     borderRadius: 12,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           padding: '8px 24px',
//           fontSize: '0.9375rem',
//           textTransform: 'none',
//         },
//         contained: {
//           boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
//           '&:hover': {
//             boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
//           },
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
//           transition: 'all 0.3s ease-in-out',
//           '&:hover': {
//             boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
//             transform: 'translateY(-2px)',
//           },
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           transition: 'all 0.3s ease-in-out',
//         },
//       },
//     },
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
//           backdropFilter: 'blur(10px)',
//         },
//       },
//     },
//     MuiDrawer: {
//       styleOverrides: {
//         paper: {
//           border: 'none',
//         },
//       },
//     },
//   },
// };

// // Dark Theme Configuration
// const darkThemeConfig = {
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#7b93e8',
//       light: '#9aadf0',
//       dark: '#5a7add',
//       contrastText: '#ffffff',
//     },
//     secondary: {
//       main: '#8b5fc7',
//       light: '#a57fd6',
//       dark: '#6f44a5',
//       contrastText: '#ffffff',
//     },
//     background: {
//       default: '#0a0a12',
//       paper: '#141420',
//     },
//     text: {
//       primary: '#e8e8f0',
//       secondary: '#a0a0b8',
//       disabled: '#6a6a80',
//     },
//     success: {
//       main: '#2ecc71',
//       light: '#55d98a',
//       dark: '#25a25a',
//     },
//     warning: {
//       main: '#f39c12',
//       light: '#f5b342',
//       dark: '#c87f0a',
//     },
//     error: {
//       main: '#e74c3c',
//       light: '#ec7063',
//       dark: '#c0392b',
//     },
//     info: {
//       main: '#3498db',
//       light: '#5dade2',
//       dark: '#2a7fb8',
//     },
//     divider: 'rgba(255, 255, 255, 0.08)',
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h1: {
//       fontWeight: 700,
//       fontSize: '2.5rem',
//       lineHeight: 1.2,
//     },
//     h2: {
//       fontWeight: 600,
//       fontSize: '2rem',
//       lineHeight: 1.3,
//     },
//     h3: {
//       fontWeight: 600,
//       fontSize: '1.75rem',
//       lineHeight: 1.3,
//     },
//     h4: {
//       fontWeight: 600,
//       fontSize: '1.5rem',
//       lineHeight: 1.4,
//     },
//     h5: {
//       fontWeight: 500,
//       fontSize: '1.25rem',
//       lineHeight: 1.4,
//     },
//     h6: {
//       fontWeight: 500,
//       fontSize: '1rem',
//       lineHeight: 1.5,
//     },
//     body1: {
//       fontSize: '1rem',
//       lineHeight: 1.6,
//     },
//     body2: {
//       fontSize: '0.875rem',
//       lineHeight: 1.6,
//     },
//     button: {
//       textTransform: 'none',
//       fontWeight: 600,
//     },
//   },
//   shape: {
//     borderRadius: 12,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           padding: '8px 24px',
//           fontSize: '0.9375rem',
//           textTransform: 'none',
//         },
//         contained: {
//           boxShadow: '0 4px 12px rgba(123, 147, 232, 0.3)',
//           '&:hover': {
//             boxShadow: '0 6px 20px rgba(123, 147, 232, 0.4)',
//           },
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
//           transition: 'all 0.3s ease-in-out',
//           '&:hover': {
//             boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
//             transform: 'translateY(-2px)',
//           },
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           transition: 'all 0.3s ease-in-out',
//         },
//       },
//     },
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
//           backdropFilter: 'blur(10px)',
//         },
//       },
//     },
//     MuiDrawer: {
//       styleOverrides: {
//         paper: {
//           border: 'none',
//         },
//       },
//     },
//   },
// };

// // Create themes with createTheme()
// const lightTheme = createTheme(lightThemeConfig);
// const darkTheme = createTheme(darkThemeConfig);

// // Theme Provider Component
// export const ThemeProvider = ({ children }) => {
//   const [mode, setMode] = useState(() => {
//     try {
//       const savedMode = localStorage.getItem('themeMode');
//       if (savedMode) {
//         return savedMode;
//       }
//       if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//         return 'dark';
//       }
//       return 'light';
//     } catch (error) {
//       //console.error('Error reading theme mode:', error);
//       return 'light';
//     }
//   });

//   // Get the current theme based on mode
//   const getTheme = useCallback(() => {
//     try {
//       return mode === 'dark' ? darkTheme : lightTheme;
//     } catch (error) {
//       //console.error('Error getting theme:', error);
//       return lightTheme; // Fallback to light theme
//     }
//   }, [mode]);

//   const theme = getTheme();

//   // Update theme when mode changes
//   useEffect(() => {
//     try {
//       localStorage.setItem('themeMode', mode);
      
//       const metaThemeColor = document.querySelector('meta[name="theme-color"]');
//       if (metaThemeColor) {
//         metaThemeColor.content = mode === 'dark' ? '#0a0a12' : '#f8f9fa';
//       }
      
//       if (mode === 'dark') {
//         document.documentElement.classList.add('dark-mode');
//       } else {
//         document.documentElement.classList.remove('dark-mode');
//       }
//     } catch (error) {
//       //console.error('Error updating theme:', error);
//     }
//   }, [mode]);

//   // Listen for system theme changes
//   useEffect(() => {
//     try {
//       const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//       const handleChange = (e) => {
//         if (!localStorage.getItem('themeMode')) {
//           setMode(e.matches ? 'dark' : 'light');
//         }
//       };
      
//       mediaQuery.addEventListener('change', handleChange);
//       return () => mediaQuery.removeEventListener('change', handleChange);
//     } catch (error) {
//       //console.error('Error listening to system theme:', error);
//     }
//   }, []);

//   // Toggle theme function
//   const toggleTheme = useCallback(() => {
//     setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
//   }, []);

//   // Set theme function
//   const setThemeMode = useCallback((newMode) => {
//     if (newMode === 'light' || newMode === 'dark' || newMode === 'system') {
//       if (newMode === 'system') {
//         localStorage.removeItem('themeMode');
//         const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//         setMode(prefersDark ? 'dark' : 'light');
//       } else {
//         setMode(newMode);
//       }
//     }
//   }, []);

//   // Theme context value
//   const contextValue = useMemo(() => ({
//     mode,
//     theme,
//     toggleTheme,
//     setThemeMode,
//     isDark: mode === 'dark',
//     isLight: mode === 'light',
//   }), [mode, theme, toggleTheme, setThemeMode]);

//   // Ensure theme exists before rendering
//   if (!theme || typeof theme !== 'object') {
//     //console.error('Theme is undefined or invalid, using fallback');
//     // Return a safe fallback
//     return (
//       <MuiThemeProvider theme={lightTheme}>
//         <CssBaseline />
//         {children}
//       </MuiThemeProvider>
//     );
//   }

//   return (
//     <ThemeContext.Provider value={contextValue}>
//       <MuiThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </MuiThemeProvider>
//     </ThemeContext.Provider>
//   );
// };

// export default ThemeProvider;


import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

// Create Theme Context
export const ThemeContext = createContext(null);

// Custom hook for theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Light Theme Configuration
const lightThemeConfig = {
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8296e8',
      dark: '#4a5fc7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9463c4',
      dark: '#5a3a7d',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#4a4a6a',
      disabled: '#9a9ab0',
    },
    success: {
      main: '#2ecc71',
      light: '#55d98a',
      dark: '#25a25a',
    },
    warning: {
      main: '#f39c12',
      light: '#f5b342',
      dark: '#c87f0a',
    },
    error: {
      main: '#e74c3c',
      light: '#ec7063',
      dark: '#c0392b',
    },
    info: {
      main: '#3498db',
      light: '#5dade2',
      dark: '#2a7fb8',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
};

// Dark Theme Configuration
const darkThemeConfig = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#7b93e8',
      light: '#9aadf0',
      dark: '#5a7add',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5fc7',
      light: '#a57fd6',
      dark: '#6f44a5',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a12',
      paper: '#141420',
    },
    text: {
      primary: '#e8e8f0',
      secondary: '#a0a0b8',
      disabled: '#6a6a80',
    },
    success: {
      main: '#2ecc71',
      light: '#55d98a',
      dark: '#25a25a',
    },
    warning: {
      main: '#f39c12',
      light: '#f5b342',
      dark: '#c87f0a',
    },
    error: {
      main: '#e74c3c',
      light: '#ec7063',
      dark: '#c0392b',
    },
    info: {
      main: '#3498db',
      light: '#5dade2',
      dark: '#2a7fb8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
};

// Create themes with createTheme() - DO THIS ONCE OUTSIDE COMPONENT
const lightTheme = createTheme(lightThemeConfig);
const darkTheme = createTheme(darkThemeConfig);
// Theme Provider Component
export const ThemeProvider = ({ children }) => {

  const [mode, setMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('themeMode');
      if (savedMode) {
        return savedMode;
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch (error) {
      //console.error('Error reading theme mode:', error);
      return 'light';
    }
  });

  // Get the current theme based on mode - using useMemo for performance
  const theme = useMemo(() => {
    const selectedTheme = mode === 'dark' ? darkTheme : lightTheme;
    // Verify theme is valid
    if (!selectedTheme || typeof selectedTheme !== 'object') {
      //console.error('Invalid theme detected! Using light theme as fallback.');
      return lightTheme;
    }
    
    return selectedTheme;
  }, [mode]);

  // Update theme when mode changes
  useEffect(() => {
    try {
      localStorage.setItem('themeMode', mode);
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.content = mode === 'dark' ? '#0a0a12' : '#f8f9fa';
      }
      
      if (mode === 'dark') {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    } catch (error) {
      //console.error('Error updating theme:', error);
    }
  }, [mode]);

  // Listen for system theme changes
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (!localStorage.getItem('themeMode')) {
          setMode(e.matches ? 'dark' : 'light');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (error) {
      //console.error('Error listening to system theme:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  }, []);

  const setThemeMode = useCallback((newMode) => {
    if (newMode === 'light' || newMode === 'dark' || newMode === 'system') {
      if (newMode === 'system') {
        localStorage.removeItem('themeMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setMode(prefersDark ? 'dark' : 'light');
      } else {
        setMode(newMode);
      }
    }
  }, []);

  const contextValue = useMemo(() => ({
    mode,
    theme,
    toggleTheme,
    setThemeMode,
    isDark: mode === 'dark',
    isLight: mode === 'light',
  }), [mode, theme, toggleTheme, setThemeMode]);

  // CRITICAL: Ensure theme exists before rendering
  if (!theme) {
    //console.error('Theme is undefined! Using fallback.');
    return (
      <MuiThemeProvider theme={lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    );
  }

  //console.log('Rendering ThemeProvider with theme:', theme.palette.mode);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;