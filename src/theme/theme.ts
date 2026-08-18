// src/theme/theme.ts
// Configuración del tema MUI para el Sistema de Torneos Deportivos.
// Paleta deportiva con soporte Dark/Light mode.

import { createTheme } from '@mui/material/styles';

// ---------------------------------------------------------------------------
// Paleta de colores deportiva
// ---------------------------------------------------------------------------

const SPORT_COLORS = {
  // Azules primarios
  primaryDark: '#1565C0',
  primaryMain: '#1976D2',
  primaryLight: '#42A5F5',

  // Verdes secundarios (gol, victoria)
  secondaryMain: '#00C853',
  secondaryDark: '#00953D',
  secondaryLight: '#69F0AE',

  // Zonas de clasificación
  champion: '#FFD600', // Dorado campeón
  cup: '#29B6F6', // Azul copa
  neutral: '#546E7A', // Gris neutro
  relegation: '#D32F2F', // Rojo descenso

  // Backgrounds dark
  darkBg: '#0A0E1A',
  darkSurface: '#111827',
  darkCard: '#1A2035',
  darkBorder: '#1E2D4A',
} as const;

// ---------------------------------------------------------------------------
// Tema oscuro (default)
// ---------------------------------------------------------------------------

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: SPORT_COLORS.primaryMain,
      dark: SPORT_COLORS.primaryDark,
      light: SPORT_COLORS.primaryLight,
    },
    secondary: {
      main: SPORT_COLORS.secondaryMain,
      dark: SPORT_COLORS.secondaryDark,
      light: SPORT_COLORS.secondaryLight,
    },
    background: {
      default: SPORT_COLORS.darkBg,
      paper: SPORT_COLORS.darkCard,
    },
    error: {
      main: SPORT_COLORS.relegation,
    },
    warning: {
      main: '#F9A825',
    },
    success: {
      main: SPORT_COLORS.secondaryMain,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${SPORT_COLORS.darkBorder}`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 24px rgba(25, 118, 210, 0.15)`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: SPORT_COLORS.primaryLight,
            borderBottom: `2px solid ${SPORT_COLORS.primaryDark}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.06)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: SPORT_COLORS.darkSurface,
          backgroundImage: 'none',
          borderRight: `1px solid ${SPORT_COLORS.darkBorder}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: SPORT_COLORS.darkSurface,
          borderBottom: `1px solid ${SPORT_COLORS.darkBorder}`,
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// Tema claro
// ---------------------------------------------------------------------------

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: SPORT_COLORS.primaryMain,
      dark: SPORT_COLORS.primaryDark,
      light: SPORT_COLORS.primaryLight,
    },
    secondary: {
      main: SPORT_COLORS.secondaryDark,
    },
    background: {
      default: '#F0F4F8',
      paper: '#FFFFFF',
    },
    error: {
      main: SPORT_COLORS.relegation,
    },
    warning: {
      main: '#F57F17',
    },
    success: {
      main: SPORT_COLORS.secondaryDark,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: SPORT_COLORS.primaryDark,
            backgroundColor: '#F0F4F8',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// Colores de zonas (para uso en componentes)
// ---------------------------------------------------------------------------

export const ZONE_COLORS = {
  champion: SPORT_COLORS.champion,
  cup: SPORT_COLORS.cup,
  neutral: SPORT_COLORS.neutral,
  relegation: SPORT_COLORS.relegation,
} as const;
