'use client';

// src/app/montecarlo/page.tsx
// Página de simulación masiva con estadísticas y predicciones.

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useState } from 'react';
import { useTournamentContext } from '@/app/tournament-context';
import ChampionshipProbability from '@/components/charts/ChampionshipProbability';
import MonteCarloControls from '@/components/charts/MonteCarloControls';
import PositionDistribution from '@/components/charts/PositionDistribution';
import StatsTable from '@/components/charts/StatsTable';
import AppLayout from '@/components/layout/AppLayout';
import { createTournamentConfig } from '@/core/engine/tournament';
import type { TournamentFormat } from '@/core/models/types';

export default function MonteCarloPage() {
  const {
    teams: { teams },
    monteCarlo: { result, isRunning, progress, run, cancel, reset },
  } = useTournamentContext();
  const [format, _setFormat] = useState<TournamentFormat>('single');

  const canRun = teams.length >= 4;

  const handleRun = async (n: number) => {
    const config = createTournamentConfig(teams, { format });
    await run(config, n);
  };

  return (
    <AppLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }} gutterBottom>
          Simulación Masiva y Predicciones
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
          Simulá miles de torneos completos de manera automática para proyectar las probabilidades
          de campeonato, clasificación a copas y descenso de cada equipo.
        </Typography>
      </Box>

      {!canRun && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <Button component={Link} href="/equipos" color="inherit" size="small">
              Ir a Equipos
            </Button>
          }
        >
          Necesitás al menos 4 equipos configurados para ejecutar la simulación masiva.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Panel izquierdo: controles */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Equipos activos */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Equipos participantes ({teams.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {teams.map((team) => (
                    <Chip
                      key={team.id}
                      avatar={team.logo ? <Avatar src={team.logo} alt={team.name} /> : undefined}
                      label={`${team.name} (${team.rating})`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Controles */}
            <MonteCarloControls
              teamCount={teams.length}
              isRunning={isRunning}
              progress={progress}
              onRun={handleRun}
              onCancel={cancel}
            />

            {result && (
              <Button variant="outlined" onClick={reset} fullWidth>
                Limpiar resultados
              </Button>
            )}
          </Box>
        </Grid>

        {/* Panel derecho: resultados */}
        <Grid size={{ xs: 12, md: 8 }}>
          {!result && !isRunning && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
                textAlign: 'center',
                gap: 2,
                opacity: 0.5,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                📊 Las proyecciones estadísticas aparecerán aquí
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seleccioná la cantidad de torneos a simular y presioná "Simular".
              </Typography>
            </Box>
          )}

          {result && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Resumen de ejecución */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`${result.totalSimulations.toLocaleString('es-AR')} torneos simulados`}
                  color="primary"
                />
                <Chip
                  label={`Tiempo de cómputo: ${(result.executionTimeMs / 1000).toFixed(2)}s`}
                  variant="outlined"
                />
              </Box>

              {/* Gráfico de campeonato */}
              <Card variant="outlined">
                <CardContent>
                  <ChampionshipProbability result={result} teams={teams} />
                </CardContent>
              </Card>

              <Divider />

              {/* Tabla de estadísticas */}
              <Card variant="outlined">
                <CardContent>
                  <StatsTable result={result} teams={teams} />
                </CardContent>
              </Card>

              <Divider />

              {/* Distribución de posiciones */}
              <Card variant="outlined">
                <CardContent>
                  <PositionDistribution result={result} teams={teams} />
                </CardContent>
              </Card>
            </Box>
          )}
        </Grid>
      </Grid>
    </AppLayout>
  );
}
