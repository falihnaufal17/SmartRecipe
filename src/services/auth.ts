import axios from "axios";

export type AuthData = {
  token: string;
  username: string;
  fullname: string
}

export type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
}

const signIn = async (username: string, _password: string): Promise<AuthData> => {
  const res = await axios.post('https://smartrecipeapi.kevinpratamasinaga.my.id/api/account/login', {
    username,
    password: _password
  })
  const { accessToken, fullname } = res.data.data

  return {
    token: accessToken,
    username,
    fullname
  }
};

export const authService = {
  signIn
}