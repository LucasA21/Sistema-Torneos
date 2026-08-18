'use client';

// src/app/simulacion/page.tsx
// Página de simulación paso a paso con notificación de Campeón.

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTournamentContext } from '@/app/tournament-context';
import AppLayout from '@/components/layout/AppLayout';
import ChampionDialog from '@/components/simulation/ChampionDialog';
import RoundPanel from '@/components/simulation/RoundPanel';
import SimulationControls from '@/components/simulation/SimulationControls';
import StandingsTable from '@/components/simulation/StandingsTable';
import { getTournamentProgress } from '@/core/engine/tournament';

export default function SimulacionPage() {
  const {
    teams: { teams },
    tournament: { state, isStarted, simulateMatch, simulateRound, simulateAll, reset },
  } = useTournamentContext();

  const [championDialogOpen, setChampionDialogOpen] = useState(false);

  // Cuando el torneo se completa, abrimos automáticamente el modal de coronación
  useEffect(() => {
    if (state?.isComplete) {
      setChampionDialogOpen(true);
    }
  }, [state?.isComplete]);

  if (!isStarted || !state) {
    return (
      <AppLayout>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            gap: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
            ⚽ No hay torneo activo
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
            Para comenzar la simulación, configurá los equipos e iniciá el torneo desde la página de
            Equipos.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/equipos"
            aria-label="ir a la página de equipos para iniciar torneo"
          >
            Ir a Equipos
          </Button>
        </Box>
      </AppLayout>
    );
  }

  const progress = getTournamentProgress(state);
  const championTeam =
    state.isComplete && state.standings.length > 0
      ? teams.find((t) => t.id === state.standings[0].teamId)
      : null;

  return (
    <AppLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }} gutterBottom>
          Simulación Paso a Paso
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {state.config.teams.length} equipos •{' '}
          {state.config.format === 'single' ? 'Liga simple' : 'Ida y vuelta'} • {state.totalRounds}{' '}
          fechas • {state.matches.length} partidos totales
        </Typography>
      </Box>

      {state.isComplete && championTeam && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              onClick={() => setChampionDialogOpen(true)}
            >
              Ver Resumen
            </Button>
          }
        >
          <strong>¡Torneo Finalizado!</strong> El campeón es <strong>{championTeam.name}</strong>{' '}
          con {state.standings[0].points} Pts.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Columna izquierda: controles + tabla de posiciones */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Controles */}
            <Box>
              <SimulationControls
                isComplete={state.isComplete}
                progress={progress}
                currentRound={state.currentRound}
                totalRounds={state.totalRounds}
                onSimulateMatch={simulateMatch}
                onSimulateRound={simulateRound}
                onSimulateAll={simulateAll}
                onReset={reset}
              />
            </Box>

            <Divider />

            {/* Tabla de posiciones */}
            <StandingsTable
              standings={state.standings}
              teams={state.config.teams}
              config={state.config}
            />
          </Box>
        </Grid>

        {/* Columna derecha: partidos */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }} gutterBottom>
            Partidos
          </Typography>

          {state.matches.length === 0 ? (
            <Alert severity="info">No hay partidos generados.</Alert>
          ) : (
            <RoundPanel state={state} teams={teams} />
          )}
        </Grid>
      </Grid>

      {/* Modal de Coronación del Campeón */}
      <ChampionDialog
        open={championDialogOpen}
        standings={state.standings}
        teams={teams}
        config={state.config}
        onClose={() => setChampionDialogOpen(false)}
        onReset={reset}
      />
    </AppLayout>
  );
}
