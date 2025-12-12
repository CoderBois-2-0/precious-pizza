import { create } from 'zustand';
import type { IAPIUser } from '@/apiClients/authClient';


interface IAuthStore {
  user: IAPIUser | null;
  setUser: (user: IAPIUser) => void;
  removeUser: () => void;
}

const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  removeUser: () => set({ user: null }),
}));

export { useAuthStore };
