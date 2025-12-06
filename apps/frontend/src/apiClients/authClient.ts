interface IAPIUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
}

interface ISignUpUser {
  'first-name': string;
  'last-name': string;
  email: string;
  'phone-number': string;
  password: string;
  'confirm-password': string;
}

interface ILoginUpUser {
  email: string;
  password: string;
}

class AuthClient {
  #url = `${import.meta.env.VITE_API_URL}/auth`;

  async signUp(newUser: ISignUpUser): Promise<IAPIUser | null> {
    const res = await fetch(`${this.#url}/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
      credentials: 'include',
    });

    if (res.status !== 201) {
      return null;
    }

    const user = await res.json();

    return user;
  }

  async login(userLogin: ILoginUpUser): Promise<IAPIUser | null> {
    const res = await fetch(`${this.#url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userLogin),
      credentials: 'include',
    });

    if (res.status !== 200) {
      return null;
    }

    const user = await res.json();

    return user;
  }

  async signOut(): Promise<boolean> {
    const res = await fetch(`${this.#url}/sign-out`, {
      credentials: 'include',
    });

    return res.status === 200;
  }

  /**
   * @description
   * isAuthenticated - is used for checking if the server recognises the user via the auth-token cookie.
   * Ideal for init of auth state, aka. when the user opens the page or refreshes the browser.
   */
  async isAuthenticated(): Promise<IAPIUser | null> {
    const res = await fetch(`${this.#url}/is-authenticated`, {
      credentials: 'include',
    });

    if (res.status !== 200) {
      return null;
    }

    const user = await res.json();

    return user;
  }
}

export default AuthClient;
export type { ISignUpUser, ILoginUpUser, IAPIUser };
