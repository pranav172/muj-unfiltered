import { create } from 'zustand';

type User = {
  uid: string;
  email?: string;
  isRegistered?: boolean;
  streak?: number;
};

type Store = {
  user: User | null;
  mode: 'social' | 'dating';
  streak: number;
  isRegistered: boolean;
  setUser: (user: User | null) => void;
  setMode: (mode: 'social' | 'dating') => void;
  setStreak: (n: number) => void;
  setRegistered: (b: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  user: null,
  mode: 'social',
  streak: 0,
  isRegistered: false,
  setUser: (user) => set({ user }),
  setMode: (mode) => set({ mode }),
  setStreak: (streak) => set({ streak }),
  setRegistered: (isRegistered) => set({ isRegistered }),
}));
