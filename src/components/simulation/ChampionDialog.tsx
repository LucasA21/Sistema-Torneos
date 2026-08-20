'use client';

// src/components/simulation/ChampionDialog.tsx
// Modal minimalista de coronación del Campeón del Torneo.

import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type { StandingsEntry, Team, TournamentConfig } from '@/core/models/types';
import { ZONE_COLORS } from '@/theme/theme';

interface ChampionDialogProps {
  open: boolean;
  standings: StandingsEntry[];
  teams: Team[];
  config: TournamentConfig;
  onClose: () => void;
  onReset: () => void;
}

export default function ChampionDialog({
  open,
  standings,
  teams,
  config,
  onClose,
  onReset,
}: ChampionDialogProps) {
  if (!open || standings.length === 0) return null;

  const teamMap = new Map(teams.map((t) => [t.id, t]));
  const championEntry = standings[0];
  const championTeam = teamMap.get(championEntry.teamId);

  const runnerUpEntry = standings[1];
  const runnerUpTeam = runnerUpEntry ? teamMap.get(runnerUpEntry.teamId) : null;

  // Equipos descendidos
  const relegatedEntries = standings.slice(standings.length - config.relegationZone);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle component="div" sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 800, color: 'text.primary' }}>
          ¡Torneo Finalizado!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Resumen de la posición final del torneo
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {/* Card minimalista del Campeón perfectamente centrado */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: 'action.hover',
            borderTop: '3px solid',
            borderColor: ZONE_COLORS.champion,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            mb: 2,
          }}
        >
          {championTeam?.logo && (
            <Box
              component="img"
              src={championTeam.logo}
              alt={championTeam.name}
              sx={{ width: 52, height: 52, objectFit: 'contain', mb: 1.5 }}
            />
          )}

          <Chip
            label="CAMPEÓN"
            size="small"
            sx={{
              bgcolor: ZONE_COLORS.champion,
              color: 'common.black',
              fontWeight: 800,
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              mb: 1,
            }}
          />

          <Typography
            variant="h5"
            component="p"
            sx={{ fontWeight: 800, color: 'text.primary', mb: 2 }}
          >
            {championTeam?.name}
          </Typography>

          <Grid container spacing={1} sx={{ width: '100%' }}>
            <Grid size={{ xs: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Pts
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{ fontWeight: 800, color: 'warning.main' }}
              >
                {championEntry.points}
              </Typography>
            </Grid>
            <Grid size={{ xs: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                PG
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{ fontWeight: 700, color: 'success.main' }}
              >
                {championEntry.won}
              </Typography>
            </Grid>
            <Grid size={{ xs: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                G
              </Typography>
              <Typography variant="subtitle1" component="p" sx={{ fontWeight: 700 }}>
                {championEntry.goalsFor}
              </Typography>
            </Grid>
            <Grid size={{ xs: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                DG
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{ fontWeight: 700, color: 'success.main' }}
              >
                +{championEntry.goalDifference}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Subcampeón y descensos */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {runnerUpTeam && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                borderRadius: 1.5,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2">
                Subcampeón: <strong>{runnerUpTeam.name}</strong>
              </Typography>
              <Chip label={`${runnerUpEntry.points} pts`} size="small" variant="outlined" />
            </Box>
          )}

          {relegatedEntries.length > 0 && (
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1.5,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="caption"
                color="error.main"
                sx={{ fontWeight: 700, display: 'block' }}
              >
                Descenso:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {relegatedEntries.map((e) => teamMap.get(e.teamId)?.name ?? e.teamId).join(', ')}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} size="small" variant="outlined">
          Ver Tabla
        </Button>
        <Button
          onClick={() => {
            onReset();
            onClose();
          }}
          size="small"
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
        >
          Reiniciar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
