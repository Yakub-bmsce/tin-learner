import { create } from 'zustand';
import { User } from './supabase';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  darkMode: true, // Default to dark mode
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
