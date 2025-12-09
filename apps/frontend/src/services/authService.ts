import type { ILoginUpUser, ISignUpUser } from '@/apiClients/authClient';
import AuthClient from '@/apiClients/authClient';
import { useAuthStore } from '@/stores/authStore';

const authClient = new AuthClient();

function useAuth() {
  const authStore = useAuthStore();

  const signUp = async (newUser: ISignUpUser) => {
    const user = await authClient.signUp(newUser);
    if (user === null) {
      return;
    }

    authStore.setUser(user);
  };

  const login = async (userLogin: ILoginUpUser) => {
    const user = await authClient.login(userLogin);
    if (user === null) {
      return;
    }

    authStore.setUser(user);
  };

  const signOut = async () => {
    await authClient.signOut();

    authStore.removeUser();
  };

  const isAuthenticated = async () => {
    const user = await authClient.isAuthenticated();
    if (user === null) {
      return;
    }

    authStore.setUser(user);
  };

  return { signUp, login, signOut, isAuthenticated };
}

export { useAuth };
