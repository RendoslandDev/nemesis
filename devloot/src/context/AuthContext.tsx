import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, Author } from "../services/api";

interface AuthState {
  token: string | null;
  author: Author | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthed: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "devletter_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem(TOKEN_KEY),
    author: null,
    loading: true,
  });

  // On mount: validate stored token
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    authApi
      .me(stored)
      .then((author) => setState({ token: stored, author, loading: false }))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setState({ token: null, author: null, loading: false });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, author } = await authApi.login(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setState({ token, author, loading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ token: null, author: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isAdmin: state.author?.role === "admin",
        isAuthed: !!state.token && !!state.author,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
