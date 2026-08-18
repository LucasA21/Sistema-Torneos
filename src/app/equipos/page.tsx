'use client';

// src/app/equipos/page.tsx
// Página de gestión de equipos: tabla + formulario de add/edit.

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTournamentContext } from '@/app/tournament-context';
import AppLayout from '@/components/layout/AppLayout';
import TeamFormDialog from '@/components/tournament/TeamFormDialog';
import TeamTable from '@/components/tournament/TeamTable';
import TournamentConfigPanel from '@/components/tournament/TournamentConfig';
import type { Team, TournamentConfig } from '@/core/models/types';

export default function EquiposPage() {
  const {
    teams: { teams, addTeam, updateTeam, removeTeam, resetToDefaults },
    tournament: { startTournament },
  } = useTournamentContext();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTeam(null);
    setDialogOpen(true);
  };

  const handleSave = (team: Team) => {
    if (editingTeam) {
      updateTeam(team.id, team);
      setSnackbar({ open: true, message: `✅ ${team.name} actualizado.` });
    } else {
      addTeam(team);
      setSnackbar({ open: true, message: `✅ ${team.name} agregado al torneo.` });
    }
  };

  const handleRemove = (id: string) => {
    const team = teams.find((t) => t.id === id);
    removeTeam(id);
    setSnackbar({ open: true, message: `🗑 ${team?.name ?? 'Equipo'} eliminado.` });
  };

  const handleStartTournament = (config: TournamentConfig) => {
    startTournament(config);
    router.push('/simulacion');
  };

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }} gutterBottom>
            Equipos del Torneo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configurá los equipos, sus ratings y luego iniciá el torneo desde el panel inferior.
          </Typography>
        </Box>

        {teams.length < 4 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Necesitás al menos 4 equipos para poder iniciar un torneo.
          </Alert>
        )}

        {/* Tabla de equipos */}
        <Box sx={{ mb: 4 }}>
          <TeamTable
            teams={teams}
            onEdit={handleEdit}
            onRemove={handleRemove}
            onAdd={handleAdd}
            onReset={resetToDefaults}
            onRatingChange={(id, rating) => updateTeam(id, { rating })}
          />
        </Box>

        {/* Panel de configuración del torneo */}
        <TournamentConfigPanel teams={teams} onStart={handleStartTournament} />

        {/* Dialog add/edit */}
        <TeamFormDialog
          open={dialogOpen}
          team={editingTeam}
          onSave={handleSave}
          onClose={() => setDialogOpen(false)}
        />

        {/* Snackbar de notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </AppLayout>
  );
}
