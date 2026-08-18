'use client';

// src/hooks/useMonteCarlo.ts
// Hook para gestionar la simulación masiva Monte Carlo.

import { useCallback, useRef, useState } from 'react';
import type { MonteCarloProgress, MonteCarloResult, TournamentConfig } from '@/core/models/types';
import { runMonteCarloSimulation } from '@/core/montecarlo/runner';

export interface UseMonteCarloReturn {
  result: MonteCarloResult | null;
  isRunning: boolean;
  progress: MonteCarloProgress | null;
  run: (config: TournamentConfig, n: number) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

export function useMonteCarlo(): UseMonteCarloReturn {
  const [result, setResult] = useState<MonteCarloResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<MonteCarloProgress | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async (config: TournamentConfig, n: number) => {
    // Cancelar simulación previa si existe
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsRunning(true);
    setResult(null);
    setProgress({ completed: 0, total: n, percentage: 0 });

    try {
      const monteCarloResult = await runMonteCarloSimulation(
        config,
        n,
        (prog) => setProgress(prog),
        controller.signal
      );

      if (!controller.signal.aborted) {
        setResult(monteCarloResult);
      }
    } finally {
      setIsRunning(false);
    }
  }, []);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsRunning(false);
    setResult(null);
    setProgress(null);
  }, []);

  return { result, isRunning, progress, run, cancel, reset };
}
