import { createContext, useContext, useState, useEffect } from "react";

interface Session {
  userId: number;
  email: string;
  companyName: string;
  role: "operator" | "cloud";
}

interface AuthContextType {
  session: Session | null;
  login: (session: Session) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.authenticated) {
          setSession({
            userId: data.userId,
            email: data.email,
            companyName: data.companyName,
            role: data.role,
          });
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (newSession: Session) => {
    setSession(newSession);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setSession(null);
    } catch (error) {
      console.error("Logout failed:", error);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, isAuthenticated: !!session, isLoading }}>
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
