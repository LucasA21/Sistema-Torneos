'use client';

// src/app/providers.tsx
// Providers globales: MUI ThemeProvider + Dark/Light mode toggle.

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { darkTheme, lightTheme } from '@/theme/theme';
import NextAppDirEmotionCacheProvider from './emotion-cache';
import { TournamentProvider } from './tournament-context';

// ---------------------------------------------------------------------------
// Context para el toggle de modo
// ---------------------------------------------------------------------------

interface ThemeToggleContextValue {
  mode: 'dark' | 'light';
  toggleMode: () => void;
}

const ThemeToggleContext = createContext<ThemeToggleContextValue>({
  mode: 'dark',
  toggleMode: () => {},
});

export function useThemeToggle(): ThemeToggleContextValue {
  return useContext(ThemeToggleContext);
}

// ---------------------------------------------------------------------------
// Provider principal
// ---------------------------------------------------------------------------

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const contextValue = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeToggleContext.Provider value={contextValue}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TournamentProvider>{children}</TournamentProvider>
        </ThemeProvider>
      </ThemeToggleContext.Provider>
    </NextAppDirEmotionCacheProvider>
  );
}
