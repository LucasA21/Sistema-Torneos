'use client';

// src/components/layout/Sidebar.tsx
// Navegación lateral con links a las secciones principales.

// import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Inicio', href: '/', icon: <HomeIcon /> },
  { label: 'Equipos', href: '/equipos', icon: <GroupIcon /> },
  { label: 'Simulación', href: '/simulacion', icon: <PlayCircleIcon /> },
  { label: 'Información', href: '/informacion', icon: <InfoIcon /> },
  // Oculto: { label: 'Simulación Masiva', href: '/montecarlo', icon: <BarChartIcon /> },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function SidebarContent() {
  const pathname = usePathname();

  return (
    <Box>
      <Toolbar />
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          variant="overline"
          sx={{ opacity: 0.5, letterSpacing: '0.15em', fontSize: '0.65rem' }}
        >
          Navegación
        </Typography>
      </Box>

      <List disablePadding>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    '&:hover': { backgroundColor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { sx: { fontWeight: isActive ? 700 : 400 } } }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      aria-label="navegación principal"
    >
      {/* Drawer mobile (temporal) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Drawer desktop (permanente) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
}

export { DRAWER_WIDTH };
