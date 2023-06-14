import axios from "axios";
import { BASE_API_URL } from "../constants/general";

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
  const res = await axios.post(`${BASE_API_URL}/account/login`, {
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