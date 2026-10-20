import { apiHandler, ApiError, getApiAuth, requireAppKey } from "@/lib/api-utils";
import { internalError, requireUuid } from "@/lib/core-api-utils";
import { updateTaskSchema } from "../schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  return apiHandler(async () => {
    await requireAppKey(request);
    const { supabase, user } = await getApiAuth(request);
    const { id: rawId } = await context.params;
    const id = requireUuid(rawId, "task id");
    const parsed = updateTaskSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new ApiError("Provide at least one valid task field.", 400);

    const { data, error } = await supabase
      .from("tasks")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, user_id, title, details, status, created_at, updated_at")
      .maybeSingle();

    if (error) throw internalError("Failed to update task", error);
    if (!data) throw new ApiError("Task not found.", 404);
    return data;
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  return apiHandler(async () => {
    await requireAppKey(request);
    const { supabase, user } = await getApiAuth(request);
    const { id: rawId } = await context.params;
    const id = requireUuid(rawId, "task id");
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) throw internalError("Failed to delete task", error);
    if (!data) throw new ApiError("Task not found.", 404);
    return { id: data.id };
  });
}
