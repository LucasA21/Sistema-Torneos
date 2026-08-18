// src/core/models/types.ts
// Tipos e interfaces del dominio de simulación de torneos deportivos.
// Este archivo no debe importar NADA de React, Next.js ni MUI.

// ---------------------------------------------------------------------------
// Entidades base
// ---------------------------------------------------------------------------

export interface Team {
  id: string;
  name: string;
  shortName: string; // Abreviatura 3 letras (ej: "RIV", "BOC")
  rating: number; // Habilidad base [1, 100]
  homeAdvantageBonus: number; // Factor adicional de localía [0, 1], default 0.05
  color: string; // Color primario del equipo (hex)
  logo?: string; // Ruta a la imagen del escudo (ej: "/escudos/river.png")
}

// ---------------------------------------------------------------------------
// Partido
// ---------------------------------------------------------------------------

export type MatchStatus = 'pending' | 'completed';

export interface Match {
  id: string;
  round: number; // Número de fecha (1-indexed)
  homeTeamId: string;
  awayTeamId: string;
  status: MatchStatus;
  result: MatchResult | null;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  homePerformance: number; // Valor interno de rendimiento calculado
  awayPerformance: number; // Valor interno de rendimiento calculado
}

export type MatchOutcome = 'home' | 'away' | 'draw';

// ---------------------------------------------------------------------------
// Tabla de posiciones
// ---------------------------------------------------------------------------

export interface StandingsEntry {
  teamId: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// ---------------------------------------------------------------------------
// Configuración del torneo
// ---------------------------------------------------------------------------

export type TournamentFormat = 'single' | 'double'; // Ida / Ida y vuelta

export interface TournamentConfig {
  teams: Team[];
  format: TournamentFormat;
  // Zonas de clasificación (número de equipos)
  championsZone: number; // Posiciones que clasifican a "copa" (ej: 4)
  relegationZone: number; // Posiciones que descienden (ej: 3)
  // Parámetros del motor de simulación
  noiseSigma: number; // Desviación estándar del ruido gaussiano (default: 15)
  baseGoals: number; // Goles base esperados por equipo (default: 1.0)
  goalScale: number; // Escala diferencia→goles adicionales (default: 0.03)
}

// ---------------------------------------------------------------------------
// Estado del torneo (simulación paso a paso)
// ---------------------------------------------------------------------------

export interface TournamentState {
  config: TournamentConfig;
  matches: Match[]; // Todos los partidos (pending + completed)
  standings: StandingsEntry[]; // Tabla de posiciones actualizada
  currentRound: number; // Fecha actual siendo jugada
  totalRounds: number; // Total de fechas del torneo
  isComplete: boolean;
}

// ---------------------------------------------------------------------------
// Monte Carlo
// ---------------------------------------------------------------------------

export interface TeamMonteCarloStats {
  teamId: string;
  // Probabilidades empíricas
  championProbability: number; // P(posición 1)
  cupProbability: number; // P(posición 2..championsZone)
  relegationProbability: number; // P(últimas relegationZone posiciones)
  // Promedios
  averagePoints: number;
  averagePosition: number;
  // Distribución discreta de posiciones (posición → frecuencia relativa)
  positionDistribution: Record<number, number>;
}

export interface MonteCarloResult {
  totalSimulations: number;
  teamStats: TeamMonteCarloStats[];
  executionTimeMs: number;
}

// ---------------------------------------------------------------------------
// Progreso de Monte Carlo (para UI)
// ---------------------------------------------------------------------------

export interface MonteCarloProgress {
  completed: number; // Torneos completados
  total: number; // Total de torneos a simular
  percentage: number; // [0, 1]
}

// ---------------------------------------------------------------------------
// Constantes del motor
// ---------------------------------------------------------------------------

export const SIMULATION_DEFAULTS = {
  NOISE_SIGMA: 15,
  HOME_ADVANTAGE: 0.05,
  BASE_GOALS: 1.0,
  GOAL_SCALE: 0.03,
  MONTE_CARLO_CHUNK_SIZE: 100,
} as const;

export const POINTS = {
  WIN: 3,
  DRAW: 1,
  LOSS: 0,
} as const;
