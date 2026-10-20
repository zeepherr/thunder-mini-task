"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { TASK_STATUSES } from "../types/task.types";
import type { TaskStatusFilter } from "../types/task.types";

type TaskToolbarProps = {
  counts: Record<TaskStatusFilter, number>;
  isLoading: boolean;
  showCounts: boolean;
  search: string;
  statusFilter: TaskStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: TaskStatusFilter) => void;
};

const filters: TaskStatusFilter[] = ["All", ...TASK_STATUSES];

export function TaskToolbar({
  counts,
  isLoading,
  showCounts,
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: TaskToolbarProps) {
  if (isLoading) {
    return (
      <div className="mb-5 flex items-center justify-between gap-4 max-[700px]:flex-col max-[700px]:items-stretch max-[700px]:gap-3" aria-hidden="true">
        <span className="h-10 w-[min(340px,100%)] animate-pulse rounded-xl bg-t1-gray-100 motion-reduce:animate-none" />
        <span className="h-10 w-[328px] animate-pulse rounded-xl bg-t1-gray-100 max-[700px]:w-full motion-reduce:animate-none" />
      </div>
    );
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-4 max-[700px]:flex-col max-[700px]:items-stretch max-[700px]:gap-3">
      <label className="flex min-h-12 w-[min(340px,100%)] items-center gap-2 rounded-xl border border-border bg-card px-3 text-t1-gray-500 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 max-[700px]:w-full">
        <AppIcon name="search" className="size-[19px]" />
        <input
          className="w-full min-w-0 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-t1-gray-500"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />
      </label>
      <div className="flex min-h-12 items-center gap-1 rounded-xl bg-secondary p-1 max-[700px]:w-full" role="group" aria-label="Filter tasks by status">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={statusFilter === filter ? "secondary" : "quiet"}
            size="filter"
            className={`min-w-0 flex-1 whitespace-nowrap rounded-lg ${statusFilter === filter ? "text-primary" : "text-t1-gray-500"}`}
            aria-pressed={statusFilter === filter}
            onClick={() => onStatusChange(filter)}
          >
            <span>{filter}</span>
            {showCounts ? <span className="text-xs font-semibold">{counts[filter]}</span> : null}
          </Button>
        ))}
      </div>
    </div>
  );
}
