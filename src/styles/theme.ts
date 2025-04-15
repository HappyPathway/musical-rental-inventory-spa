import { createTheme } from '@mui/material/styles';

// ROKNSOUND Color Palette
export const colors = {
  distressedRed: '#C23B23', // Accent lines, buttons, hover effects
  charcoalBlack: '#121212', // Background, headers, hero sections
  offWhite: '#F0E6D2', // Main text, logo text, contrast areas
  vuYellow: '#FFCE54', // Meters, volume peaks, highlights
  mutedGray: '#3A3A3A', // Divider lines, cards, form borders
  success: '#48CFAD', // Success alerts
  info: '#5D9CEC', // Info alerts
  warning: '#FFCE54', // Warning alerts (same as vuYellow)
  danger: '#C23B23', // Error alerts (same as distressedRed)
};

// Create a custom theme using the ROKNSOUND color palette
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.distressedRed,
    },
    secondary: {
      main: colors.vuYellow,
    },
    background: {
      default: colors.charcoalBlack,
      paper: colors.mutedGray,
    },
    text: {
      primary: colors.offWhite,
      secondary: 'rgba(240, 230, 210, 0.7)',
    },
    error: {
      main: colors.danger,
    },
    warning: {
      main: colors.warning,
    },
    info: {
      main: colors.info,
    },
    success: {
      main: colors.success,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.2)',
    '0 4px 8px rgba(0,0,0,0.2)',
    '0 6px 12px rgba(0,0,0,0.2)',
    '0 8px 16px rgba(0,0,0,0.2)',
    '0 10px 20px rgba(0,0,0,0.2)',
    '0 12px 24px rgba(0,0,0,0.2)',
    '0 14px 28px rgba(0,0,0,0.2)',
    '0 16px 32px rgba(0,0,0,0.2)',
    '0 18px 36px rgba(0,0,0,0.2)',
    '0 20px 40px rgba(0,0,0,0.2)',
    '0 22px 44px rgba(0,0,0,0.2)',
    '0 24px 48px rgba(0,0,0,0.2)',
    '0 26px 52px rgba(0,0,0,0.2)',
    '0 28px 56px rgba(0,0,0,0.2)',
    '0 30px 60px rgba(0,0,0,0.2)',
    '0 32px 64px rgba(0,0,0,0.2)',
    '0 34px 68px rgba(0,0,0,0.2)',
    '0 36px 72px rgba(0,0,0,0.2)',
    '0 38px 76px rgba(0,0,0,0.2)',
    '0 40px 80px rgba(0,0,0,0.2)',
    '0 42px 84px rgba(0,0,0,0.2)',
    '0 44px 88px rgba(0,0,0,0.2)',
    '0 46px 92px rgba(0,0,0,0.2)',
    '0 48px 96px rgba(0,0,0,0.2)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.charcoalBlack,
          color: colors.offWhite,
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.mutedGray} ${colors.charcoalBlack}`,
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: colors.charcoalBlack,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.mutedGray,
            borderRadius: 4,
            '&:hover': {
              backgroundColor: colors.distressedRed,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.mutedGray,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        standardSuccess: {
          backgroundColor: 'rgba(72, 207, 173, 0.1)',
          border: `1px solid ${colors.success}`,
          color: colors.success,
        },
        standardInfo: {
          backgroundColor: 'rgba(93, 156, 236, 0.1)',
          border: `1px solid ${colors.info}`,
          color: colors.info,
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 206, 84, 0.1)',
          border: `1px solid ${colors.warning}`,
          color: colors.warning,
        },
        standardError: {
          backgroundColor: 'rgba(194, 59, 35, 0.1)',
          border: `1px solid ${colors.danger}`,
          color: colors.danger,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.mutedGray,
          color: colors.offWhite,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(240, 230, 210, 0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(194, 59, 35, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(194, 59, 35, 0.3)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;