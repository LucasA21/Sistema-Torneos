// src/theme/theme.ts
// Configuración del tema MUI para el Sistema de Torneos Deportivos.
// Paleta deportiva refinada y sobria con soporte completo Dark/Light mode.

import { createTheme } from '@mui/material/styles';

// ---------------------------------------------------------------------------
// Paleta de colores deportiva sobria (sin tonos neón)
// ---------------------------------------------------------------------------

const SPORT_COLORS = {
  // Azules primarios
  primaryDark: '#1D4ED8',
  primaryMain: '#2563EB',
  primaryLight: '#60A5FA',

  // Verdes sobrios (gol, victoria)
  secondaryMain: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#34D399',

  // Zonas de clasificación (tonos mate refinados)
  champion: '#F59E0B', // Dorado cálido
  cup: '#2563EB', // Azul copa sofisticado
  neutral: '#64748B', // Gris pizarra neutro
  relegation: '#EF4444', // Rojo sobrio

  // Backgrounds dark
  darkBg: '#0F172A',
  darkSurface: '#1E293B',
  darkCard: '#1E293B',
  darkBorder: '#334155',
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
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      disabled: '#64748B',
    },
    background: {
      default: SPORT_COLORS.darkBg,
      paper: SPORT_COLORS.darkCard,
    },
    error: {
      main: SPORT_COLORS.relegation,
      light: '#F87171',
    },
    warning: {
      main: '#F59E0B',
    },
    success: {
      main: SPORT_COLORS.secondaryMain,
      light: '#34D399',
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: '#F8FAFC',
          backgroundColor: SPORT_COLORS.darkBg,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: SPORT_COLORS.darkCard,
          color: '#F8FAFC',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: SPORT_COLORS.darkCard,
          color: '#F8FAFC',
          border: `1px solid ${SPORT_COLORS.darkBorder}`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15)',
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
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
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
            color: '#94A3B8',
            borderBottom: `2px solid ${SPORT_COLORS.darkBorder}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': {
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
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
          color: '#F8FAFC',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: SPORT_COLORS.darkSurface,
          color: '#F8FAFC',
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
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      disabled: '#94A3B8',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    error: {
      main: SPORT_COLORS.relegation,
      light: '#DC2626',
    },
    warning: {
      main: '#D97706',
    },
    success: {
      main: SPORT_COLORS.secondaryDark,
      light: '#059669',
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: '#0F172A',
          backgroundColor: '#F8FAFC',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)',
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
            color: '#475569',
            backgroundColor: '#F1F5F9',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          backgroundImage: 'none',
          borderRight: '1px solid #E2E8F0',
          color: '#0F172A',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          borderBottom: '1px solid #E2E8F0',
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
