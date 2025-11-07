import { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@shared/schema";

interface AuthContextType {
  session: Session | null;
  login: (session: Session) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    const stored = localStorage.getItem("equigrid-session");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem("equigrid-session", JSON.stringify(session));
    } else {
      localStorage.removeItem("equigrid-session");
    }
  }, [session]);

  const login = (newSession: Session) => {
    setSession(newSession);
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, isAuthenticated: !!session }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
