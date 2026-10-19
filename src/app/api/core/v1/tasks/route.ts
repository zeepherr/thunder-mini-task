import { z } from "zod";
import { apiHandler, ApiError, getApiAuth, requireAppKey } from "@/lib/api-utils";
import { internalError } from "@/lib/core-api-utils";

const taskStatusSchema = z.enum(["Todo", "Doing", "Done"]);

const createTaskSchema = z
  .object({
    title: z.string().trim().min(1),
    details: z.string().optional().default(""),
    status: taskStatusSchema.optional().default("Todo"),
  })
  .strict();

export async function GET(request: Request) {
  return apiHandler(async () => {
    await requireAppKey(request);
    const { supabase, user } = await getApiAuth(request);
    const { data, error } = await supabase
      .from("tasks")
      .select("id, user_id, title, details, status, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw internalError("Failed to fetch tasks", error);
    return data;
  });
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    await requireAppKey(request);
    const { supabase, user } = await getApiAuth(request);
    const parsed = createTaskSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      throw new ApiError("Task title is required and status must be valid.", 400);
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...parsed.data, user_id: user.id })
      .select("id, user_id, title, details, status, created_at, updated_at")
      .single();

    if (error || !data) throw internalError("Failed to create task", error);
    return data;
  }, 201);
}
