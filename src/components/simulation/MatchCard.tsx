'use client';

// src/components/simulation/MatchCard.tsx
// Tarjeta visual de un partido con marcador y estado.

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { Match, Team } from '@/core/models/types';

interface MatchCardProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
}

function TeamName({ team, align }: { team: Team; align: 'left' | 'right' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'left' ? 'flex-start' : 'flex-end',
        flex: 1,
        minWidth: 0,
      }}
    >
      {team.logo ? (
        <Box
          component="img"
          src={team.logo}
          alt={team.name}
          sx={{
            width: 36,
            height: 36,
            objectFit: 'contain',
            mb: 0.5,
          }}
        />
      ) : (
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: team.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 0.5,
            border: '2px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#fff', fontSize: '0.65rem', fontWeight: 900 }}
          >
            {team.shortName.slice(0, 3)}
          </Typography>
        </Box>
      )}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          textAlign: align,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}
      >
        {team.name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Rating: {team.rating}
      </Typography>
    </Box>
  );
}

export default function MatchCard({ match, homeTeam, awayTeam }: MatchCardProps) {
  const isPending = match.status === 'pending';
  const result = match.result;

  const homeWon = result && result.homeGoals > result.awayGoals;
  const awayWon = result && result.awayGoals > result.homeGoals;
  const isDraw = result && result.homeGoals === result.awayGoals;

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        overflow: 'visible',
        opacity: isPending ? 0.75 : 1,
        transition: 'all 0.3s ease',
        borderColor: !isPending ? 'primary.dark' : undefined,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Estado del partido */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Chip
            label={isPending ? 'Pendiente' : 'Jugado'}
            size="small"
            color={isPending ? 'default' : 'success'}
            variant={isPending ? 'outlined' : 'filled'}
          />
        </Box>

        {/* Fila principal: equipo local - marcador - visitante */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TeamName team={homeTeam} align="left" />

          {/* Marcador central */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 80,
            }}
          >
            {isPending ? (
              <Typography variant="h5" sx={{ fontWeight: 700, opacity: 0.3 }}>
                vs
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: homeWon ? 'success.main' : isDraw ? 'text.secondary' : 'text.disabled',
                  }}
                >
                  {result?.homeGoals ?? 0}
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 300 }}>
                  -
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: awayWon ? 'success.main' : isDraw ? 'text.secondary' : 'text.disabled',
                  }}
                >
                  {result?.awayGoals ?? 0}
                </Typography>
              </Box>
            )}
            <Typography variant="caption" color="text.secondary">
              Fecha {match.round}
            </Typography>
          </Box>

          <TeamName team={awayTeam} align="right" />
        </Box>
      </CardContent>
    </Card>
  );
}
