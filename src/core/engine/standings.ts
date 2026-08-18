// src/core/engine/standings.ts
// Cálculo y ordenamiento de la tabla de posiciones.
// Sin dependencias de React ni frameworks de UI.

import type { Match, StandingsEntry, Team } from '../models/types';
import { POINTS } from '../models/types';
import { getMatchOutcome } from './matchSimulator';

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

type MutableStandingsEntry = {
  -readonly [K in keyof StandingsEntry]: StandingsEntry[K];
};

// ---------------------------------------------------------------------------
// Función principal
// ---------------------------------------------------------------------------

/**
 * Calcula la tabla de posiciones completa a partir de los partidos jugados.
 *
 * Orden de criterios (lexicográfico):
 * 1. Puntos (DESC)
 * 2. Diferencia de gol (DESC)
 * 3. Goles a favor (DESC)
 *
 * @param matches - Todos los partidos del torneo (pending + completed).
 * @param teams - Lista completa de equipos.
 * @returns Array de StandingsEntry ordenado por posición.
 */
export function calculateStandings(matches: Match[], teams: Team[]): StandingsEntry[] {
  // Inicializar entradas vacías para todos los equipos
  const entries = initializeStandings(teams);

  // Procesar solo partidos completados
  const completedMatches = matches.filter((m) => m.status === 'completed' && m.result !== null);

  for (const match of completedMatches) {
    const { homeTeamId, awayTeamId, result } = match;

    if (!result) continue;

    const homeEntry = entries.get(homeTeamId);
    const awayEntry = entries.get(awayTeamId);

    if (!homeEntry || !awayEntry) continue;

    const outcome = getMatchOutcome(result);

    // Actualizar estadísticas comunes
    homeEntry.played++;
    awayEntry.played++;
    homeEntry.goalsFor += result.homeGoals;
    homeEntry.goalsAgainst += result.awayGoals;
    awayEntry.goalsFor += result.awayGoals;
    awayEntry.goalsAgainst += result.homeGoals;
    homeEntry.goalDifference = homeEntry.goalsFor - homeEntry.goalsAgainst;
    awayEntry.goalDifference = awayEntry.goalsFor - awayEntry.goalsAgainst;

    // Asignar puntos y W/D/L
    if (outcome === 'home') {
      homeEntry.won++;
      homeEntry.points += POINTS.WIN;
      awayEntry.lost++;
      awayEntry.points += POINTS.LOSS;
    } else if (outcome === 'away') {
      awayEntry.won++;
      awayEntry.points += POINTS.WIN;
      homeEntry.lost++;
      homeEntry.points += POINTS.LOSS;
    } else {
      homeEntry.drawn++;
      homeEntry.points += POINTS.DRAW;
      awayEntry.drawn++;
      awayEntry.points += POINTS.DRAW;
    }
  }

  // Convertir a array, ordenar y asignar posiciones
  const sortedEntries = sortStandings([...entries.values()]);

  return sortedEntries.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Crea el mapa inicial de entradas de la tabla con todos los valores en 0.
 */
function initializeStandings(teams: Team[]): Map<string, MutableStandingsEntry> {
  const entries = new Map<string, MutableStandingsEntry>();

  for (const team of teams) {
    entries.set(team.id, {
      teamId: team.id,
      position: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  }

  return entries;
}

/**
 * Ordena las entradas de la tabla según los criterios oficiales.
 * Orden: Puntos > Diferencia de gol > Goles a favor
 */
function sortStandings(entries: MutableStandingsEntry[]): MutableStandingsEntry[] {
  return entries.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

// ---------------------------------------------------------------------------
// Utilidades de zona de clasificación
// ---------------------------------------------------------------------------

export type ZoneType = 'champion' | 'cup' | 'relegation' | 'neutral';

/**
 * Determina la zona de clasificación de una posición dada.
 */
export function getPositionZone(
  position: number,
  totalTeams: number,
  championsZone: number,
  relegationZone: number
): ZoneType {
  if (position === 1) return 'champion';
  if (position <= championsZone) return 'cup';
  if (position > totalTeams - relegationZone) return 'relegation';
  return 'neutral';
}

/**
 * Encuentra la entrada de la tabla de posiciones de un equipo específico.
 */
export function getTeamStanding(
  standings: StandingsEntry[],
  teamId: string
): StandingsEntry | undefined {
  return standings.find((s) => s.teamId === teamId);
}

/**
 * Obtiene el equipo campeón (posición 1) de la tabla.
 */
export function getChampion(standings: StandingsEntry[]): StandingsEntry | null {
  return standings.find((s) => s.position === 1) ?? null;
}
