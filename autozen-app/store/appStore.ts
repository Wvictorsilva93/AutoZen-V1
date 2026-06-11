'use client';

import { create } from 'zustand';
import type { SessionUser, DashboardStats } from '@/types';

interface AppState {
  user: SessionUser | null;
  stats: DashboardStats | null;
  sidebarOpen: boolean;
  setUser: (user: SessionUser | null) => void;
  setStats: (stats: DashboardStats) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  stats: null,
  sidebarOpen: false,
  setUser: (user) => set({ user }),
  setStats: (stats) => set({ stats }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
