"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import type { AuthService } from "../services/AuthService";
import { AuthCredentialsFields } from "./AuthCredentialsFields";

type AuthMode = "signin" | "signup";

const layoutClasses = "flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-background px-5 pb-[calc(40px+env(safe-area-inset-bottom,0px))] pt-[calc(40px+env(safe-area-inset-top,0px))] max-[600px]:justify-start";
const mobileTopSpacing = {
  signin: "max-[600px]:pt-[calc(80px+env(safe-area-inset-top,0px))]",
  signup: "max-[600px]:pt-[calc(48px+env(safe-area-inset-top,0px))]",
  signinError: "max-[600px]:pt-[calc(24px+env(safe-area-inset-top,0px))]",
} as const;

export function AuthForm({ authService }: { authService: AuthService }) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <main className={`${layoutClasses} ${isSignIn && error ? mobileTopSpacing.signinError : mobileTopSpacing[mode]}`}>
      {error && isSignIn ? (
        <Image
          className="block shrink-0"
          src="/figma-auth/error-mark.svg"
          alt=""
          width={100}
          height={100}
          priority
        />
      ) : null}
      <section className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-border bg-card p-8 shadow-[0_4px_16px_rgb(17_24_39_/_0.02)] max-[600px]:p-6" aria-labelledby="auth-title">
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-3 text-foreground">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary" aria-hidden="true">
              <Image src="/figma-auth/zap.svg" alt="" width={21} height={21} />
            </span>
            <span className="text-base font-extrabold leading-6">Thunder / My Work List</span>
          </div>
          <div>
            <h1 className="m-0 text-[28px] font-extrabold leading-[1.35] tracking-[-0.025em] text-foreground" id="auth-title">
              {isSignIn ? "Welcome back." : "Make room for progress."}
            </h1>
            <p className="mt-2 text-sm leading-[1.5] text-t1-gray-500">
              {isSignIn
                ? "Sign in to pick up where you left off."
                : "Create your account and bring your tasks together."}
            </p>
          </div>
        </header>

        <div className="flex min-h-12 gap-1 rounded-xl bg-secondary p-1" role="tablist" aria-label="Account access">
          <button
            type="button"
            className={`min-h-10 min-w-0 flex-1 rounded-lg border px-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isSignIn ? "border-border bg-white text-primary" : "border-transparent bg-transparent text-t1-gray-500"}`}
            role="tab"
            aria-selected={isSignIn}
            onClick={() => changeMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`min-h-10 min-w-0 flex-1 rounded-lg border px-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${!isSignIn ? "border-border bg-white text-primary" : "border-transparent bg-transparent text-t1-gray-500"}`}
            role="tab"
            aria-selected={!isSignIn}
            onClick={() => changeMode("signup")}
          >
            Create Account
          </button>
        </div>

        {error ? (
          <div className="flex items-center gap-2.5 rounded-xl bg-t1-red-100 p-3 text-sm font-semibold leading-5 text-t1-red-700" role="alert">
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

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <AuthCredentialsFields
            isSignIn={isSignIn}
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
          />

          {notice ? (
            <p className="m-0 text-[13px] leading-5 text-t1-red-700" role="status">
              {notice}
            </p>
          ) : null}

          <div className="flex items-center gap-2 text-[13px] leading-5 text-t1-gray-500">
            <Image src="/figma-auth/info.svg" alt="" width={16} height={16} />
            <span>No email verification needed</span>
          </div>

          <button className="min-h-11 rounded-xl border border-transparent bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-t1-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait…" : isSignIn ? "Sign In" : "Register"}
          </button>
        </form>
      </section>
      <p className="m-0 text-center text-xs leading-5 text-t1-gray-500">Your tasks. Your pace. Your space.</p>
    </main>
  );
}
