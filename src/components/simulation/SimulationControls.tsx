'use client';

// src/components/simulation/SimulationControls.tsx
// Botones de control de la simulación paso a paso.

import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface SimulationControlsProps {
  isComplete: boolean;
  progress: number; // [0, 1]
  currentRound: number;
  totalRounds: number;
  onSimulateMatch: () => void;
  onSimulateRound: () => void;
  onSimulateAll: () => void;
  onReset: () => void;
}

export default function SimulationControls({
  isComplete,
  progress,
  currentRound,
  totalRounds,
  onSimulateMatch,
  onSimulateRound,
  onSimulateAll,
  onReset,
}: SimulationControlsProps) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Progreso del torneo */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Progreso del torneo
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }} color="primary.main">
            Fecha {Math.min(currentRound, totalRounds)} / {totalRounds}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress * 100}
          aria-label="progreso del torneo"
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {Math.round(progress * 100)}% completado
        </Typography>
      </Box>

      {/* Botones de control */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <ButtonGroup variant="contained" aria-label="controles de simulación" disabled={isComplete}>
          <Tooltip title="Simular el próximo partido">
            <span>
              <Button
                startIcon={<PlayArrowIcon />}
                onClick={onSimulateMatch}
                disabled={isComplete}
                aria-label="simular próximo partido"
                id="btn-simulate-match"
              >
                Partido
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Simular todos los partidos de la fecha actual">
            <span>
              <Button
                startIcon={<SkipNextIcon />}
                onClick={onSimulateRound}
                disabled={isComplete}
                aria-label="simular fecha completa"
                id="btn-simulate-round"
              >
                Fecha
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Simular el torneo completo de una vez">
            <span>
              <Button
                startIcon={<FastForwardIcon />}
                onClick={onSimulateAll}
                disabled={isComplete}
                aria-label="simular torneo completo"
                id="btn-simulate-all"
              >
                Todo
              </Button>
            </span>
          </Tooltip>
        </ButtonGroup>

        {/* Botón reiniciar separado */}
        <Tooltip title="Reiniciar el torneo desde cero">
          <Button
            variant="outlined"
            color="error"
            startIcon={<RefreshIcon />}
            onClick={() => setResetDialogOpen(true)}
            aria-label="reiniciar torneo"
            id="btn-reset-tournament"
          >
            Reiniciar
          </Button>
        </Tooltip>
      </Box>

      {isComplete && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'success.main',
            color: 'success.contrastText',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>🏆 ¡Torneo completado!</Typography>
          <Typography variant="body2">Podés reiniciar para simular de nuevo.</Typography>
        </Box>
      )}

      {/* Diálogo de confirmación de reinicio */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        aria-labelledby="reset-dialog-title"
      >
        <DialogTitle id="reset-dialog-title">¿Reiniciar el torneo?</DialogTitle>
        <DialogContent>
          <Typography>Se perderán todos los resultados del torneo actual.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              onReset();
              setResetDialogOpen(false);
            }}
            aria-label="confirmar reinicio del torneo"
          >
            Reiniciar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
