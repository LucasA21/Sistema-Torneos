// src/core/montecarlo/runner.ts
// Ejecutor asíncrono de simulación Monte Carlo.
// Corre en chunks para no bloquear el hilo principal de React.
// Sin dependencias de React ni frameworks de UI.

import { runFullTournament } from '../engine/tournament';
import type {
  MonteCarloProgress,
  MonteCarloResult,
  TournamentConfig,
  TournamentState,
} from '../models/types';
import { SIMULATION_DEFAULTS } from '../models/types';
import { aggregateResults } from './statistics';

// ---------------------------------------------------------------------------
// Runner principal
// ---------------------------------------------------------------------------

/**
 * Ejecuta una simulación Monte Carlo de N torneos completos de forma asíncrona.
 *
 * La simulación se divide en chunks para ceder el control al event loop del
 * browser entre cada bloque, permitiendo que la UI se actualice con el progreso.
 *
 * @param config - Configuración del torneo.
 * @param totalSimulations - Número total de torneos a simular (N).
 * @param onProgress - Callback llamado después de cada chunk con el progreso.
 * @param signal - AbortSignal para cancelar la simulación en curso.
 * @returns Promise que resuelve con los resultados estadísticos agregados.
 */
export async function runMonteCarloSimulation(
  config: TournamentConfig,
  totalSimulations: number,
  onProgress?: (progress: MonteCarloProgress) => void,
  signal?: AbortSignal
): Promise<MonteCarloResult> {
  const startTime = performance.now();
  const results: TournamentState[] = [];
  const chunkSize = SIMULATION_DEFAULTS.MONTE_CARLO_CHUNK_SIZE;

  for (let i = 0; i < totalSimulations; i += chunkSize) {
    // Verificar si la simulación fue cancelada
    if (signal?.aborted) {
      break;
    }

    const chunk = Math.min(chunkSize, totalSimulations - i);

    // Ejecutar chunk de manera síncrona
    for (let j = 0; j < chunk; j++) {
      results.push(runFullTournament(config));
    }

    // Reportar progreso
    const completed = Math.min(i + chunk, totalSimulations);
    onProgress?.({
      completed,
      total: totalSimulations,
      percentage: completed / totalSimulations,
    });

    // Ceder control al event loop (permite actualizar la UI)
    await yieldToMainThread();
  }

  const executionTimeMs = performance.now() - startTime;

  return aggregateResults(results, config, executionTimeMs);
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/**
 * Cede el control al event loop del browser usando una Promise vacía.
 * Esto permite que React actualice el estado y renderice antes de continuar.
 */
function yieldToMainThread(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Valida que el número de simulaciones esté en un rango razonable.
 */
export function validateSimulationCount(n: number): {
  valid: boolean;
  error?: string;
} {
  if (!Number.isInteger(n) || n <= 0) {
    return { valid: false, error: 'N debe ser un entero positivo.' };
  }
  if (n < 100) {
    return {
      valid: false,
      error: 'Mínimo 100 simulaciones para resultados estadísticamente significativos.',
    };
  }
  if (n > 50000) {
    return {
      valid: false,
      error: 'Máximo 50.000 simulaciones para mantener performance en el browser.',
    };
  }
  return { valid: true };
}

/**
 * Estima el tiempo esperado de ejecución basado en experiencias previas.
 * Retorna estimación en segundos.
 */
export function estimateExecutionTime(
  n: number,
  teamCount: number,
  format: 'single' | 'double'
): number {
  const matchesPerTournament = (teamCount * (teamCount - 1)) / 2;
  const totalMatches = matchesPerTournament * n * (format === 'double' ? 2 : 1);
  // Estimación empírica: ~5 millones de partidos/segundo en browser moderno
  return totalMatches / 5_000_000;
}
