'use client';

// src/components/charts/MonteCarloControls.tsx
// Panel de control para la simulación masiva de torneos.

import CancelIcon from '@mui/icons-material/Cancel';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import type { MonteCarloProgress } from '@/core/models/types';

interface MonteCarloControlsProps {
  teamCount: number;
  isRunning: boolean;
  progress: MonteCarloProgress | null;
  onRun: (n: number) => void;
  onCancel: () => void;
}

const N_MARKS = [
  { value: 100, label: '100' },
  { value: 1000, label: '1K' },
  { value: 5000, label: '5K' },
  { value: 10000, label: '10K' },
];

export default function MonteCarloControls({
  teamCount,
  isRunning,
  progress,
  onRun,
  onCancel,
}: MonteCarloControlsProps) {
  const [n, setN] = useState(1000);

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
          Configuración de Simulación
        </Typography>

        {/* Sección Slider */}
        <Box sx={{ mb: 3, mt: 2 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography sx={{ fontWeight: 600 }}>Cantidad de torneos a simular</Typography>
            <Chip
              label={n.toLocaleString('es-AR')}
              color="primary"
              size="small"
              sx={{ fontWeight: 900 }}
            />
          </Box>

          <Box sx={{ px: 1, mb: 3 }}>
            <Slider
              value={n}
              min={100}
              max={10000}
              step={null}
              marks={N_MARKS}
              onChange={(_, v) => setN(v as number)}
              disabled={isRunning}
              aria-label="número de torneos a simular"
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => v.toLocaleString('es-AR')}
            />
          </Box>
        </Box>

        {/* Progreso */}
        {isRunning && progress && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
              <Typography variant="body2" color="text.secondary">
                Simulando torneos...
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }} color="primary.main">
                {progress.completed.toLocaleString('es-AR')} /{' '}
                {progress.total.toLocaleString('es-AR')}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress.percentage * 100}
              aria-label={`progreso de simulación masiva: ${Math.round(progress.percentage * 100)}%`}
            />
          </Box>
        )}

        {/* Botones */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => onRun(n)}
            disabled={isRunning || teamCount < 4}
            fullWidth
            aria-label={`ejecutar simulación masiva con ${n} iteraciones`}
            id="btn-run-montecarlo"
          >
            {isRunning ? 'Simulando...' : `Simular ${n.toLocaleString('es-AR')} torneos`}
          </Button>

          {isRunning && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={onCancel}
              aria-label="cancelar simulación masiva"
            >
              Cancelar
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
