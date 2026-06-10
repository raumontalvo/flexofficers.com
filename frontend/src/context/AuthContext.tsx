import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  apiLogin,
  apiRegister,
  apiMe,
  apiLogout,
  apiGoogleAuth,
  setToken,
  getToken,
  User,
  Role,
} from "@/src/api/client";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (body: {
    email: string;
    password: string;
    full_name: string;
    role: Role;
    company_name?: string;
  }) => Promise<User>;
  loginWithGoogle: (sessionToken: string, role?: Role) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (token) {
        const u = await apiMe();
        setUser(u);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    await setToken(res.access_token);
    setUser(res.user);
    return res.user;
  };

  const register = async (body: {
    email: string;
    password: string;
    full_name: string;
    role: Role;
    company_name?: string;
  }) => {
    const res = await apiRegister(body);
    await setToken(res.access_token);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const loginWithGoogle = async (sessionToken: string, role: Role = "officer") => {
    const res = await apiGoogleAuth(sessionToken, role);
    await setToken(res.access_token);
    setUser(res.user);
    return res.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, refresh: bootstrap }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
