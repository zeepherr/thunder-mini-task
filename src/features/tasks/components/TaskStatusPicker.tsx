"use client";

import { useId } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { TASK_STATUSES } from "../types/task.types";
import type { TaskStatus } from "../types/task.types";

type TaskStatusPickerProps = {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
};

const statusIcons: Record<TaskStatus, "todo" | "inProgress" | "done"> = {
  Todo: "todo",
  Doing: "inProgress",
  Done: "done",
};

const selectedStatusClasses: Record<TaskStatus, string> = {
  Todo: "border-2 border-primary bg-accent text-primary",
  Doing: "border-2 border-in-progress bg-in-progress-muted text-in-progress",
  Done: "border-2 border-success bg-success-muted text-success",
};

export function TaskStatusPicker({ status, onChange }: TaskStatusPickerProps) {
  const groupId = useId();

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2 p-0 text-[13px] font-bold text-foreground">Status</legend>
      <div className="grid grid-cols-3 gap-2">
        {TASK_STATUSES.map((option) => (
          <label className={`relative flex min-h-11 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-border bg-card px-2 text-xs font-semibold text-foreground focus-within:outline-2 focus-within:outline-ring focus-within:outline-offset-2 max-[600px]:px-1 max-[600px]:text-[13px] ${status === option ? selectedStatusClasses[option] : ""}`} key={option}>
            <input
              className="sr-only"
              type="radio"
              name={`${groupId}-status`}
              value={option}
              checked={status === option}
              onChange={() => onChange(option)}
            />
            <AppIcon name={status === option ? "selected" : statusIcons[option]} className="size-4" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
