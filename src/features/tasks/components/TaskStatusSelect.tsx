"use client";

import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import { AppIcon } from "@/components/ui/AppIcon";
import { TASK_STATUSES } from "../types/task.types";
import type { TaskStatus } from "../types/task.types";

const statusIcons: Record<TaskStatus, "todo" | "inProgress" | "done"> = {
  Todo: "todo",
  Doing: "inProgress",
  Done: "done",
};

const statusClasses: Record<TaskStatus, string> = {
  Todo: "bg-info-muted text-info",
  Doing: "bg-in-progress-muted text-in-progress",
  Done: "bg-success-muted text-success",
};

type TaskStatusSelectProps = {
  status: TaskStatus;
  taskTitle: string;
  onChange: (status: TaskStatus) => Promise<void>;
};

export function TaskStatusSelect({
  status,
  taskTitle,
  onChange,
}: TaskStatusSelectProps) {
  const [isChanging, setIsChanging] = useState(false);

  async function handleChange(value: string) {
    if (!TASK_STATUSES.includes(value as TaskStatus) || value === status) return;
    setIsChanging(true);
    try {
      await onChange(value as TaskStatus);
    } catch {
      // The board reports the failure while the controlled select keeps its prior value.
    } finally {
      setIsChanging(false);
    }
  }

  return (
    <Select.Root
      value={status}
      onValueChange={(value) => void handleChange(value)}
      disabled={isChanging}
    >
      <Select.Trigger
        aria-label={`Change status for ${taskTitle}`}
        className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-bold leading-5 outline-none transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60 ${statusClasses[status]}`}
      >
        <AppIcon name={statusIcons[status]} className="size-4" />
        <Select.Value />
        <Select.Icon aria-hidden="true">
          <AppIcon name="chevronDown" className="size-3.5" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          side="bottom"
          sideOffset={6}
          collisionPadding={8}
          className="z-50 max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-card p-1 text-foreground shadow-lg outline-none"
        >
          <Select.Viewport>
            {TASK_STATUSES.map((option) => (
              <Select.Item
                key={option}
                value={option}
                className="relative flex min-h-9 cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 pr-9 text-sm font-medium outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <AppIcon name={statusIcons[option]} className="size-4" />
                <Select.ItemText>{option}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-2.5 inline-flex items-center">
                  <AppIcon name="check" className="size-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
