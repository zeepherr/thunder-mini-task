"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthService } from "../services/AuthService";
import type { AuthUser } from "../services/AuthService";

type AuthContextValue = {
  configured: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  authService: AuthService;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const authService = useMemo(() => new AuthService(), []);

  useEffect(() => {
    let active = true;
    let isRestoring = false;

    async function restoreSession() {
      if (isRestoring) return;
      isRestoring = true;
      try {
        const session = await authService.restoreSession();
        if (!active) return;
        setConfigured(session.configured);
        setUser(session.user);
      } catch {
        if (!active) return;
        setConfigured(true);
        setUser(null);
      } finally {
        isRestoring = false;
        if (active) setIsLoading(false);
      }
    }

    const unsubscribe = authService.subscribe(() => void restoreSession());
    const handleFocus = () => void restoreSession();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void restoreSession();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    void restoreSession();

    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [authService]);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured,
      isLoading,
      user,
      authService,
    }),
    [authService, configured, isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
