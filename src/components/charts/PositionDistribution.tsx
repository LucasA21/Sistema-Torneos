'use client';

// src/components/charts/PositionDistribution.tsx
// Gráfico de distribución de posiciones finales por equipo (stacked bar).

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonteCarloResult, Team } from '@/core/models/types';

interface PositionDistributionProps {
  result: MonteCarloResult;
  teams: Team[];
}

export default function PositionDistribution({ result, teams }: PositionDistributionProps) {
  const theme = useTheme();
  const teamMap = new Map(teams.map((t) => [t.id, t]));
  const [selectedTeamId, setSelectedTeamId] = useState(result.teamStats[0]?.teamId ?? '');

  const selectedStat = result.teamStats.find((s) => s.teamId === selectedTeamId);
  const selectedTeam = teamMap.get(selectedTeamId);

  const data = selectedStat
    ? Object.entries(selectedStat.positionDistribution)
        .map(([pos, freq]) => ({
          position: `${pos}°`,
          posNum: Number(pos),
          frequency: Math.round(freq * 1000) / 10,
        }))
        .sort((a, b) => a.posNum - b.posNum)
    : [];

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: (typeof data)[0] }[];
  }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          p: 1.5,
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Posición {d.posNum}
        </Typography>
        <Typography variant="body2" color="primary.main">
          {d.frequency}% de los torneos
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Distribución de Posiciones
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            aria-label="seleccionar equipo para ver distribución"
          >
            {result.teamStats.map((stat) => {
              const team = teamMap.get(stat.teamId);
              return (
                <MenuItem key={stat.teamId} value={stat.teamId}>
                  {team?.name ?? stat.teamId}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>

      {selectedTeam && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Frecuencia con que <strong>{selectedTeam.name}</strong> termina en cada posición.
        </Typography>
      )}

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="position"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="frequency" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry) => (
              <Cell
                key={entry.position}
                fill={selectedTeam?.color ?? theme.palette.primary.main}
                opacity={0.3 + (entry.frequency / 100) * 0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
