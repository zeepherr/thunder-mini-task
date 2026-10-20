import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { serverEnv } from "@/config/server-env";
import { createUserClient } from "@/utils/supabase/server";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiAuth = {
  accessToken: string;
  user: { id: string; email?: string };
  supabase: ReturnType<typeof createUserClient>;
};

export async function requireAppKey(request: Request): Promise<void> {
  if (!serverEnv.coreApiKey) {
    throw new ApiError("Core API is not configured.", 500);
  }

  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== serverEnv.coreApiKey) {
    throw new ApiError("Unauthorized", 401);
  }
}

export async function getApiAuth(request: Request): Promise<ApiAuth> {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken) throw new ApiError("Unauthorized", 401);

  const supabase = createUserClient(accessToken);
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) throw new ApiError("Unauthorized", 401);

  return {
    accessToken,
    user: { id: data.user.id, email: data.user.email },
    supabase,
  };
}

export async function apiHandler<T>(
  action: () => Promise<T>,
  successStatus = 200,
): Promise<NextResponse> {
  try {
    const data = await action();
    return NextResponse.json({ success: true, data }, { status: successStatus });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input." },
        { status: 400 },
      );
    }

    console.error("Core API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
