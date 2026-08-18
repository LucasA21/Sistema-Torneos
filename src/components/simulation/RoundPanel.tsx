'use client';

// src/components/simulation/RoundPanel.tsx
// Panel que muestra los partidos de la fecha actual/seleccionada.

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type { Team, TournamentState } from '@/core/models/types';
import MatchCard from './MatchCard';

interface RoundPanelProps {
  state: TournamentState;
  teams: Team[];
}

export default function RoundPanel({ state, teams }: RoundPanelProps) {
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  // Mostrar las últimas 2 fechas con resultados + la fecha actual
  const roundsToShow = Array.from(
    new Set(
      state.matches
        .filter((m) => m.round >= Math.max(1, state.currentRound - 1))
        .map((m) => m.round)
    )
  ).sort((a, b) => a - b);

  return (
    <Box>
      {roundsToShow.map((round) => {
        const roundMatches = state.matches.filter((m) => m.round === round);
        const isCurrentRound = round === state.currentRound;
        const isCompleted = roundMatches.every((m) => m.status === 'completed');

        return (
          <Box key={round} sx={{ mb: 3 }}>
            {/* Cabecera de fecha */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Fecha {round}
              </Typography>
              {isCurrentRound && !isCompleted && (
                <Chip label="En curso" color="primary" size="small" />
              )}
              {isCompleted && (
                <Chip label="Completada" color="success" size="small" variant="outlined" />
              )}
            </Box>

            {/* Grid de partidos */}
            <Grid container spacing={1.5}>
              {roundMatches.map((match) => {
                const homeTeam = teamMap.get(match.homeTeamId);
                const awayTeam = teamMap.get(match.awayTeamId);

                if (!homeTeam || !awayTeam) return null;

                return (
                  <Grid key={match.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <MatchCard match={match} homeTeam={homeTeam} awayTeam={awayTeam} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}
