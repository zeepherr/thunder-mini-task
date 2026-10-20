import { ApiError, apiHandler, requireAppKey } from "@/lib/api-utils";
import { createAnonClient } from "@/utils/supabase/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  return apiHandler(async () => {
    await requireAppKey(request);
    const parsed = registerSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) {
      throw new ApiError(
        "Enter a valid email and a password with at least 6 characters.",
        400,
      );
    }

    const supabase = createAnonClient();
    const { data, error } = await supabase.auth.signUp(parsed.data);
    if (error) {
      const isDuplicate =
        error.code === "user_already_exists" ||
        error.message.toLowerCase().includes("already registered");
      throw new ApiError(
        isDuplicate
          ? "An account with this email already exists."
          : "Could not create your account.",
        isDuplicate ? 409 : 400,
      );
    }

    return {
      hasActiveSession: data.session !== null,
      session: data.session
        ? {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at ?? null,
          }
        : null,
      user: data.user
        ? { id: data.user.id, email: data.user.email ?? null }
        : null,
    };
  }, 201);
}
