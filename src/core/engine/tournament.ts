// src/core/engine/tournament.ts
// Orquestador del torneo: combina fixture, simulación y standings.
// Sin dependencias de React ni frameworks de UI.

import type { Match, Team, TournamentConfig, TournamentState } from '../models/types';
import { SIMULATION_DEFAULTS } from '../models/types';
import { calculateTotalRounds, generateFixture, getNextPendingRound } from './fixture';
import { simulateMatchAndUpdate } from './matchSimulator';
import { calculateStandings } from './standings';

// ---------------------------------------------------------------------------
// Inicialización
// ---------------------------------------------------------------------------

/**
 * Crea un TournamentConfig con valores por defecto a partir de una lista de equipos.
 */
export function createTournamentConfig(
  teams: Team[],
  overrides: Partial<TournamentConfig> = {}
): TournamentConfig {
  return {
    teams,
    format: 'single',
    championsZone: 4,
    relegationZone: 3,
    noiseSigma: SIMULATION_DEFAULTS.NOISE_SIGMA,
    baseGoals: SIMULATION_DEFAULTS.BASE_GOALS,
    goalScale: SIMULATION_DEFAULTS.GOAL_SCALE,
    ...overrides,
  };
}

/**
 * Inicializa un nuevo torneo: genera el fixture y el estado inicial.
 *
 * @param config - Configuración del torneo.
 * @returns Estado inicial del torneo con fixture generado y tabla vacía.
 */
export function initializeTournament(config: TournamentConfig): TournamentState {
  const matches = generateFixture(config);
  const totalRounds = calculateTotalRounds(config.teams.length, config.format);
  const standings = calculateStandings([], config.teams);

  return {
    config,
    matches,
    standings,
    currentRound: 1,
    totalRounds,
    isComplete: false,
  };
}

// ---------------------------------------------------------------------------
// Avance de la simulación (paso a paso)
// ---------------------------------------------------------------------------

/**
 * Simula el siguiente partido pendiente en el torneo.
 * Devuelve un nuevo estado inmutable (no muta el estado original).
 *
 * @param state - Estado actual del torneo.
 * @param rng - Generador de números aleatorios (default: Math.random).
 * @returns Nuevo estado con el partido siguiente simulado.
 */
export function simulateNextMatch(
  state: TournamentState,
  rng: () => number = Math.random
): TournamentState {
  if (state.isComplete) return state;

  const nextPending = state.matches.find((m) => m.status === 'pending');
  if (!nextPending) return { ...state, isComplete: true };

  const homeTeam = findTeam(state.config.teams, nextPending.homeTeamId);
  const awayTeam = findTeam(state.config.teams, nextPending.awayTeamId);

  if (!homeTeam || !awayTeam) {
    throw new Error(`Equipo no encontrado: ${nextPending.homeTeamId} vs ${nextPending.awayTeamId}`);
  }

  const updatedMatch = simulateMatchAndUpdate(nextPending, homeTeam, awayTeam, state.config, rng);

  const newMatches = state.matches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m));
  const newStandings = calculateStandings(newMatches, state.config.teams);
  const isComplete = newMatches.every((m) => m.status === 'completed');
  const nextRound = getNextPendingRound(newMatches) ?? state.currentRound;

  return {
    ...state,
    matches: newMatches,
    standings: newStandings,
    currentRound: nextRound,
    isComplete,
  };
}

/**
 * Simula todos los partidos pendientes de la fecha actual.
 * Devuelve un nuevo estado inmutable.
 *
 * @param state - Estado actual del torneo.
 * @param rng - Generador de números aleatorios.
 * @returns Nuevo estado con toda la fecha actual simulada.
 */
export function simulateCurrentRound(
  state: TournamentState,
  rng: () => number = Math.random
): TournamentState {
  if (state.isComplete) return state;

  const roundToSimulate = state.currentRound;
  const pendingInRound = state.matches.filter(
    (m) => m.status === 'pending' && m.round === roundToSimulate
  );

  if (pendingInRound.length === 0) return state;

  // Simular todos los partidos pendientes de la fecha
  let updatedMatches = [...state.matches];

  for (const match of pendingInRound) {
    const homeTeam = findTeam(state.config.teams, match.homeTeamId);
    const awayTeam = findTeam(state.config.teams, match.awayTeamId);

    if (!homeTeam || !awayTeam) continue;

    const updatedMatch = simulateMatchAndUpdate(match, homeTeam, awayTeam, state.config, rng);
    updatedMatches = updatedMatches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m));
  }

  const newStandings = calculateStandings(updatedMatches, state.config.teams);
  const isComplete = updatedMatches.every((m) => m.status === 'completed');
  const nextRound = getNextPendingRound(updatedMatches) ?? state.currentRound;

  return {
    ...state,
    matches: updatedMatches,
    standings: newStandings,
    currentRound: nextRound,
    isComplete,
  };
}

/**
 * Simula el torneo completo de un solo golpe (para uso en Monte Carlo).
 * Devuelve el estado final del torneo.
 *
 * @param config - Configuración del torneo.
 * @param rng - Generador de números aleatorios.
 * @returns Estado final con todos los partidos jugados.
 */
export function runFullTournament(
  config: TournamentConfig,
  rng: () => number = Math.random
): TournamentState {
  let state = initializeTournament(config);

  while (!state.isComplete) {
    state = simulateNextMatch(state, rng);
  }

  return state;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findTeam(teams: Team[], teamId: string): Team | undefined {
  return teams.find((t) => t.id === teamId);
}

/**
 * Obtiene los partidos de una fecha específica.
 */
export function getMatchesByRound(state: TournamentState, round: number): Match[] {
  return state.matches.filter((m) => m.round === round);
}

/**
 * Obtiene los partidos completados de una fecha.
 */
export function getCompletedMatchesByRound(state: TournamentState, round: number): Match[] {
  return state.matches.filter((m) => m.round === round && m.status === 'completed');
}

/**
 * Calcula el porcentaje de progreso del torneo.
 */
export function getTournamentProgress(state: TournamentState): number {
  const completed = state.matches.filter((m) => m.status === 'completed').length;
  return state.matches.length > 0 ? completed / state.matches.length : 0;
}
