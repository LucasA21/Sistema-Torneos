'use client';

// src/app/page.tsx
// Dashboard principal con resumen del sistema y accesos rápidos.

import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';

const FEATURE_CARDS = [
  {
    title: 'Gestión de Equipos',
    description:
      'Configurá los equipos de la Liga Argentina con sus ratings de habilidad y factores de localía.',
    href: '/equipos',
    icon: <GroupIcon sx={{ fontSize: 40 }} />,
    color: '#1976D2',
    chip: '10 equipos predefinidos',
  },
  {
    title: 'Simulación Paso a Paso',
    description:
      'Simulá el torneo partido a partido o fecha a fecha y observá la tabla de posiciones en tiempo real.',
    href: '/simulacion',
    icon: <PlayCircleIcon sx={{ fontSize: 40 }} />,
    color: '#00C853',
    chip: 'Simulación en vivo',
  },
  {
    title: 'Simulación Masiva',
    description:
      'Simulá miles de torneos completos para calcular las probabilidades de campeonato, copas y descenso de cada equipo.',
    href: '/montecarlo',
    icon: <BarChartIcon sx={{ fontSize: 40 }} />,
    color: '#F9A825',
    chip: 'Hasta 10.000 simulaciones',
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      {/* Hero */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1 }} gutterBottom>
          Simulador de
          <br />
          <Box component="span" sx={{ color: 'primary.main' }}>
            Liga Deportiva
          </Box>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
          Plataforma de simulación interactiva paso a paso y proyecciones estadísticas para torneos
          deportivos.
        </Typography>
      </Box>

      {/* Cards de features */}
      <Grid container spacing={3}>
        {FEATURE_CARDS.map((card) => (
          <Grid key={card.href} size={{ xs: 12, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderTop: '3px solid',
                borderTopColor: card.color,
              }}
            >
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Box sx={{ color: card.color, mb: 2 }}>{card.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
                <Chip label={card.chip} size="small" sx={{ mb: 2 }} />
              </CardContent>
              <Box sx={{ px: 3, pb: 3 }}>
                <Button
                  variant="contained"
                  component={Link}
                  href={card.href}
                  fullWidth
                  aria-label={`ir a ${card.title}`}
                  sx={{ bgcolor: card.color }}
                >
                  Ir a {card.title}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </AppLayout>
  );
}
