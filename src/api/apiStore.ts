import type {} from "@redux-devtools/extension"; // required for devtools typing
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface Permission {
  method: string;
  url: string;
}
export interface JwtPayload {
  id: number;
  account: string;
  role: string[];
  permissions: Permission[];
  exp: number;
  iat: number;
  nbf: number;
}

interface State {
  jwt: JwtPayload | null;
  token: string | null;
  refreshToken: string | null;
  setLogin: (token: string, refreshToken: string) => void;
  renewToken: (token: string) => void;
  clearLogin: () => void;

  remember: string | null;
  setRemember: (remember: string | null) => void;
}

export const useApiStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        jwt: null,
        token: null,
        refreshToken: null,
        setLogin: (token, refreshToken) => {
          const jwt = jwtDecode<JwtPayload>(token);
          set({ jwt, token, refreshToken });
        },
        renewToken: (token) => {
          const jwt = jwtDecode<JwtPayload>(token);
          set({ jwt, token });
        },
        clearLogin: () => {
          set({ jwt: null, token: null, refreshToken: null });
        },
        remember: null,
        setRemember: (remember) => {
          set({ remember });
        },
      }),
      { name: "api-store" }
    )
  )
);
