import { z } from "zod";
import { apiHandler, ApiError, requireAppKey } from "@/lib/api-utils";
import { createAnonClient } from "@/utils/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  return apiHandler(async () => {
    await requireAppKey(request);
    const parsed = loginSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new ApiError("Invalid email or password.", 400);

    const supabase = createAnonClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error || !data.session) {
      throw new ApiError("Invalid email or password.", 401);
    }

    return {
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at ?? null,
      },
      user: { id: data.user.id, email: data.user.email ?? null },
    };
  });
}
