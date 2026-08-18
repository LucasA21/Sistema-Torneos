// src/core/engine/matchSimulator.ts
// Función de transición estocástica: simula el resultado de un partido.
// Implementa el modelo matemático descrito en docs/02_especificacion_del_modelo.md
// Sin dependencias de React ni frameworks de UI.

import type { Match, MatchResult, Team, TournamentConfig } from '../models/types';
import { SIMULATION_DEFAULTS } from '../models/types';

// ---------------------------------------------------------------------------
// Generación de números aleatorios
// ---------------------------------------------------------------------------

/**
 * Genera una variable aleatoria con distribución normal N(μ, σ²)
 * usando la transformación Box-Muller.
 */
function gaussianRandom(mean: number, std: number, rng: () => number = Math.random): number {
  const u1 = rng();
  const u2 = rng();

  // Evitar log(0)
  const safeU1 = Math.max(u1, Number.EPSILON);

  const z = Math.sqrt(-2 * Math.log(safeU1)) * Math.cos(2 * Math.PI * u2);
  return mean + std * z;
}

/**
 * Genera una variable aleatoria con distribución de Poisson(λ)
 * usando el método de Knuth.
 *
 * Apropiado para λ <= 30. Para valores más altos usar aproximación gaussiana.
 */
function poissonRandom(lambda: number, rng: () => number = Math.random): number {
  if (lambda <= 0) return 0;

  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;

  do {
    k++;
    p *= rng();
  } while (p > L);

  return k - 1;
}

// ---------------------------------------------------------------------------
// Función de rendimiento
// ---------------------------------------------------------------------------

/**
 * Calcula el rendimiento de un equipo en un partido dado su rating y ruido.
 *
 * Fórmula: P = rating * (1 + localía_bonus) + ε, donde ε ~ N(0, σ²)
 */
function calculatePerformance(
  team: Team,
  isHome: boolean,
  noiseSigma: number,
  rng: () => number
): number {
  const homeBonus = isHome ? team.homeAdvantageBonus : 0;
  const noise = gaussianRandom(0, noiseSigma, rng);
  return team.rating * (1 + homeBonus) + noise;
}

// ---------------------------------------------------------------------------
// Función de generación de goles
// ---------------------------------------------------------------------------

/**
 * Calcula los goles esperados (λ) para cada equipo basado en la diferencia
 * de rendimiento relativo.
 *
 * Fórmula:
 *   λ_home = BASE_GOALS + max(0, Δ) * GOAL_SCALE
 *   λ_away = BASE_GOALS + max(0, -Δ) * GOAL_SCALE
 */
function calculateGoalLambdas(
  homePerformance: number,
  awayPerformance: number,
  baseGoals: number,
  goalScale: number
): { lambdaHome: number; lambdaAway: number } {
  const delta = homePerformance - awayPerformance;

  return {
    lambdaHome: baseGoals + Math.max(0, delta) * goalScale,
    lambdaAway: baseGoals + Math.max(0, -delta) * goalScale,
  };
}

// ---------------------------------------------------------------------------
// Función pública principal
// ---------------------------------------------------------------------------

/**
 * Simula el resultado de un partido entre dos equipos.
 *
 * @param match - El partido a simular (debe tener status 'pending').
 * @param homeTeam - Equipo local.
 * @param awayTeam - Equipo visitante.
 * @param config - Configuración del torneo con parámetros del motor.
 * @param rng - Función generadora de números aleatorios (default: Math.random).
 * @returns MatchResult con goles y valores de rendimiento internos.
 */
export function simulateMatch(
  _match: Match,
  homeTeam: Team,
  awayTeam: Team,
  config: TournamentConfig,
  rng: () => number = Math.random
): MatchResult {
  const { noiseSigma, baseGoals, goalScale } = config;

  // 1. Calcular rendimientos con ruido gaussiano
  const homePerformance = calculatePerformance(homeTeam, true, noiseSigma, rng);
  const awayPerformance = calculatePerformance(awayTeam, false, noiseSigma, rng);

  // 2. Calcular parámetros de Poisson basados en diferencia de rendimiento
  const { lambdaHome, lambdaAway } = calculateGoalLambdas(
    homePerformance,
    awayPerformance,
    baseGoals,
    goalScale
  );

  // 3. Samplear goles de distribución de Poisson
  const homeGoals = poissonRandom(lambdaHome, rng);
  const awayGoals = poissonRandom(lambdaAway, rng);

  return {
    homeGoals,
    awayGoals,
    homePerformance,
    awayPerformance,
  };
}

/**
 * Simula un partido y devuelve el match con resultado actualizado.
 */
export function simulateMatchAndUpdate(
  match: Match,
  homeTeam: Team,
  awayTeam: Team,
  config: TournamentConfig,
  rng: () => number = Math.random
): Match {
  const result = simulateMatch(match, homeTeam, awayTeam, config, rng);

  return {
    ...match,
    status: 'completed',
    result,
  };
}

/**
 * Obtiene el outcome de un partido (quién ganó).
 */
export function getMatchOutcome(result: MatchResult): 'home' | 'away' | 'draw' {
  if (result.homeGoals > result.awayGoals) return 'home';
  if (result.awayGoals > result.homeGoals) return 'away';
  return 'draw';
}

/**
 * Devuelve los parámetros de simulación por defecto.
 */
export function getDefaultSimulationParams(): Pick<
  TournamentConfig,
  'noiseSigma' | 'baseGoals' | 'goalScale'
> {
  return {
    noiseSigma: SIMULATION_DEFAULTS.NOISE_SIGMA,
    baseGoals: SIMULATION_DEFAULTS.BASE_GOALS,
    goalScale: SIMULATION_DEFAULTS.GOAL_SCALE,
  };
}
