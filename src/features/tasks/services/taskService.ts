import { requestApi } from "@/lib/api/request-api";
import type {
  Task,
  TaskStatus,
  TaskUpdateInput,
  TaskWriteInput,
} from "../types/task.types";

type TaskApiRecord = {
  id: string;
  title: string;
  details: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

function toTask(record: TaskApiRecord): Task {
  return {
    id: record.id,
    title: record.title,
    details: record.details,
    status: record.status,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export async function getTasks(): Promise<Task[]> {
  const records = await requestApi<TaskApiRecord[]>("GET", "tasks");
  return records.map(toTask);
}

export async function createTask(input: TaskWriteInput): Promise<Task> {
  const record = await requestApi<TaskApiRecord>("POST", "tasks", input);
  return toTask(record);
}

export async function updateTask(
  id: string,
  input: TaskUpdateInput,
): Promise<Task> {
  const record = await requestApi<TaskApiRecord>(
    "PATCH",
    `tasks/${encodeURIComponent(id)}`,
    input,
  );
  return toTask(record);
}

export async function deleteTask(id: string): Promise<void> {
  await requestApi<{ id: string }>(
    "DELETE",
    `tasks/${encodeURIComponent(id)}`,
  );
}
