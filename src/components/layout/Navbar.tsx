'use client';

// src/components/layout/Navbar.tsx
// Barra de navegación superior con logo, título y toggle de tema.

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useThemeToggle } from '@/app/providers';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { mode, toggleMode } = useThemeToggle();

  return (
    <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Botón hamburguesa para mobile */}
        <IconButton
          color="inherit"
          aria-label="abrir menú lateral"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo e ícono */}
        <EmojiEventsIcon sx={{ mr: 1.5, color: 'warning.main', fontSize: 28 }} />

        {/* Título */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Sistema de Torneos
          </Typography>
        </Box>

        {/* Toggle Dark/Light */}
        <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
          <IconButton
            color="inherit"
            onClick={toggleMode}
            aria-label={mode === 'dark' ? 'activar modo claro' : 'activar modo oscuro'}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
