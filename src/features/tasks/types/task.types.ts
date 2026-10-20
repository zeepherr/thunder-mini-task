export const TASK_STATUSES = ["Todo", "Doing", "Done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskStatusFilter = "All" | TaskStatus;

export type Task = {
  id: string;
  title: string;
  details: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type TaskWriteInput = {
  title: string;
  details: string;
  status: TaskStatus;
};

export type TaskUpdateInput = Partial<TaskWriteInput>;
