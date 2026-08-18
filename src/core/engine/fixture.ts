// src/core/engine/fixture.ts
// Generador de fixture Round-Robin usando el método de rotación de polígono.
// Sin dependencias de React ni frameworks de UI.

import type { Match, Team, TournamentConfig, TournamentFormat } from '../models/types';

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

type Matchup = [string, string]; // [homeTeamId, awayTeamId]

// ---------------------------------------------------------------------------
// Algoritmo Round-Robin (rotación de polígono)
// ---------------------------------------------------------------------------

/**
 * Genera todas las rondas de un torneo round-robin para N equipos.
 * Si N es impar, agrega un equipo BYE ficticio (id: 'BYE').
 *
 * Algoritmo de rotación de polígono:
 * - El equipo en posición 0 (índice fijo) siempre juega de local en rondas impares.
 * - Los demás N-1 equipos rotan en sentido horario cada ronda.
 * - Resultado: cada equipo juega exactamente una vez por ronda, N-1 rondas totales.
 */
function generateRoundRobinRounds(teamIds: string[]): Matchup[][] {
  const ids = [...teamIds];

  // Si N es impar, agregar BYE
  if (ids.length % 2 !== 0) {
    ids.push('BYE');
  }

  const n = ids.length;
  const rounds: Matchup[][] = [];

  for (let round = 0; round < n - 1; round++) {
    const roundMatchups: Matchup[] = [];

    for (let i = 0; i < n / 2; i++) {
      const home = ids[i];
      const away = ids[n - 1 - i];

      // Saltar partidos con el equipo BYE
      if (home !== 'BYE' && away !== 'BYE') {
        // Alternar local/visitante para equilibrar ventaja de cancha
        if (round % 2 === 0) {
          roundMatchups.push([home, away]);
        } else {
          roundMatchups.push([away, home]);
        }
      }
    }

    rounds.push(roundMatchups);

    // Rotar: mantener ids[0] fijo, rotar el resto
    const last = ids[n - 1];
    for (let i = n - 1; i > 1; i--) {
      ids[i] = ids[i - 1];
    }
    ids[1] = last;
  }

  return rounds;
}

// ---------------------------------------------------------------------------
// Función pública principal
// ---------------------------------------------------------------------------

/**
 * Genera el fixture completo para un torneo dado su configuración.
 * @param config - Configuración del torneo con equipos y formato.
 * @returns Array de Match con todos los partidos en orden de fecha.
 */
export function generateFixture(config: TournamentConfig): Match[] {
  const { teams, format } = config;
  const teamIds = teams.map((t) => t.id);

  const firstLegRounds = generateRoundRobinRounds(teamIds);
  const allRounds = buildAllRounds(firstLegRounds, format);

  return buildMatchList(allRounds);
}

/**
 * Si el formato es 'double' (ida y vuelta), agrega una segunda vuelta
 * con los roles de local/visitante invertidos.
 */
function buildAllRounds(firstLeg: Matchup[][], format: TournamentFormat): Matchup[][] {
  if (format === 'single') {
    return firstLeg;
  }

  const secondLeg: Matchup[][] = firstLeg.map((round) =>
    round.map(([home, away]) => [away, home] as Matchup)
  );

  return [...firstLeg, ...secondLeg];
}

/**
 * Convierte las rondas de matchups en una lista plana de objetos Match.
 */
function buildMatchList(rounds: Matchup[][]): Match[] {
  const matches: Match[] = [];
  let matchIndex = 0;

  rounds.forEach((round, roundIndex) => {
    round.forEach(([homeTeamId, awayTeamId]) => {
      matches.push({
        id: `match-${matchIndex++}`,
        round: roundIndex + 1,
        homeTeamId,
        awayTeamId,
        status: 'pending',
        result: null,
      });
    });
  });

  return matches;
}

/**
 * Calcula el número total de fechas para N equipos y el formato dado.
 */
export function calculateTotalRounds(teamCount: number, format: TournamentFormat): number {
  const n = teamCount % 2 === 0 ? teamCount : teamCount + 1;
  const singleLegRounds = n - 1;
  return format === 'double' ? singleLegRounds * 2 : singleLegRounds;
}

/**
 * Obtiene todos los partidos de una fecha específica.
 */
export function getMatchesByRound(matches: Match[], round: number): Match[] {
  return matches.filter((m) => m.round === round);
}

/**
 * Obtiene el primer partido pendiente de la lista.
 */
export function getNextPendingMatch(matches: Match[]): Match | null {
  return matches.find((m) => m.status === 'pending') ?? null;
}

/**
 * Obtiene la fecha del próximo partido pendiente.
 */
export function getNextPendingRound(matches: Match[]): number | null {
  const next = getNextPendingMatch(matches);
  return next?.round ?? null;
}

/**
 * Calcula las estadísticas de equipos a partir del fixture generado.
 * Útil para validar que cada equipo juegue la cantidad correcta de partidos.
 */
export function validateFixture(
  matches: Match[],
  teams: Team[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const expectedMatches = teams.length - 1; // Liga simple

  for (const team of teams) {
    const teamMatches = matches.filter((m) => m.homeTeamId === team.id || m.awayTeamId === team.id);
    if (teamMatches.length < expectedMatches) {
      errors.push(
        `Equipo "${team.name}" tiene ${teamMatches.length} partidos, esperado ${expectedMatches}+`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}
