"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import {
  getToken,
  getUsername,
  saveAuth,
  clearAuth,
  register as authRegister,
  login as authLogin,
} from "@/lib/auth";
import { PromptswapAPI } from "@/lib/api";

interface AuthState {
  token: string | null;
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthState>({
  token: null,
  username: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    const savedUsername = getUsername();
    if (savedToken) {
      // Validate token
      const api = new PromptswapAPI(savedToken);
      api
        .me()
        .then((user) => {
          setToken(savedToken);
          setUsername(user.username || savedUsername);
          if (user.username) saveAuth(savedToken, user.username);
        })
        .catch(() => {
          clearAuth();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (u: string, p: string) => {
    const result = await authLogin(u, p);
    setToken(result.token);
    setUsername(result.username);
  }, []);

  const register = useCallback(async () => {
    const result = await authRegister();
    setToken(result.token);
    setUsername(result.username);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, username, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
