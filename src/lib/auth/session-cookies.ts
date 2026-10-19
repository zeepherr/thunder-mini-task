import "server-only";

import type { NextResponse } from "next/server";

export type ApiAuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number | null;
};

const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function setAuthCookies(
  response: NextResponse,
  session: ApiAuthSession,
) {
  const secure = process.env.NODE_ENV === "production";
  const accessMaxAge = session.expires_at
    ? Math.max(0, session.expires_at - Math.floor(Date.now() / 1000))
    : 60 * 60;

  response.cookies.set("to_at", session.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: accessMaxAge,
  });
  response.cookies.set("to_rt", session.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

export function clearAuthCookies(response: NextResponse) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
  response.cookies.set("to_at", "", options);
  response.cookies.set("to_rt", "", options);
}
