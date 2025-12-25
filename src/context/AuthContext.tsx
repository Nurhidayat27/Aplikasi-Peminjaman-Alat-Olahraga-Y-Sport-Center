import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginService } from "../services/authService";

type User = {
  id: number;
  username: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  ready: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // kalau nanti pakai AsyncStorage, cek di sini
    setReady(true);
  }, []);

  const login = (username: string, password: string) => {
    const result = loginService(username, password);

    if (!result.success) return false;

    setUser(result.user);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
