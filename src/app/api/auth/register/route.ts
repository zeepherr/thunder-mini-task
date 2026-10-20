import { NextResponse } from "next/server";
import { z } from "zod";
import { coreApiFetch, readCoreApiData } from "@/lib/core-api";
import { setAuthCookies, type ApiAuthSession } from "@/lib/auth/session-cookies";

const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

type RegisterResult = {
  hasActiveSession: boolean;
  session: ApiAuthSession | null;
  user: { id: string; email: string | null } | null;
};

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email and a password with at least 6 characters." },
      { status: 400 },
    );
  }

  try {
    const upstream = await coreApiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    const result = await readCoreApiData<RegisterResult>(upstream);
    const response = NextResponse.json({
      hasActiveSession: result.hasActiveSession,
      user: result.user,
    });
    if (result.hasActiveSession && result.session) {
      setAuthCookies(response, result.session);
    }
    return response;
  } catch (error) {
    const status = typeof error === "object" && error && "status" in error
      ? Number(error.status)
      : 503;
    const message = status === 409
      ? "An account with this email already exists."
      : status === 400
        ? "Enter a valid email and a password with at least 6 characters."
        : "Could not create your account. Try again.";
    return NextResponse.json({ error: message }, { status: status >= 400 && status < 500 ? status : 503 });
  }
}
