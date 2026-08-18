'use client';

// src/components/tournament/TournamentConfig.tsx
// Panel de configuración para iniciar un torneo con confirmación de reemplazo.

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import type { Team, TournamentConfig, TournamentFormat } from '@/core/models/types';
import { SIMULATION_DEFAULTS } from '@/core/models/types';

interface TournamentConfigProps {
  teams: Team[];
  isStarted?: boolean;
  onStart: (config: TournamentConfig) => void;
}

export default function TournamentConfigPanel({
  teams,
  isStarted = false,
  onStart,
}: TournamentConfigProps) {
  const [format, setFormat] = useState<TournamentFormat>('single');
  const [championsZone, setChampionsZone] = useState(4);
  const [relegationZone, setRelegationZone] = useState(3);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canStart = teams.length >= 4;

  const executeStart = () => {
    const config: TournamentConfig = {
      teams,
      format,
      championsZone: Math.min(championsZone, teams.length - 1),
      relegationZone: Math.min(relegationZone, teams.length - 1),
      noiseSigma: SIMULATION_DEFAULTS.NOISE_SIGMA,
      baseGoals: SIMULATION_DEFAULTS.BASE_GOALS,
      goalScale: SIMULATION_DEFAULTS.GOAL_SCALE,
    };

    onStart(config);
    setConfirmOpen(false);
  };

  const handleStartClick = () => {
    if (!canStart) return;
    if (isStarted) {
      setConfirmOpen(true);
    } else {
      executeStart();
    }
  };

  const totalMatches =
    format === 'single'
      ? (teams.length * (teams.length - 1)) / 2
      : teams.length * (teams.length - 1);

  const totalRounds = format === 'single' ? teams.length - 1 : (teams.length - 1) * 2;

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }} gutterBottom>
          Configurar Torneo
        </Typography>

        {!canStart && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Necesitás al menos 4 equipos para iniciar un torneo.
          </Alert>
        )}

        {/* Formato del torneo */}
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
            Formato
          </FormLabel>
          <RadioGroup
            value={format}
            onChange={(e) => setFormat(e.target.value as TournamentFormat)}
            row
          >
            <FormControlLabel
              value="single"
              control={<Radio />}
              label="Liga simple (ida)"
              aria-label="formato liga simple, solo ida"
            />
            <FormControlLabel
              value="double"
              control={<Radio />}
              label="Liga completa (ida y vuelta)"
              aria-label="formato liga completa, ida y vuelta"
            />
          </RadioGroup>
        </FormControl>

        {/* Zonas de clasificación */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 600 }} gutterBottom>
            Zona Copa (clasificación): <strong>{championsZone}</strong> equipos
          </Typography>
          <Slider
            value={championsZone}
            min={1}
            max={Math.max(1, teams.length - 2)}
            onChange={(_, v) => setChampionsZone(v as number)}
            marks
            valueLabelDisplay="auto"
            aria-label="número de equipos en zona copa"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 600 }} gutterBottom>
            Zona Descenso: <strong>{relegationZone}</strong> equipos
          </Typography>
          <Slider
            value={relegationZone}
            min={1}
            max={Math.max(1, teams.length - 2)}
            onChange={(_, v) => setRelegationZone(v as number)}
            marks
            valueLabelDisplay="auto"
            aria-label="número de equipos en zona de descenso"
          />
        </Box>

        {/* Resumen */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'action.hover',
            mb: 3,
            display: 'flex',
            gap: 4,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Equipos
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{teams.length}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total fechas
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{totalRounds}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total partidos
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{totalMatches}</Typography>
          </Box>
        </Box>

        {/* Botón iniciar */}
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={handleStartClick}
          disabled={!canStart}
          fullWidth
          aria-label="iniciar simulación del torneo"
          sx={{ py: 1.5 }}
          color={isStarted ? 'warning' : 'primary'}
        >
          {isStarted ? 'Iniciar Nuevo Torneo (Reiniciar)' : 'Iniciar Torneo'}
        </Button>
      </CardContent>

      {/* Diálogo de confirmación cuando ya hay un torneo iniciado */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>⚠️ ¿Reemplazar torneo en curso?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Actualmente tenés una simulación iniciada. Si continuás, el progreso actual del torneo
            se descartará y se generará un nuevo fixture desde cero.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="warning" onClick={executeStart}>
            Sí, Iniciar Nuevo
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
