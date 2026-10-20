"use client";

import type { ReactNode } from "react";
import { AuthForm } from "./AuthForm";
import { useAuth } from "../providers/AuthProvider";

export function AuthGate({ children }: { children: ReactNode }) {
  const { configured, isLoading, user, authService } = useAuth();

  if (!configured) {
    return (
      <main className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-background px-5 py-10">
        <section className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-border bg-card p-8 shadow-[0_4px_16px_rgb(17_24_39_/_0.02)] max-[600px]:p-6" aria-labelledby="setup-title">
          <h1 className="m-0 text-[22px] font-extrabold leading-[1.4] text-foreground" id="setup-title">Connect your Supabase project</h1>
          <p className="m-0 break-all text-sm leading-[1.5] text-t1-gray-500">
            Add <code>SUPABASE_URL</code>, <code>SUPABASE_ANON_KEY</code>,
            <code>CORE_API_URL</code>, and <code>CORE_API_KEY</code> to
            <code className="text-xs">.env.local</code>, then restart the development server. Keep
            these values server-side; never use a service-role key.
          </p>
        </section>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-svh w-full items-center justify-center bg-background px-5 py-10" aria-busy="true">
        <p className="m-0 text-sm text-t1-gray-500" role="status">
          Restoring your session…
        </p>
      </main>
    );
  }

  if (!user) return <AuthForm authService={authService} />;

  return children;
}
