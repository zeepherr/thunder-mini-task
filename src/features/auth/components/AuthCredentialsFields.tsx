"use client";

import { EyeOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";

type AuthCredentialsFieldsProps = {
  isSignIn: boolean;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
};

const inputClasses = "h-12 w-full rounded-xl border border-border bg-white px-3.5 text-sm leading-5 text-foreground placeholder:text-t1-gray-500 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

export function AuthCredentialsFields({
  isSignIn,
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: AuthCredentialsFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="flex min-w-0 flex-col gap-2">
        <label className="text-sm font-bold leading-5 text-foreground" htmlFor="email">Email</label>
        <input
          className={inputClasses}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          required
        />
        {!isSignIn ? (
          <p className="m-0 text-xs leading-[1.5] text-t1-gray-500">
            Use the email you want to sign in with.
          </p>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <label className="text-sm font-bold leading-5 text-foreground" htmlFor="password">Password</label>
        <div className="relative">
          <input
            className={`${inputClasses} pr-12`}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isSignIn ? "current-password" : "new-password"}
            placeholder={isSignIn ? "Enter your password" : "Create a password"}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            minLength={6}
            required
          />
          <button
            className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded bg-transparent text-t1-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOutlined aria-hidden="true" />
            ) : (
              <Image src="/figma-auth/eye-off.svg" alt="" width={19} height={19} />
            )}
          </button>
        </div>
        {!isSignIn ? (
          <p className="m-0 text-xs leading-[1.5] text-t1-gray-500">
            Use at least 6 characters.
          </p>
        ) : null}
      </div>
    </>
  );
}
