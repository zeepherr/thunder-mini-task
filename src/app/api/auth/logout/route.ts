import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth/session-cookies";
import { coreApiFetch } from "@/lib/core-api";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("to_at")?.value;
  const refreshToken = cookieStore.get("to_rt")?.value;

  if (accessToken && refreshToken) {
    try {
      await coreApiFetch("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
      });
    } catch {
      // Local cookies still need to be cleared when the auth API is unavailable.
    }
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
