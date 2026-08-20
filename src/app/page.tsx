'use client';

// src/app/page.tsx
// Dashboard principal con resumen del sistema, estado del torneo y accesos rápidos.

import GroupIcon from '@mui/icons-material/Group';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useTournamentContext } from '@/app/tournament-context';
import InfoBannerCard from '@/components/common/InfoBannerCard';
import AppLayout from '@/components/layout/AppLayout';

const FEATURE_CARDS = [
  {
    title: 'Gestión de Equipos',
    description:
      'Configurá los equipos de la Liga Argentina con sus ratings de habilidad y factores de localía.',
    href: '/equipos',
    icon: <GroupIcon sx={{ fontSize: 40 }} />,
    color: 'primary.main',
    chip: '10 equipos predefinidos',
  },
  {
    title: 'Simulación Paso a Paso',
    description:
      'Simulá el torneo partido a partido o fecha a fecha y observá la tabla de posiciones en tiempo real.',
    href: '/simulacion',
    icon: <PlayCircleIcon sx={{ fontSize: 40 }} />,
    color: 'success.main',
    chip: 'Simulación en vivo',
  },
];

export default function DashboardPage() {
  const {
    teams: { teams },
    tournament: { state, isStarted },
  } = useTournamentContext();

  const championTeam =
    state?.isComplete && state.standings.length > 0
      ? teams.find((t) => t.id === state.standings[0].teamId)
      : null;

  return (
    <AppLayout>
      {/* Hero */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 900, lineHeight: 1.2, color: 'text.primary' }}
          gutterBottom
        >
          Simulador de{' '}
          <Box
            component="span"
            sx={(theme) => ({
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #60A5FA 0%, #38BDF8 100%)'
                  : 'linear-gradient(90deg, #1D4ED8 0%, #2563EB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            })}
          >
            Liga Deportiva
          </Box>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 650 }}>
          Plataforma de simulación interactiva paso a paso y proyecciones estadísticas para torneos
          deportivos.
        </Typography>
      </Box>

      {/* Estado actual del torneo (si hay uno activo o completado) */}
      {isStarted && state && (
        <Box sx={{ mb: 4 }}>
          {state.isComplete && championTeam ? (
            <Alert
              severity="success"
              sx={{ borderRadius: 2 }}
              action={
                <Button
                  component={Link}
                  href="/simulacion"
                  color="inherit"
                  size="small"
                  variant="outlined"
                >
                  Ver Detalles
                </Button>
              }
            >
              <strong>¡Campeón Actual: {championTeam.name}!</strong> Ganó la liga con{' '}
              {state.standings[0].points} Pts ({state.standings[0].won} PG, +
              {state.standings[0].goalDifference} DG).
            </Alert>
          ) : (
            <Alert
              severity="info"
              sx={{ borderRadius: 2 }}
              action={
                <Button
                  component={Link}
                  href="/simulacion"
                  color="inherit"
                  size="small"
                  variant="outlined"
                >
                  Continuar Simulación
                </Button>
              }
            >
              <strong>⚽ Torneo en Curso:</strong> Fecha {state.currentRound} de {state.totalRounds}{' '}
              ({state.matches.filter((m) => m.status === 'completed').length} partidos disputados).
            </Alert>
          )}
        </Box>
      )}

      {/* Cards de features */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {FEATURE_CARDS.map((card) => (
          <Grid key={card.href} size={{ xs: 12, md: 6 }}>
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
                  color={card.color === 'primary.main' ? 'primary' : 'success'}
                >
                  Ir a {card.title}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Explicación del modelo */}
      <InfoBannerCard />
    </AppLayout>
  );
}
