export type AuthData = {
  token: string;
  username: string;
}

export type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
}

const signIn = (username: string, _password: string): Promise<AuthData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'some token',
        username: username,
      });
    }, 1000);
  });
};

export const authService = {
  signIn
}