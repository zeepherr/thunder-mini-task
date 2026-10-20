import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hasServerApiConfig } from "@/config/server-env";
import { clearAuthCookies, setAuthCookies, type ApiAuthSession } from "@/lib/auth/session-cookies";
import { coreApiFetch, readCoreApiData, CoreApiResponseError } from "@/lib/core-api";

type SessionUser = { id: string; email?: string };
type SessionResult = { user: SessionUser };
type RefreshResult = { session: ApiAuthSession; user: SessionUser };

async function fetchUser(accessToken: string) {
  const response = await coreApiFetch("/session", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return readCoreApiData<SessionResult>(response);
}

export async function GET() {
  if (!hasServerApiConfig()) {
    return NextResponse.json({ configured: false, user: null }, { status: 503 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("to_at")?.value;
  const refreshToken = cookieStore.get("to_rt")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ configured: true, user: null }, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    if (accessToken) {
      try {
        const { user } = await fetchUser(accessToken);
        return NextResponse.json({ configured: true, user }, {
          headers: { "Cache-Control": "no-store" },
        });
      } catch (error) {
        if (!(error instanceof CoreApiResponseError) || error.status !== 401) throw error;
      }
    }

    if (!refreshToken) {
      const response = NextResponse.json({ configured: true, user: null }, {
        headers: { "Cache-Control": "no-store" },
      });
      clearAuthCookies(response);
      return response;
    }

    const refreshResponse = await coreApiFetch("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const refreshed = await readCoreApiData<RefreshResult>(refreshResponse);
    const response = NextResponse.json({ configured: true, user: refreshed.user }, {
      headers: { "Cache-Control": "no-store" },
    });
    setAuthCookies(response, refreshed.session);
    return response;
  } catch (error) {
    if (error instanceof CoreApiResponseError && error.status === 401) {
      const response = NextResponse.json({ configured: true, user: null }, {
        headers: { "Cache-Control": "no-store" },
      });
      clearAuthCookies(response);
      return response;
    }

    return NextResponse.json({ error: "Authentication service is unavailable." }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
