"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";

export function TaskLoadingState() {
  return (
    <section className="space-y-4" aria-busy="true" aria-label="Loading task list">
      <p className="flex min-h-9 items-center gap-2.5 text-sm font-semibold text-foreground" role="status">
        <span className="grid size-8 place-items-center rounded-full bg-accent text-primary">
          <AppIcon name="retry" className="size-4 animate-spin motion-reduce:animate-none" />
        </span>
        <span>Loading your tasks…</span>
      </p>
      <div className="grid grid-cols-1 gap-3 min-[701px]:grid-cols-2 min-[701px]:gap-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <TaskCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

function TaskCardSkeleton() {
  return (
    <article className="flex min-h-[152px] flex-col justify-between gap-5 rounded-2xl border border-border bg-card p-5 max-[700px]:min-h-[146px] max-[380px]:p-4">
      <div className="space-y-3">
        <span className="block h-5 w-[54%] animate-pulse rounded-md bg-t1-gray-100 motion-reduce:animate-none" />
        <div className="space-y-2">
          <span className="block h-3.5 w-full animate-pulse rounded-md bg-t1-gray-100 motion-reduce:animate-none" />
          <span className="block h-3.5 w-[72%] animate-pulse rounded-md bg-t1-gray-100 motion-reduce:animate-none" />
        </div>
        <span className="block h-3 w-[28%] animate-pulse rounded-md bg-t1-gray-100 motion-reduce:animate-none" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="h-8 w-[92px] animate-pulse rounded-full bg-t1-gray-100 motion-reduce:animate-none" />
        <div className="flex gap-3">
          <span className="h-9 w-[58px] animate-pulse rounded-lg bg-t1-gray-100 motion-reduce:animate-none" />
          <span className="h-9 w-[64px] animate-pulse rounded-lg bg-t1-gray-100 motion-reduce:animate-none" />
        </div>
      </div>
    </article>
  );
}

export function TaskEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <section
      className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center max-[600px]:min-h-[330px] max-[600px]:px-5 md:min-h-[400px]"
      aria-labelledby="empty-title"
    >
      <span className="grid size-[72px] place-items-center rounded-full bg-accent text-primary ring-8 ring-accent/40">
        <AppIcon name="empty" className="size-9" />
      </span>
      <h2 className="mt-7 max-w-[34ch] text-xl font-extrabold leading-[1.4] text-foreground" id="empty-title">
        Your list is clear
      </h2>
      <p className="mt-2 max-w-[42ch] text-sm leading-6 text-t1-gray-600">
        Add a task to capture your next step and keep your work moving.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        Create a task
      </Button>
    </section>
  );
}

export function TaskLoadError({ onRetry }: { onRetry: () => Promise<void> }) {
  return (
    <section
      className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-t1-red-100 bg-card px-6 py-10 text-center max-[600px]:min-h-[320px] max-[600px]:px-5"
      role="alert"
      aria-labelledby="task-load-error-title"
    >
      <span className="grid size-16 place-items-center rounded-full bg-error-muted text-t1-red-700">
        <AppIcon name="unavailable" className="size-8" />
      </span>
      <h2 className="mt-6 max-w-[34ch] text-xl font-extrabold leading-[1.4] text-foreground" id="task-load-error-title">
        We couldn’t load your tasks
      </h2>
      <p className="mt-2 max-w-[46ch] text-sm leading-6 text-t1-gray-600">
        Your saved tasks are unchanged. Check your connection, then try loading them again.
      </p>
      <Button className="mt-6" onClick={() => void onRetry()}>
        <AppIcon name="retry" className="size-[18px]" />
        <span>Try again</span>
      </Button>
    </section>
  );
}

export function NoMatchingTasks({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <section
      className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-10 text-center max-[600px]:min-h-[290px] max-[600px]:px-5"
      aria-labelledby="no-results-title"
    >
      <span className="grid size-12 place-items-center rounded-full bg-secondary text-t1-gray-600">
        <AppIcon name="search" className="size-5" />
      </span>
      <h2 className="mt-5 max-w-[34ch] text-lg font-extrabold leading-7 text-foreground" id="no-results-title">
        No tasks match your filters
      </h2>
      <p className="mt-1.5 max-w-[42ch] text-sm leading-6 text-t1-gray-600">
        Try a different search or status, or clear your filters to see every task.
      </p>
      <Button variant="secondary" className="mt-5" onClick={onClearFilters}>
        Clear filters
      </Button>
    </section>
  );
}
