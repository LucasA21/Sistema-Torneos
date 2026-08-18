'use client';

// src/components/charts/ChampionshipProbability.tsx
// Gráfico de barras horizontales con probabilidad de campeonato por equipo.

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonteCarloResult, Team } from '@/core/models/types';

interface ChampionshipProbabilityProps {
  result: MonteCarloResult;
  teams: Team[];
}

export default function ChampionshipProbability({ result, teams }: ChampionshipProbabilityProps) {
  const theme = useTheme();
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  const data = result.teamStats
    .map((stat) => ({
      name: teamMap.get(stat.teamId)?.shortName ?? stat.teamId,
      fullName: teamMap.get(stat.teamId)?.name ?? stat.teamId,
      probability: Math.round(stat.championProbability * 1000) / 10,
      color: teamMap.get(stat.teamId)?.color ?? theme.palette.primary.main,
    }))
    .sort((a, b) => b.probability - a.probability);

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
          {d.fullName}
        </Typography>
        <Typography variant="body2" color="warning.main">
          Probabilidad de Campeonato: {d.probability}%
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
        🏆 Probabilidad de Campeonato
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Frecuencia relativa de cada equipo siendo campeón en{' '}
        {result.totalSimulations.toLocaleString('es-AR')} torneos simulados.
      </Typography>

      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 45)}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 60, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.divider} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: theme.palette.text.primary, fontSize: 12, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="probability" radius={[0, 6, 6, 0]} maxBarSize={32}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
            <LabelList
              dataKey="probability"
              position="right"
              formatter={(v) => `${v as number}%`}
              style={{
                fill: theme.palette.text.primary,
                fontSize: 12,
                fontWeight: 700,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
