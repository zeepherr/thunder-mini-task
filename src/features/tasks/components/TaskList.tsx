"use client";

import type { Task, TaskStatus } from "../types/task.types";
import { TaskCard } from "./TaskCard";
import {
  NoMatchingTasks,
  TaskEmptyState,
  TaskLoadError,
  TaskLoadingState,
} from "./TaskListStates";

type TaskListProps = {
  hasLoadError: boolean;
  isLoading: boolean;
  tasks: Task[];
  hasTasks: boolean;
  onCreate: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onRetry: () => Promise<void>;
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
  onClearFilters: () => void;
};

export function TaskList({
  hasLoadError,
  isLoading,
  tasks,
  hasTasks,
  onCreate,
  onEdit,
  onDelete,
  onRetry,
  onStatusChange,
  onClearFilters,
}: TaskListProps) {
  if (isLoading) return <TaskLoadingState />;
  if (hasLoadError) return <TaskLoadError onRetry={onRetry} />;
  if (!hasTasks) return <TaskEmptyState onCreate={onCreate} />;
  if (tasks.length === 0) return <NoMatchingTasks onClearFilters={onClearFilters} />;

  return (
    <>
      <div className="grid grid-cols-1 gap-3 min-[701px]:grid-cols-2 min-[701px]:gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
      <p className="mt-5 text-[11px] leading-4 text-t1-gray-500" aria-live="polite">
        Showing {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
      </p>
    </>
  );
}

