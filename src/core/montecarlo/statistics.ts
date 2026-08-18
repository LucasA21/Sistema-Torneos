// src/core/montecarlo/statistics.ts
// Agregación de resultados estadísticos de simulaciones Monte Carlo.
// Sin dependencias de React ni frameworks de UI.

import type {
  MonteCarloResult,
  TeamMonteCarloStats,
  TournamentConfig,
  TournamentState,
} from '../models/types';

// ---------------------------------------------------------------------------
// Tipos internos de acumulación
// ---------------------------------------------------------------------------

interface TeamAccumulator {
  teamId: string;
  champCount: number;
  cupCount: number;
  relegationCount: number;
  totalPoints: number;
  totalPosition: number;
  positionCounts: Record<number, number>;
}

// ---------------------------------------------------------------------------
// Función principal de agregación
// ---------------------------------------------------------------------------

/**
 * Agrega los resultados de N torneos simulados en estadísticas por equipo.
 *
 * @param results - Array de estados finales de torneos simulados.
 * @param config - Configuración del torneo (para zonas de clasificación).
 * @param executionTimeMs - Tiempo de ejecución en milisegundos.
 * @returns MonteCarloResult con estadísticas completas por equipo.
 */
export function aggregateResults(
  results: TournamentState[],
  config: TournamentConfig,
  executionTimeMs: number
): MonteCarloResult {
  const N = results.length;
  if (N === 0) {
    return {
      totalSimulations: 0,
      teamStats: [],
      executionTimeMs,
    };
  }

  const { teams, championsZone, relegationZone } = config;
  const totalTeams = teams.length;

  // Inicializar acumuladores por equipo
  const accumulators = new Map<string, TeamAccumulator>();
  for (const team of teams) {
    accumulators.set(team.id, {
      teamId: team.id,
      champCount: 0,
      cupCount: 0,
      relegationCount: 0,
      totalPoints: 0,
      totalPosition: 0,
      positionCounts: {},
    });
  }

  // Procesar cada resultado
  for (const tournamentState of results) {
    const { standings } = tournamentState;

    for (const entry of standings) {
      const acc = accumulators.get(entry.teamId);
      if (!acc) continue;

      const { position, points } = entry;

      // Contar campeonatos
      if (position === 1) acc.champCount++;

      // Contar clasificaciones a copa (posiciones 2..championsZone)
      if (position > 1 && position <= championsZone) acc.cupCount++;

      // Contar descensos (últimas N posiciones)
      if (position > totalTeams - relegationZone) acc.relegationCount++;

      // Acumular para promedios
      acc.totalPoints += points;
      acc.totalPosition += position;

      // Distribución de posiciones
      acc.positionCounts[position] = (acc.positionCounts[position] ?? 0) + 1;
    }
  }

  // Convertir acumuladores a estadísticas finales
  const teamStats: TeamMonteCarloStats[] = [...accumulators.values()].map((acc) => ({
    teamId: acc.teamId,
    championProbability: acc.champCount / N,
    cupProbability: acc.cupCount / N,
    relegationProbability: acc.relegationCount / N,
    averagePoints: acc.totalPoints / N,
    averagePosition: acc.totalPosition / N,
    positionDistribution: normalizePositionDistribution(acc.positionCounts, N),
  }));

  // Ordenar por probabilidad de campeonato (DESC)
  teamStats.sort((a, b) => b.championProbability - a.championProbability);

  return {
    totalSimulations: N,
    teamStats,
    executionTimeMs,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normaliza los conteos de posición a frecuencias relativas [0, 1].
 */
function normalizePositionDistribution(
  counts: Record<number, number>,
  total: number
): Record<number, number> {
  const normalized: Record<number, number> = {};
  for (const [pos, count] of Object.entries(counts)) {
    normalized[Number(pos)] = count / total;
  }
  return normalized;
}

/**
 * Calcula el intervalo de confianza de Wilson para una proporción estimada.
 * Útil para mostrar la precisión de las estimaciones Monte Carlo.
 *
 * @param p - Proporción estimada [0, 1].
 * @param n - Número de muestras.
 * @param confidence - Nivel de confianza (default: 0.95).
 * @returns { lower, upper } límites del intervalo de confianza.
 */
export function wilsonConfidenceInterval(
  p: number,
  n: number,
  confidence: number = 0.95
): { lower: number; upper: number; marginOfError: number } {
  if (n === 0) return { lower: 0, upper: 1, marginOfError: 1 };

  // z-score para 95% de confianza
  const z = confidence === 0.95 ? 1.96 : 1.645;
  const se = Math.sqrt((p * (1 - p)) / n);
  const marginOfError = z * se;

  return {
    lower: Math.max(0, p - marginOfError),
    upper: Math.min(1, p + marginOfError),
    marginOfError,
  };
}

/**
 * Calcula N mínimo recomendado para un error máximo aceptable.
 *
 * @param maxError - Error máximo aceptable (ej: 0.02 para ±2%).
 * @param confidence - Nivel de confianza (default: 0.95).
 * @returns N mínimo recomendado.
 */
export function calculateRecommendedN(maxError: number, confidence: number = 0.95): number {
  const z = confidence === 0.95 ? 1.96 : 1.645;
  // Caso peor: p = 0.5 maximiza la varianza
  return Math.ceil((z / maxError) ** 2 * 0.25);
}

/**
 * Formatea una probabilidad como porcentaje con decimales.
 */
export function formatProbability(p: number, decimals: number = 1): string {
  return `${(p * 100).toFixed(decimals)}%`;
}
