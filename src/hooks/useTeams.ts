'use client';

// src/hooks/useTeams.ts
// Hook para gestionar el estado de los equipos (CRUD).

import { useCallback, useState } from 'react';
import type { Team } from '@/core/models/types';
import { DEFAULT_TEAMS } from '@/lib/defaultTeams';

export interface UseTeamsReturn {
  teams: Team[];
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  resetToDefaults: () => void;
}

export function useTeams(): UseTeamsReturn {
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);

  const addTeam = useCallback((team: Team) => {
    setTeams((prev) => [...prev, team]);
  }, []);

  const updateTeam = useCallback((id: string, updates: Partial<Team>) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const removeTeam = useCallback((id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetToDefaults = useCallback(() => {
    setTeams(DEFAULT_TEAMS);
  }, []);

  return { teams, addTeam, updateTeam, removeTeam, resetToDefaults };
}
