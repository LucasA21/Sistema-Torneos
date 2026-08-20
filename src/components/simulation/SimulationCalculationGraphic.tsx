'use client';

// src/components/simulation/SimulationCalculationGraphic.tsx
// Gráfico interactivo explicativo paso a paso (6 Pasos) del cálculo de goles y simulación.
// Diseño premium totalmente responsivo y adaptado a Modo Claro y Oscuro.

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BarChartIcon from '@mui/icons-material/BarChart';
import CasinoIcon from '@mui/icons-material/Casino';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import React, { useMemo, useState } from 'react';
import type { Team } from '@/core/models/types';
import { DEFAULT_TEAMS } from '@/lib/defaultTeams';

const ALL_EXPLANATION_TEAMS: Team[] = DEFAULT_TEAMS;

// Función para calcular probabilidad de Poisson P(k; lambda)
function poissonProb(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let fact = 1;
  for (let i = 1; i <= k; i++) fact *= i;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / fact;
}

// Generador gaussiano N(0, sigma^2)
function gaussianRandom(sigma: number): number {
  const u1 = Math.max(Math.random(), Number.EPSILON);
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * sigma;
}

export default function SimulationCalculationGraphic() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Selección de equipos (Por defecto Boca Juniors vs River Plate)
  const [homeTeamId, setHomeTeamId] = useState<string>('boca');
  const [awayTeamId, setAwayTeamId] = useState<string>('river');

  // Estado de simulación en vivo (Ruido y Spins de Ruleta)
  const [simulationSeed, setSimulationSeed] = useState({
    homeNoise: 4.2,
    awayNoise: -3.8,
    homeSpin: 0.55,
    awaySpin: 0.21,
  });

  const homeTeam = useMemo(
    () => ALL_EXPLANATION_TEAMS.find((t) => t.id === homeTeamId) || ALL_EXPLANATION_TEAMS[0],
    [homeTeamId]
  );
  const awayTeam = useMemo(
    () => ALL_EXPLANATION_TEAMS.find((t) => t.id === awayTeamId) || ALL_EXPLANATION_TEAMS[1],
    [awayTeamId]
  );

  // Ejecutar una nueva tirada al azar (Simular de nuevo)
  const handleReSimulate = () => {
    setSimulationSeed({
      homeNoise: Number(gaussianRandom(12).toFixed(1)),
      awayNoise: Number(gaussianRandom(12).toFixed(1)),
      homeSpin: Number(Math.random().toFixed(3)),
      awaySpin: Number(Math.random().toFixed(3)),
    });
  };

  // --- CÁLCULOS MATEMÁTICOS DE LOS 6 PASOS ---

  // Paso 1: Ratings y Localía
  const homeBonusPercentage = Math.round(homeTeam.homeAdvantageBonus * 100);
  const homeBonusPoints = Number((homeTeam.rating * homeTeam.homeAdvantageBonus).toFixed(1));
  const homeAdjustedRating = Number((homeTeam.rating + homeBonusPoints).toFixed(1));
  const awayAdjustedRating = awayTeam.rating;

  // Paso 2: Rendimiento en Cancha y Diferencia Delta
  const homePerformance = Number((homeAdjustedRating + simulationSeed.homeNoise).toFixed(1));
  const awayPerformance = Number((awayAdjustedRating + simulationSeed.awayNoise).toFixed(1));
  const delta = Number((homePerformance - awayPerformance).toFixed(1));

  // Paso 3: Esperanza de Goles (lambda)
  const baseGoals = 1.0;
  const goalScale = 0.03;
  const lambdaHome = Number((baseGoals + Math.max(0, delta) * goalScale).toFixed(2));
  const lambdaAway = Number((baseGoals + Math.max(0, -delta) * goalScale).toFixed(2));

  // Paso 4: Distribución de Poisson (0 a 5+ goles)
  const getPoissonDistribution = (lambda: number) => {
    const probs: number[] = [];
    let sum = 0;
    for (let k = 0; k < 5; k++) {
      const p = poissonProb(k, lambda);
      probs.push(p);
      sum += p;
    }
    probs.push(Math.max(0, 1 - sum)); // 5+ goles
    return probs;
  };

  const homePoissonProbs = useMemo(() => getPoissonDistribution(lambdaHome), [lambdaHome]);
  const awayPoissonProbs = useMemo(() => getPoissonDistribution(lambdaAway), [lambdaAway]);

  // Paso 5: Muestreo de la Ruleta (Determinar goles en función del spin)
  const sampleGoalsFromSpin = (probs: number[], spin: number) => {
    let cumulative = 0;
    for (let k = 0; k < probs.length; k++) {
      cumulative += probs[k];
      if (spin <= cumulative || k === probs.length - 1) {
        return k;
      }
    }
    return 0;
  };

  const homeGoals = sampleGoalsFromSpin(homePoissonProbs, simulationSeed.homeSpin);
  const awayGoals = sampleGoalsFromSpin(awayPoissonProbs, simulationSeed.awaySpin);

  // Obtención de intervalos acumulativos exactos para la ruleta
  const getCumulativeRanges = (probs: number[]) => {
    let cum = 0;
    return probs.map((p, k) => {
      const start = cum;
      cum += p;
      const end = k === probs.length - 1 ? 1.0 : Math.min(1.0, cum);
      return {
        k,
        label: k === 5 ? '5+' : `${k} Gol${k !== 1 ? 'es' : ''}`,
        shortLabel: k === 5 ? '5+' : `${k}`,
        start: Number(start.toFixed(3)),
        end: Number(end.toFixed(3)),
        probPct: (p * 100).toFixed(1),
      };
    });
  };

  const homeRanges = useMemo(() => getCumulativeRanges(homePoissonProbs), [homePoissonProbs]);
  const awayRanges = useMemo(() => getCumulativeRanges(awayPoissonProbs), [awayPoissonProbs]);

  const homeActiveRange = useMemo(
    () => homeRanges.find((r) => simulationSeed.homeSpin >= r.start && (simulationSeed.homeSpin < r.end || r.k === 5)) || homeRanges[0],
    [homeRanges, simulationSeed.homeSpin]
  );
  const awayActiveRange = useMemo(
    () => awayRanges.find((r) => simulationSeed.awaySpin >= r.start && (simulationSeed.awaySpin < r.end || r.k === 5)) || awayRanges[0],
    [awayRanges, simulationSeed.awaySpin]
  );

  // Estilos de tarjetas uniformes con glassmorphism
  const cardStyle = {
    p: 2.5,
    borderRadius: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    border: '1px solid',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    bgcolor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.25s ease-in-out',
    '&:hover': {
      borderColor: isDark ? 'rgba(96, 165, 250, 0.4)' : 'rgba(37, 99, 235, 0.3)',
      boxShadow: isDark ? '0 12px 40px rgba(0, 0, 0, 0.5)' : '0 8px 30px rgba(37, 99, 235, 0.12)',
    },
  };

  // Renderizador de Escudo o Iniciales
  const renderTeamAvatar = (team: Team, size = 44) => {
    if (team.logo) {
      return (
        <Box
          component="img"
          src={team.logo}
          alt={team.name}
          sx={{ width: size, height: size, objectFit: 'contain' }}
        />
      );
    }
    return (
      <Avatar
        sx={{
          width: size,
          height: size,
          bgcolor: team.color,
          fontWeight: 800,
          fontSize: size * 0.4,
          color: '#FFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {team.shortName}
      </Avatar>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Barra de Control Superior: Seleccionar Equipos y Botón Simular */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.15)',
          bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(241, 245, 249, 0.8)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Selector de equipos */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Demostración:
          </Typography>
          <Select
            size="small"
            value={homeTeamId}
            onChange={(e) => setHomeTeamId(e.target.value)}
            sx={{ minWidth: 150, borderRadius: 2, fontWeight: 700, bgcolor: 'background.paper' }}
          >
            {ALL_EXPLANATION_TEAMS.filter((t) => t.id !== awayTeamId).map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name} (Local)
              </MenuItem>
            ))}
          </Select>
          <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.secondary' }}>
            vs
          </Typography>
          <Select
            size="small"
            value={awayTeamId}
            onChange={(e) => setAwayTeamId(e.target.value)}
            sx={{ minWidth: 150, borderRadius: 2, fontWeight: 700, bgcolor: 'background.paper' }}
          >
            {ALL_EXPLANATION_TEAMS.filter((t) => t.id !== homeTeamId).map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name} (Visita)
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Botón Volver a Simular */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleReSimulate}
          startIcon={<RefreshIcon />}
          sx={{
            fontWeight: 800,
            borderRadius: 2.5,
            px: 2.5,
            py: 1,
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
          }}
        >
          🎲 Tirar Ruleta / Volver a Simular
        </Button>
      </Paper>

      {/* GRID DE LOS 6 PASOS DEL CÁLCULO */}
      <Grid container spacing={2.5}>
        {/* PASO 1: DATOS INICIALES Y LOCALÍA */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={cardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label="1"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: '#FFF',
                  fontWeight: 900,
                  width: 24,
                  height: 24,
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
                DATOS INICIALES Y LOCALÍA
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                my: 'auto',
                py: 1,
              }}
            >
              {/* Equipo Local */}
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  {renderTeamAvatar(homeTeam, 52)}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                  {homeTeam.name}
                </Typography>
                <Chip
                  label={`Rating: ${homeTeam.rating}`}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 0.5, fontWeight: 700, fontSize: '0.7rem' }}
                />
              </Box>

              {/* Bonus Localía */}
              <Box sx={{ textAlign: 'center', px: 1 }}>
                <Chip
                  icon={<HomeIcon sx={{ fontSize: '14px !important' }} />}
                  label={`+${homeBonusPercentage}%`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 800, fontSize: '0.72rem', mb: 0.5 }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', fontSize: '0.65rem' }}
                >
                  Local Bonus
                </Typography>
              </Box>

              {/* Equipo Visitante */}
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  {renderTeamAvatar(awayTeam, 52)}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                  {awayTeam.name}
                </Typography>
                <Chip
                  label={`Rating: ${awayTeam.rating}`}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 0.5, fontWeight: 700, fontSize: '0.7rem' }}
                />
              </Box>
            </Box>

            {/* Resultado Ajustado Paso 1 */}
            <Box
              sx={{
                mt: 2,
                p: 1.2,
                borderRadius: 2,
                bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.7)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Ajustado por localía: <strong>{homeTeam.shortName}: {homeAdjustedRating}</strong> |{' '}
                <strong>{awayTeam.shortName}: {awayAdjustedRating}</strong>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* PASO 2: DIFERENCIA DE NIVEL Y RUIDO */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={cardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label="2"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: '#FFF',
                  fontWeight: 900,
                  width: 24,
                  height: 24,
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
                DIFERENCIA DE NIVEL (Δ)
              </Typography>
            </Box>

            <Box sx={{ my: 'auto', py: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.75rem', mb: 1.5, textAlign: 'center' }}
              >
                Sumamos el <i>ruido del partido</i> (días inspirados o malos) para obtener la fuerza en cancha:
              </Typography>

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(248, 250, 252, 0.9)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {homeTeam.shortName} (Cancha): {homePerformance}
                  </Typography>
                  <Typography variant="caption" color={simulationSeed.homeNoise >= 0 ? 'success.main' : 'error.main'}>
                    (Ruido: {simulationSeed.homeNoise > 0 ? `+${simulationSeed.homeNoise}` : simulationSeed.homeNoise})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {awayTeam.shortName} (Cancha): {awayPerformance}
                  </Typography>
                  <Typography variant="caption" color={simulationSeed.awayNoise >= 0 ? 'success.main' : 'error.main'}>
                    (Ruido: {simulationSeed.awayNoise > 0 ? `+${simulationSeed.awayNoise}` : simulationSeed.awayNoise})
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Chip
                  label={`(Δ) Diferencia = ${delta > 0 ? `+${delta}` : delta}`}
                  color={delta >= 0 ? 'primary' : 'secondary'}
                  sx={{ fontWeight: 900, fontSize: '0.85rem', px: 1 }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* PASO 3: ESPERANZA DE GOLES (λ) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={cardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label="3"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: '#FFF',
                  fontWeight: 900,
                  width: 24,
                  height: 24,
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
                ESPERANZA DE GOLES (λ)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, my: 'auto' }}>
              {/* Lambda Local */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SportsSoccerIcon color="primary" fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {homeTeam.shortName} λ
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                  1.0 + ({Math.max(0, delta)} * 0.03) = <strong>{lambdaHome}</strong>
                </Typography>
              </Box>

              {/* Lambda Visitante */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(52, 211, 153, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SportsSoccerIcon color="success" fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {awayTeam.shortName} λ
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                  1.0 + ({Math.max(0, -delta)} * 0.03) = <strong>{lambdaAway}</strong>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* PASO 4: DISTRIBUCIÓN DE POISSON */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={cardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label="4"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: '#FFF',
                  fontWeight: 900,
                  width: 24,
                  height: 24,
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
                DISTRIBUCIÓN DE POISSON (PROBABILIDADES)
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ my: 'auto' }}>
              {/* Barras Local */}
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 1, color: isDark ? '#60A5FA' : '#1D4ED8' }}>
                  {homeTeam.shortName} (λ={lambdaHome})
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 110, gap: 0.8, pb: 1, borderBottom: '1px solid divider' }}>
                  {homePoissonProbs.map((p, idx) => {
                    const pct = (p * 100).toFixed(1);
                    return (
                      <Tooltip key={idx} title={`${idx === 5 ? '5+' : idx} goles: ${pct}%`}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                          <Typography variant="caption" sx={{ fontSize: '0.62rem', fontWeight: 700, opacity: 0.85, mb: 0.3 }}>
                            {pct}%
                          </Typography>
                          <Box
                            sx={{
                              width: '100%',
                              height: `${Math.max(8, p * 100 * 2.2)}%`,
                              maxHeight: '85%',
                              bgcolor: 'primary.main',
                              borderRadius: '4px 4px 0 0',
                              opacity: 0.85,
                              transition: 'height 0.3s ease',
                              '&:hover': { opacity: 1 },
                            }}
                          />
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, mt: 0.5 }}>
                            {idx === 5 ? '5+' : idx}
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Grid>

              {/* Barras Visitante */}
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 1, color: isDark ? '#34D399' : '#047857' }}>
                  {awayTeam.shortName} (λ={lambdaAway})
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 110, gap: 0.8, pb: 1, borderBottom: '1px solid divider' }}>
                  {awayPoissonProbs.map((p, idx) => {
                    const pct = (p * 100).toFixed(1);
                    return (
                      <Tooltip key={idx} title={`${idx === 5 ? '5+' : idx} goles: ${pct}%`}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                          <Typography variant="caption" sx={{ fontSize: '0.62rem', fontWeight: 700, opacity: 0.85, mb: 0.3 }}>
                            {pct}%
                          </Typography>
                          <Box
                            sx={{
                              width: '100%',
                              height: `${Math.max(8, p * 100 * 2.2)}%`,
                              maxHeight: '85%',
                              bgcolor: 'success.main',
                              borderRadius: '4px 4px 0 0',
                              opacity: 0.85,
                              transition: 'height 0.3s ease',
                              '&:hover': { opacity: 1 },
                            }}
                          />
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, mt: 0.5 }}>
                            {idx === 5 ? '5+' : idx}
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* PASO 5: MUESTREO ALEATORIO (LA RULETA) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={cardStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip
                label="5"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: '#FFF',
                  fontWeight: 900,
                  width: 24,
                  height: 24,
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
                MUESTREO ALEATORIO (LA RULETA MONTE CARLO)
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              El número al azar (0.0 a 1.0) cae en los segmentos de la ruleta según Poisson para cada equipo:
            </Typography>

            <Box sx={{ my: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* RULETA Y TIRADA LOCAL (AZUL) */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  bgcolor: isDark ? 'rgba(37, 99, 235, 0.12)' : 'rgba(37, 99, 235, 0.04)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(96, 165, 250, 0.35)' : 'rgba(37, 99, 235, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                    {homeTeam.name} (Local): <Box component="span" sx={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontWeight: 900 }}>SPIN {simulationSeed.homeSpin.toFixed(3)} ➔ {homeGoals} Gol{homeGoals !== 1 ? 'es' : ''}</Box>
                  </Typography>
                  <Chip
                    label={`Rango: [${homeActiveRange.start.toFixed(3)} - ${homeActiveRange.end.toFixed(3)}]`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      bgcolor: isDark ? '#2563EB' : '#1D4ED8',
                      color: '#FFFFFF',
                    }}
                  />
                </Box>

                {/* Barra Ruleta Local */}
                <Box sx={{ height: 22, borderRadius: 2, display: 'flex', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                  {homeRanges.map((range, idx) => {
                    const pct = Math.max(3, (range.end - range.start) * 100);
                    const isSelected = range.k === homeGoals;
                    return (
                      <Box
                        key={range.k}
                        sx={{
                          width: `${pct}%`,
                          bgcolor: isSelected
                            ? isDark
                              ? '#3B82F6'
                              : '#2563EB'
                            : isDark
                            ? 'rgba(59, 130, 246, 0.25)'
                            : 'rgba(37, 99, 235, 0.12)',
                          borderRight: idx < homeRanges.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {pct > 7 && (
                          <Typography variant="caption" sx={{ color: '#FFF', fontSize: '0.62rem', fontWeight: 800 }}>
                            {range.shortLabel}G
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                {/* Intervalos bajo la barra Local */}
                <Box sx={{ display: 'flex', mt: 0.8, gap: 0.5 }}>
                  {homeRanges.map((range) => {
                    const isSelected = range.k === homeGoals;
                    return (
                      <Box
                        key={range.k}
                        sx={{
                          flex: 1,
                          p: 0.4,
                          borderRadius: 1.2,
                          bgcolor: isSelected
                            ? isDark
                              ? '#2563EB'
                              : '#1D4ED8'
                            : isDark
                            ? 'rgba(15, 23, 42, 0.6)'
                            : 'rgba(241, 245, 249, 0.8)',
                          border: '1px solid',
                          borderColor: isSelected
                            ? isDark
                              ? '#60A5FA'
                              : '#1D4ED8'
                            : isDark
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.06)',
                          textAlign: 'center',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontSize: '0.6rem',
                            fontWeight: isSelected ? 900 : 700,
                            color: isSelected ? '#FFFFFF' : 'text.secondary',
                          }}
                        >
                          {range.shortLabel}G {isSelected ? '✓' : ''}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontSize: '0.55rem',
                            fontFamily: 'monospace',
                            color: isSelected ? 'rgba(255, 255, 255, 0.9)' : 'text.disabled',
                          }}
                        >
                          {range.start.toFixed(3)}-{range.end.toFixed(3)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* RULETA Y TIRADA VISITANTE (VERDE) */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  bgcolor: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.04)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(52, 211, 153, 0.35)' : 'rgba(16, 185, 129, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                    {awayTeam.name} (Visita): <Box component="span" sx={{ color: isDark ? '#34D399' : '#047857', fontWeight: 900 }}>SPIN {simulationSeed.awaySpin.toFixed(3)} ➔ {awayGoals} Gol{awayGoals !== 1 ? 'es' : ''}</Box>
                  </Typography>
                  <Chip
                    label={`Rango: [${awayActiveRange.start.toFixed(3)} - ${awayActiveRange.end.toFixed(3)}]`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      bgcolor: isDark ? '#059669' : '#047857',
                      color: '#FFFFFF',
                    }}
                  />
                </Box>

                {/* Barra Ruleta Visitante */}
                <Box sx={{ height: 22, borderRadius: 2, display: 'flex', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                  {awayRanges.map((range, idx) => {
                    const pct = Math.max(3, (range.end - range.start) * 100);
                    const isSelected = range.k === awayGoals;
                    return (
                      <Box
                        key={range.k}
                        sx={{
                          width: `${pct}%`,
                          bgcolor: isSelected
                            ? isDark
                              ? '#10B981'
                              : '#059669'
                            : isDark
                            ? 'rgba(16, 185, 129, 0.25)'
                            : 'rgba(16, 185, 129, 0.12)',
                          borderRight: idx < awayRanges.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {pct > 7 && (
                          <Typography variant="caption" sx={{ color: '#FFF', fontSize: '0.62rem', fontWeight: 800 }}>
                            {range.shortLabel}G
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                {/* Intervalos bajo la barra Visitante */}
                <Box sx={{ display: 'flex', mt: 0.8, gap: 0.5 }}>
                  {awayRanges.map((range) => {
                    const isSelected = range.k === awayGoals;
                    return (
                      <Box
                        key={range.k}
                        sx={{
                          flex: 1,
                          p: 0.4,
                          borderRadius: 1.2,
                          bgcolor: isSelected
                            ? isDark
                              ? '#059669'
                              : '#047857'
                            : isDark
                            ? 'rgba(15, 23, 42, 0.6)'
                            : 'rgba(241, 245, 249, 0.8)',
                          border: '1px solid',
                          borderColor: isSelected
                            ? isDark
                              ? '#34D399'
                              : '#047857'
                            : isDark
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.06)',
                          textAlign: 'center',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontSize: '0.6rem',
                            fontWeight: isSelected ? 900 : 700,
                            color: isSelected ? '#FFFFFF' : 'text.secondary',
                          }}
                        >
                          {range.shortLabel}G {isSelected ? '✓' : ''}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontSize: '0.55rem',
                            fontFamily: 'monospace',
                            color: isSelected ? 'rgba(255, 255, 255, 0.9)' : 'text.disabled',
                          }}
                        >
                          {range.start.toFixed(3)}-{range.end.toFixed(3)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* PASO 6: RESULTADO FINAL DE LA SIMULACIÓN */}
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              ...cardStyle,
              background: isDark
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
                : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
              borderColor: isDark ? 'rgba(96, 165, 250, 0.4)' : 'rgba(37, 99, 235, 0.3)',
              boxShadow: isDark
                ? '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(37, 99, 235, 0.1)'
                : '0 8px 30px rgba(37, 99, 235, 0.12)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="6"
                  size="small"
                  sx={{
                    bgcolor: 'primary.main',
                    color: '#FFF',
                    fontWeight: 900,
                    width: 24,
                    height: 24,
                  }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
                  RESULTADO FINAL DE LA SIMULACIÓN
                </Typography>
              </Box>

              <Chip
                icon={<CasinoIcon />}
                label="Resultado Estocástico"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 800 }}
              />
            </Box>

            {/* MARCADOR FINAL */}
            <Box
              sx={{
                py: 3,
                px: 2,
                borderRadius: 3,
                bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 2, sm: 6 },
              }}
            >
              {/* Equipo Local */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {renderTeamAvatar(homeTeam, 64)}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                    {homeTeam.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Local (Rating {homeTeam.rating})
                  </Typography>
                </Box>
              </Box>

              {/* Goles Local */}
              <Typography
                variant="h2"
                sx={{ fontWeight: 900, color: homeGoals > awayGoals ? 'primary.main' : 'text.primary' }}
              >
                {homeGoals}
              </Typography>

              <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 300, opacity: 0.5 }}>
                :
              </Typography>

              {/* Goles Visitante */}
              <Typography
                variant="h2"
                sx={{ fontWeight: 900, color: awayGoals > homeGoals ? 'success.main' : 'text.primary' }}
              >
                {awayGoals}
              </Typography>

              {/* Equipo Visitante */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                    {awayTeam.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Visitante (Rating {awayTeam.rating})
                  </Typography>
                </Box>
                {renderTeamAvatar(awayTeam, 64)}
              </Box>
            </Box>

            {/* Banner de resultado */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                {homeGoals > awayGoals
                  ? `🏆 Ganador: ${homeTeam.name}`
                  : awayGoals > homeGoals
                  ? `🏆 Ganador: ${awayTeam.name}`
                  : '🤝 Empate en los 90 minutos'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
