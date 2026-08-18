'use client';

// src/components/simulation/StandingsTable.tsx
// Tabla de posiciones con chips de zona de clasificación. MUI v9 compatible.

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
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
import { getPositionZone, type ZoneType } from '@/core/engine/standings';
import type { StandingsEntry, Team, TournamentConfig } from '@/core/models/types';
import { ZONE_COLORS } from '@/theme/theme';

interface StandingsTableProps {
  standings: StandingsEntry[];
  teams: Team[];
  config: TournamentConfig;
}

const ZONE_CONFIG: Record<
  ZoneType,
  { label: string; icon: React.ReactElement; color: string; tooltip: string }
> = {
  champion: {
    label: 'Campeón',
    icon: <EmojiEventsIcon sx={{ fontSize: 14 }} />,
    color: ZONE_COLORS.champion,
    tooltip: 'Campeón del Torneo',
  },
  cup: {
    label: 'Copa',
    icon: <StarIcon sx={{ fontSize: 13 }} />,
    color: ZONE_COLORS.cup,
    tooltip: 'Clasifica a Copa Internacional',
  },
  neutral: {
    label: '',
    icon: <></>,
    color: 'transparent',
    tooltip: '',
  },
  relegation: {
    label: 'Descenso',
    icon: <ArrowDownwardIcon sx={{ fontSize: 13 }} />,
    color: ZONE_COLORS.relegation,
    tooltip: 'Zona de Descenso',
  },
};

export default function StandingsTable({ standings, teams, config }: StandingsTableProps) {
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
        Tabla de Posiciones
      </Typography>

      {/* Leyenda de zonas con íconos nativos sobrios */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          size="small"
          icon={<EmojiEventsIcon sx={{ fontSize: 14, color: 'common.black' }} />}
          label="Campeón"
          sx={{ bgcolor: ZONE_COLORS.champion, color: 'common.black', fontWeight: 700 }}
        />
        <Chip
          size="small"
          icon={<StarIcon sx={{ fontSize: 13, color: 'common.white' }} />}
          label="Copa"
          sx={{ bgcolor: ZONE_COLORS.cup, color: 'common.white', fontWeight: 700 }}
        />
        <Chip size="small" label="Zona media" variant="outlined" />
        <Chip
          size="small"
          icon={<ArrowDownwardIcon sx={{ fontSize: 13, color: 'common.white' }} />}
          label="Descenso"
          sx={{ bgcolor: ZONE_COLORS.relegation, color: 'common.white', fontWeight: 700 }}
        />
      </Box>

      <TableContainer>
        <Table size="small" aria-label="tabla de posiciones del torneo">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 40 }}>#</TableCell>
              <TableCell>Equipo</TableCell>
              <TableCell align="center">PJ</TableCell>
              <TableCell align="center">G</TableCell>
              <TableCell align="center">E</TableCell>
              <TableCell align="center">P</TableCell>
              <TableCell align="center">GF</TableCell>
              <TableCell align="center">GC</TableCell>
              <TableCell align="center">DG</TableCell>
              <TableCell align="center" sx={{ fontWeight: 900 }}>
                Pts
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standings.map((entry) => {
              const team = teamMap.get(entry.teamId);
              const zone = getPositionZone(
                entry.position,
                standings.length,
                config.championsZone,
                config.relegationZone
              );
              const zoneInfo = ZONE_CONFIG[zone];
              const isDarkText = zone === 'champion';
              const chipColor = isDarkText ? 'common.black' : 'common.white';

              return (
                <TableRow
                  key={entry.teamId}
                  sx={{
                    borderLeft: '3px solid',
                    borderColor: zone !== 'neutral' ? zoneInfo.color : 'transparent',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {entry.position}
                    </Typography>
                  </TableCell>

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
                        {team?.name ?? entry.teamId}
                      </Typography>
                      {zone !== 'neutral' && (
                        <Tooltip title={zoneInfo.tooltip}>
                          <Chip
                            icon={zoneInfo.icon}
                            label={zoneInfo.label}
                            size="small"
                            sx={{
                              bgcolor: zoneInfo.color,
                              color: chipColor,
                              fontWeight: 700,
                              height: 20,
                              '& .MuiChip-icon': {
                                color: `${chipColor} !important`,
                                ml: 0.5,
                              },
                              '& .MuiChip-label': { px: 0.8, fontSize: '0.65rem' },
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">{entry.played}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                      {entry.won}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{entry.drawn}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                      {entry.lost}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{entry.goalsFor}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{entry.goalsAgainst}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color:
                          entry.goalDifference > 0
                            ? 'success.main'
                            : entry.goalDifference < 0
                              ? 'error.main'
                              : 'text.secondary',
                      }}
                    >
                      {entry.goalDifference > 0 ? '+' : ''}
                      {entry.goalDifference}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 900,
                        color: entry.position === 1 ? 'warning.main' : 'text.primary',
                      }}
                    >
                      {entry.points}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
