import type { ILoginUpUser, ISignUpUser } from '@/apiClients/authClient';
import AuthClient from '@/apiClients/authClient';
import { useAuth } from '@/stores/authStore';

const authClient = new AuthClient();

const authService = {
  signUp: async (newUser: ISignUpUser) => {
    const user = await authClient.signUp(newUser);
    if (user === null) {
      return;
    }

    const authStore = useAuth();
    authStore.setUser(user);
  },
  login: async (userLogin: ILoginUpUser) => {
    const user = await authClient.login(userLogin);
    if (user === null) {
      return;
    }

    const authStore = useAuth();
    authStore.setUser(user);
  },
  signOut: () => {
    const authStore = useAuth();
    authStore.removeUser();
  },
  isAuthenticated: async () => {
    const user = await authClient.isAuthenticated();
    if (user === null) {
      return;
    }

    const authStore = useAuth();
    authStore.setUser(user);
  },
};

export { authService };
