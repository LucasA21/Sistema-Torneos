'use client';

// src/app/tournament-context.tsx
// Contexto global que mantiene el estado de equipos y torneo entre páginas.
// Evita que cada página tenga su propio estado aislado.

import { createContext, type ReactNode, useContext } from 'react';
import { type UseMonteCarloReturn, useMonteCarlo } from '@/hooks/useMonteCarlo';
import { type UseTeamsReturn, useTeams } from '@/hooks/useTeams';
import { type UseTournamentReturn, useTournament } from '@/hooks/useTournament';

interface TournamentContextValue {
  teams: UseTeamsReturn;
  tournament: UseTournamentReturn;
  monteCarlo: UseMonteCarloReturn;
}

const TournamentContext = createContext<TournamentContextValue | null>(null);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const teams = useTeams();
  const tournament = useTournament();
  const monteCarlo = useMonteCarlo();

  return (
    <TournamentContext.Provider value={{ teams, tournament, monteCarlo }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournamentContext(): TournamentContextValue {
  const ctx = useContext(TournamentContext);
  if (!ctx) {
    throw new Error('useTournamentContext debe usarse dentro de TournamentProvider');
  }
  return ctx;
}
