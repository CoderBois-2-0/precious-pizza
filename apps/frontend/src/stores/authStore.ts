import { create } from 'zustand';

type TUser = {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
};

interface IAuthStore {
  user: TUser | null;
  setUser: (user: TUser) => void;
  removeUser: () => void;
}

const useAuth = create<IAuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  removeUser: () => set({ user: null }),
}));

export { useAuth };
