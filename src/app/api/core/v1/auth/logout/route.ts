import { z } from "zod";
import { apiHandler, ApiError, requireAppKey } from "@/lib/api-utils";
import { createAnonClient } from "@/utils/supabase/server";

const logoutSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

export async function POST(request: Request) {
  return apiHandler(async () => {
    await requireAppKey(request);
    const parsed = logoutSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return { signedOut: true };

    const supabase = createAnonClient();
    const { error: sessionError } = await supabase.auth.setSession(parsed.data);
    if (sessionError) return { signedOut: true };

    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw new ApiError("Could not end the session.", 502);
    return { signedOut: true };
  });
}
