import { z } from "zod";
import { apiHandler, ApiError, requireAppKey } from "@/lib/api-utils";
import { createAnonClient } from "@/utils/supabase/server";

const refreshSchema = z.object({ refresh_token: z.string().min(1) });

export async function POST(request: Request) {
  return apiHandler(async () => {
    await requireAppKey(request);
    const parsed = refreshSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new ApiError("Unauthorized.", 401);

    const supabase = createAnonClient();
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: parsed.data.refresh_token,
    });
    if (error || !data.session || !data.user) throw new ApiError("Unauthorized.", 401);

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
