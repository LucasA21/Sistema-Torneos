'use client';

// src/components/charts/StatsTable.tsx
// Tabla resumen de estadísticas de simulación masiva por equipo.

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { MonteCarloResult, Team } from '@/core/models/types';
import { formatProbability, wilsonConfidenceInterval } from '@/core/montecarlo/statistics';
import { ZONE_COLORS } from '@/theme/theme';

interface StatsTableProps {
  result: MonteCarloResult;
  teams: Team[];
}

export default function StatsTable({ result, teams }: StatsTableProps) {
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
        Estadísticas y Proyecciones por Equipo
      </Typography>

      <TableContainer>
        <Table size="small" aria-label="estadísticas de simulación por equipo">
          <TableHead>
            <TableRow>
              <TableCell>Equipo</TableCell>
              <TableCell align="center">% Campeón</TableCell>
              <TableCell align="center">% Copa</TableCell>
              <TableCell align="center">% Descenso</TableCell>
              <TableCell align="center">Pts Esperados</TableCell>
              <TableCell align="center">Posición Esperada</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.teamStats.map((stat) => {
              const team = teamMap.get(stat.teamId);
              const champCI = wilsonConfidenceInterval(
                stat.championProbability,
                result.totalSimulations
              );

              return (
                <TableRow key={stat.teamId}>
                  {/* Nombre con escudo */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {team?.logo ? (
                        <Box
                          component="img"
                          src={team.logo}
                          alt={team.name}
                          sx={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }}
                        />
                      ) : team ? (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: team.color,
                            flexShrink: 0,
                          }}
                        />
                      ) : null}
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {team?.name ?? stat.teamId}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* % Campeón */}
                  <TableCell align="center">
                    <Tooltip
                      title={`Rango estimado: [${formatProbability(champCI.lower)}, ${formatProbability(champCI.upper)}]`}
                    >
                      <Chip
                        label={formatProbability(stat.championProbability)}
                        size="small"
                        sx={{
                          bgcolor: ZONE_COLORS.champion,
                          color: '#000',
                          fontWeight: 900,
                          cursor: 'help',
                        }}
                      />
                    </Tooltip>
                  </TableCell>

                  {/* % Copa */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 600, color: ZONE_COLORS.cup }}>
                      {formatProbability(stat.cupProbability)}
                    </Typography>
                  </TableCell>

                  {/* % Descenso */}
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: stat.relegationProbability > 0.3 ? 'error.main' : 'text.secondary',
                      }}
                    >
                      {formatProbability(stat.relegationProbability)}
                    </Typography>
                  </TableCell>

                  {/* Pts esperados */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {stat.averagePoints.toFixed(1)}
                    </Typography>
                  </TableCell>

                  {/* Posición esperada */}
                  <TableCell align="center">
                    <Typography variant="body2">{stat.averagePosition.toFixed(1)}°</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Basado en {result.totalSimulations.toLocaleString('es-AR')} torneos simulados (tiempo de
        cómputo: {(result.executionTimeMs / 1000).toFixed(2)}s).
      </Typography>
    </Box>
  );
}
