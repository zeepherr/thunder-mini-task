"use client";

import Image from "next/image";
import { useState } from "react";
import { AuthForm } from "./AuthForm";
import { useAuth } from "../providers/AuthProvider";

export function AuthGate() {
  const { configured, isLoading, user, authService } = useAuth();
  const [signOutError, setSignOutError] = useState("");

  if (!configured || !authService) {
    return (
      <main className="auth-layout">
        <section className="auth-card setup-card" aria-labelledby="setup-title">
          <h1 id="setup-title">Connect your Supabase project</h1>
          <p>
            Add <code>SUPABASE_URL</code>, <code>SUPABASE_ANON_KEY</code>,
            <code>CORE_API_URL</code>, and <code>CORE_API_KEY</code> to
            <code>.env.local</code>, then restart the development server. Keep
            these values server-side; never use a service-role key.
          </p>
        </section>
      </main>
    );
  }

  const activeAuthService = authService;

  if (isLoading) {
    return (
      <main className="auth-layout" aria-busy="true">
        <p className="auth-loading" role="status">
          Restoring your session…
        </p>
      </main>
    );
  }

  if (!user) return <AuthForm authService={activeAuthService} />;

  async function handleSignOut() {
    setSignOutError("");
    try {
      await activeAuthService.signOut();
    } catch {
      setSignOutError("We couldn’t sign you out. Check your connection and try again.");
    }
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <a className="auth-brand" href="/" aria-label="My Work List home">
          <span className="auth-brand-mark" aria-hidden="true">
            <Image src="/figma-auth/zap.svg" alt="" width={21} height={21} />
          </span>
          <span className="auth-brand-name">Thunder / My Work List</span>
        </a>
        <div className="workspace-account">
          <span className="workspace-email">{user.email}</span>
          <button
            className="workspace-signout"
            type="button"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </header>
      <section className="workspace-welcome" aria-labelledby="workspace-title">
        <h1 id="workspace-title">Welcome back.</h1>
        <p>You’re signed in. Your task workspace will be ready in Phase 4.</p>
        {signOutError ? (
          <p className="workspace-error" role="alert">
            {signOutError}
          </p>
        ) : null}
      </section>
    </main>
  );
}
