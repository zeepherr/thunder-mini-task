import { NextResponse } from "next/server";
import { z } from "zod";
import { coreApiFetch, readCoreApiData } from "@/lib/core-api";
import { setAuthCookies, type ApiAuthSession } from "@/lib/auth/session-cookies";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

type LoginResult = {
  session: ApiAuthSession;
  user: { id: string; email: string | null };
};

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  try {
    const upstream = await coreApiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    const result = await readCoreApiData<LoginResult>(upstream);
    const response = NextResponse.json({ user: result.user });
    setAuthCookies(response, result.session);
    return response;
  } catch (error) {
    const status = typeof error === "object" && error && "status" in error
      ? Number(error.status)
      : 503;
    const message = status === 401
      ? "Invalid email or password."
      : status === 400
        ? "Enter a valid email and password."
        : "Authentication service is unavailable. Try again.";
    return NextResponse.json({ error: message }, { status: status >= 400 && status < 500 ? status : 503 });
  }
}
