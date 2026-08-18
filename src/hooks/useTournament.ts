'use client';

// src/hooks/useTournament.ts
// Hook para gestionar el estado reactivo de la simulación paso a paso.

import { useCallback, useState } from 'react';
// Simular todo el torneo de una vez (para el botón "Simular Todo")
import {
  initializeTournament,
  runFullTournament,
  simulateCurrentRound,
  simulateNextMatch,
} from '@/core/engine/tournament';
import type { TournamentConfig, TournamentState } from '@/core/models/types';

export interface UseTournamentReturn {
  state: TournamentState | null;
  isStarted: boolean;
  startTournament: (config: TournamentConfig) => void;
  simulateMatch: () => void;
  simulateRound: () => void;
  simulateAll: () => void;
  reset: () => void;
}

export function useTournament(): UseTournamentReturn {
  const [state, setState] = useState<TournamentState | null>(null);

  const startTournament = useCallback((config: TournamentConfig) => {
    setState(initializeTournament(config));
  }, []);

  const simulateMatch = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.isComplete) return prev;
      return simulateNextMatch(prev);
    });
  }, []);

  const simulateRound = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.isComplete) return prev;
      return simulateCurrentRound(prev);
    });
  }, []);

  const simulateAll = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.isComplete) return prev;
      return runFullTournament(prev.config);
    });
  }, []);

  const reset = useCallback(() => {
    setState(null);
  }, []);

  return {
    state,
    isStarted: state !== null,
    startTournament,
    simulateMatch,
    simulateRound,
    simulateAll,
    reset,
  };
}
