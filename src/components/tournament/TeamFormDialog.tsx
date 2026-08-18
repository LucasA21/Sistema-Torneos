'use client';

// src/components/tournament/TeamFormDialog.tsx
// Diálogo para agregar o editar un equipo con validación de formulario y selector de escudo.

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import type { Team } from '@/core/models/types';

interface TeamFormDialogProps {
  open: boolean;
  team: Team | null; // null = agregar nuevo
  onSave: (team: Team) => void;
  onClose: () => void;
}

interface FormState {
  name: string;
  shortName: string;
  rating: number;
  color: string;
  logo: string;
  homeAdvantageBonus: number;
}

const AVAILABLE_BADGES = [
  { label: 'Sin escudo (usar solo color)', value: '' },
  { label: 'Boca Juniors', value: '/escudos/boca.png' },
  { label: 'River Plate', value: '/escudos/river.png' },
  { label: 'Racing Club', value: '/escudos/racing.png' },
  { label: 'Independiente', value: '/escudos/independiente.png' },
  { label: 'San Lorenzo', value: '/escudos/sanlorenzo.png' },
  { label: 'Estudiantes LP', value: '/escudos/estudiantes.png' },
  { label: 'Vélez Sársfield', value: '/escudos/velez.png' },
  { label: 'Huracán', value: '/escudos/huracan.png' },
  { label: 'Talleres', value: '/escudos/talleres.png' },
  { label: 'Lanús', value: '/escudos/lanus.png' },
];

const INITIAL_FORM: FormState = {
  name: '',
  shortName: '',
  rating: 70,
  color: '#1976D2',
  logo: '',
  homeAdvantageBonus: 0.05,
};

function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 20);
}

export default function TeamFormDialog({ open, team, onSave, onClose }: TeamFormDialogProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Inicializar form con el equipo a editar
  useEffect(() => {
    if (team) {
      setForm({
        name: team.name,
        shortName: team.shortName,
        rating: team.rating,
        color: team.color,
        logo: team.logo ?? '',
        homeAdvantageBonus: team.homeAdvantageBonus,
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [team]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (form.name.length > 40) {
      newErrors.name = 'Máximo 40 caracteres';
    }

    if (!form.shortName.trim()) {
      newErrors.shortName = 'La sigla es obligatoria';
    } else if (form.shortName.length > 4) {
      newErrors.shortName = 'Máximo 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const saved: Team = {
      id: team?.id ?? generateId(form.name),
      name: form.name.trim(),
      shortName: form.shortName.trim().toUpperCase(),
      rating: form.rating,
      color: form.color,
      logo: form.logo || undefined,
      homeAdvantageBonus: form.homeAdvantageBonus,
    };

    onSave(saved);
    onClose();
  };

  const isEditing = team !== null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="team-form-dialog-title"
      aria-describedby="team-form-dialog-description"
    >
      <DialogTitle id="team-form-dialog-title">
        {isEditing ? `Editar: ${team.name}` : 'Agregar Equipo'}
        <IconButton
          aria-label="cerrar diálogo"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent id="team-form-dialog-description" dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {/* Nombre */}
          <TextField
            label="Nombre del equipo"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            slotProps={{ htmlInput: { maxLength: 40, 'aria-required': 'true' } }}
            autoFocus
          />

          {/* Sigla */}
          <TextField
            label="Sigla (ej: RIV, BOC)"
            value={form.shortName}
            onChange={(e) => setForm((f) => ({ ...f, shortName: e.target.value.toUpperCase() }))}
            error={!!errors.shortName}
            helperText={errors.shortName ?? 'Máximo 4 caracteres'}
            slotProps={{ htmlInput: { maxLength: 4, 'aria-required': 'true' } }}
            sx={{ maxWidth: 200 }}
          />

          {/* Selector de Escudo */}
          <FormControl fullWidth size="small">
            <InputLabel id="badge-select-label">Escudo del equipo</InputLabel>
            <Select
              labelId="badge-select-label"
              value={form.logo}
              label="Escudo del equipo"
              onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
            >
              {AVAILABLE_BADGES.map((b) => (
                <MenuItem key={b.value} value={b.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {b.value ? (
                      <Box
                        component="img"
                        src={b.value}
                        alt={b.label}
                        sx={{ width: 24, height: 24, objectFit: 'contain' }}
                      />
                    ) : (
                      <Box
                        sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: form.color }}
                      />
                    )}
                    <Typography variant="body2">{b.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Rating */}
          <Box>
            <Typography gutterBottom>
              Rating de Habilidad: <strong>{form.rating}</strong> / 100
            </Typography>
            <Slider
              value={form.rating}
              min={1}
              max={100}
              onChange={(_, v) => setForm((f) => ({ ...f, rating: v as number }))}
              marks={[
                { value: 1, label: '1' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 75, label: '75' },
                { value: 100, label: '100' },
              ]}
              aria-label="rating de habilidad del equipo"
              valueLabelDisplay="auto"
            />
          </Box>

          {/* Color del equipo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Color representativo:</Typography>
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              style={{ width: 48, height: 36, borderRadius: 8, cursor: 'pointer', border: 'none' }}
              aria-label="color del equipo"
            />
            <Typography variant="body2" color="text.secondary">
              {form.color.toUpperCase()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} aria-label="cancelar y cerrar">
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} aria-label="guardar equipo">
          {isEditing ? 'Guardar cambios' : 'Agregar equipo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
