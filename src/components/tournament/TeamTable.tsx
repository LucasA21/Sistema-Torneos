'use client';

// src/components/tournament/TeamTable.tsx
// Tabla de equipos con edición inline de rating y acciones de CRUD.

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { Team } from '@/core/models/types';

interface TeamTableProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  onReset: () => void;
  onRatingChange: (id: string, rating: number) => void;
}

function getRatingColor(rating: number): 'success' | 'warning' | 'error' | 'default' {
  if (rating >= 80) return 'success';
  if (rating >= 65) return 'warning';
  if (rating >= 50) return 'default';
  return 'error';
}

export default function TeamTable({
  teams,
  onEdit,
  onRemove,
  onAdd,
  onReset,
  onRatingChange,
}: TeamTableProps) {
  return (
    <Box>
      {/* Cabecera con acciones */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Equipos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {teams.length} equipos configurados
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Restaurar equipos predeterminados">
            <Button
              variant="outlined"
              startIcon={<RestoreIcon />}
              onClick={onReset}
              size="small"
              aria-label="restaurar equipos predeterminados"
            >
              Resetear
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            aria-label="agregar nuevo equipo"
          >
            Agregar
          </Button>
        </Box>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="tabla de equipos">
          <TableHead>
            <TableRow>
              <TableCell>Equipo</TableCell>
              <TableCell sx={{ minWidth: 80 }}>Sigla</TableCell>
              <TableCell sx={{ minWidth: 200 }}>Rating (habilidad)</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                {/* Nombre con color del equipo */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {team.logo ? (
                      <Box
                        component="img"
                        src={team.logo}
                        alt={team.name}
                        sx={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: team.color,
                          border: '2px solid',
                          borderColor: 'divider',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {team.name}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Sigla */}
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: 'text.secondary',
                    }}
                  >
                    {team.shortName}
                  </Typography>
                </TableCell>

                {/* Slider de rating inline */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 1 }}>
                    <Slider
                      value={team.rating}
                      min={1}
                      max={100}
                      onChange={(_, value) => onRatingChange(team.id, value as number)}
                      aria-label={`rating de ${team.name}`}
                      size="small"
                      sx={{ flexGrow: 1 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, minWidth: 28, textAlign: 'right' }}
                    >
                      {team.rating}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Chip de nivel */}
                <TableCell>
                  <Chip
                    label={
                      team.rating >= 80
                        ? 'Elite'
                        : team.rating >= 65
                          ? 'Alto'
                          : team.rating >= 50
                            ? 'Medio'
                            : 'Bajo'
                    }
                    color={getRatingColor(team.rating)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>

                {/* Acciones */}
                <TableCell align="right">
                  <Tooltip title="Editar equipo">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(team)}
                      aria-label={`editar ${team.name}`}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar equipo">
                    <IconButton
                      size="small"
                      onClick={() => onRemove(team.id)}
                      color="error"
                      aria-label={`eliminar ${team.name}`}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {teams.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    No hay equipos configurados. Agregá al menos 4 equipos para comenzar.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
