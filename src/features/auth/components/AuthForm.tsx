"use client";

import { EyeOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import type { AuthService } from "../services/AuthService";

type AuthMode = "signin" | "signup";

export function AuthForm({ authService }: { authService: AuthService }) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        await authService.signIn(email, password);
      } else {
        const { hasActiveSession } = await authService.signUp(email, password);
        if (!hasActiveSession) {
          setNotice(
            "Your account request was received, but Supabase returned no session. Check that email confirmations are disabled in your Supabase Auth settings.",
          );
        }
      }
    } catch {
      if (mode === "signin") {
        setError("Invalid email or password");
      } else {
        setError(
          "We couldn’t create your account. Check your details and try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setNotice("");
  }

  const isSignIn = mode === "signin";

  return (
    <main
      className={`auth-layout auth-layout--${mode}${error ? " has-error" : ""}`}
    >
      {error && isSignIn ? (
        <Image
          className="auth-error-mark"
          src="/figma-auth/error-mark.svg"
          alt=""
          width={100}
          height={100}
          priority
        />
      ) : null}
      <section className="auth-card" aria-labelledby="auth-title">
        <header className="auth-header">
          <div className="auth-brand">
            <span className="auth-brand-mark" aria-hidden="true">
              <Image src="/figma-auth/zap.svg" alt="" width={21} height={21} />
            </span>
            <span className="auth-brand-name">Thunder / My Work List</span>
          </div>
          <div className="auth-intro">
            <h1 id="auth-title">
              {isSignIn ? "Welcome back." : "Make room for progress."}
            </h1>
            <p>
              {isSignIn
                ? "Sign in to pick up where you left off."
                : "Create your account and bring your tasks together."}
            </p>
          </div>
        </header>

        <div className="auth-tabs" role="tablist" aria-label="Account access">
          <button
            type="button"
            className={`auth-tab${isSignIn ? " is-active" : ""}`}
            role="tab"
            aria-selected={isSignIn}
            onClick={() => changeMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab${!isSignIn ? " is-active" : ""}`}
            role="tab"
            aria-selected={!isSignIn}
            onClick={() => changeMode("signup")}
          >
            Create Account
          </button>
        </div>

        {error ? (
          <div className="auth-error" role="alert">
            {isSignIn ? (
              <Image
                src="/figma-auth/circle-alert.svg"
                alt=""
                width={19}
                height={19}
              />
            ) : null}
            <span>{error}</span>
          </div>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            {!isSignIn ? (
              <p className="auth-helper">
                Use the email you want to sign in with.
              </p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignIn ? "current-password" : "new-password"}
                placeholder={
                  isSignIn ? "Enter your password" : "Create a password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={4}
                required
              />
              <button
                className="password-visibility"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOutlined aria-hidden="true" />
                ) : (
                  <Image
                    src="/figma-auth/eye-off.svg"
                    alt=""
                    width={19}
                    height={19}
                  />
                )}
              </button>
            </div>
            {!isSignIn ? (
              <p className="auth-helper">Use at least 8 characters.</p>
            ) : null}
          </div>

          {notice ? (
            <p className="auth-notice" role="status">
              {notice}
            </p>
          ) : null}

          <div className="auth-guidance">
            <Image src="/figma-auth/info.svg" alt="" width={16} height={16} />
            <span>No email verification needed</span>
          </div>

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait…" : isSignIn ? "Sign In" : "Register"}
          </button>
        </form>
      </section>
      <p className="auth-tagline">Your tasks. Your pace. Your space.</p>
    </main>
  );
}
