"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import type { Task, TaskStatus } from "../types/task.types";
import { TaskStatusSelect } from "./TaskStatusSelect";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
};

function formatUpdatedAt(value: string) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Updated recently";

  const elapsedMinutes = Math.floor((Date.now() - timestamp) / 60_000);
  if (elapsedMinutes < 1) return "Just now";

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (elapsedMinutes < 60) return formatter.format(-elapsedMinutes, "minute");

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return formatter.format(-elapsedHours, "hour");

  const elapsedDays = Math.floor(elapsedHours / 24);
  return formatter.format(-elapsedDays, "day");
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <article className="flex min-h-36 min-w-0 flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 max-[380px]:p-4">
      <div>
        <h2 className="m-0 break-words text-base font-extrabold leading-6 text-foreground">{task.title}</h2>
        {task.details ? <p className="mt-1 break-words text-sm leading-5 text-t1-gray-500">{task.details}</p> : null}
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] leading-4 text-t1-gray-500">
          <AppIcon name="clock" className="size-[13px]" />
          <span>{formatUpdatedAt(task.updatedAt)}</span>
        </p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <TaskStatusSelect
          status={task.status}
          taskTitle={task.title}
          onChange={(status) => onStatusChange(task.id, status)}
        />
        <div className="flex items-center gap-4 max-[380px]:gap-2.5">
          <Button
            variant="quiet"
            size="action"
            className="text-foreground hover:text-primary"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
          >
            <AppIcon name="edit" className="size-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="quiet"
            size="action"
            className="text-foreground hover:text-primary"
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
          >
            <AppIcon name="delete" className="size-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
