"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { AuthService } from "../services/AuthService";

type AuthContextValue = {
  configured: boolean;
  isLoading: boolean;
  user: User | null;
  authService: AuthService | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const configured = isSupabaseConfigured();
  const authService = useMemo(
    () => (configured ? new AuthService(getSupabaseBrowserClient()) : null),
    [configured],
  );

  useEffect(() => {
    if (!authService) {
      setIsLoading(false);
      return;
    }

    let active = true;
    const unsubscribe = authService.subscribe((nextUser) => {
      if (active) {
        setUser(nextUser);
        setIsLoading(false);
      }
    });

    void authService
      .restoreUser()
      .then((restoredUser) => {
        if (!active) return;
        setUser(restoredUser);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
      unsubscribe();
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
