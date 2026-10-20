"use client";

import { useMemo, useState } from "react";
import { WorkspaceHeader } from "@/components/layout/WorkspaceHeader";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth";
import { useTasks } from "../hooks/useTasks";
import type {
  Task,
  TaskStatus,
  TaskStatusFilter,
  TaskWriteInput,
} from "../types/task.types";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { TaskFormDialog } from "./TaskFormDialog";
import { TaskList } from "./TaskList";
import { TaskToolbar } from "./TaskToolbar";

export function TaskBoard() {
  const { user, authService } = useAuth();
  const {
    tasks,
    isLoading,
    hasLoadError,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("All");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const [actionError, setActionError] = useState("");

  const taskCounts = useMemo(() => ({
    All: tasks.length,
    Todo: tasks.filter((task) => task.status === "Todo").length,
    Doing: tasks.filter((task) => task.status === "Doing").length,
    Done: tasks.filter((task) => task.status === "Done").length,
  }), [tasks]);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesSearch =
        !query || `${task.title} ${task.details ?? ""}`.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, tasks]);

  function openCreateForm() {
    setEditingTask(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingTask(null);
  }

  async function saveTask(input: TaskWriteInput) {
    if (editingTask) {
      await updateTask(editingTask.id, input);
      return;
    }
    await createTask(input);
  }

  async function changeTaskStatus(id: string, status: TaskStatus) {
    setActionError("");
    try {
      await updateTask(id, { status });
    } catch {
      setActionError("We couldn’t update that task. Please try again.");
      throw new Error("Task status update failed.");
    }
  }

  async function confirmDelete() {
    if (!deletingTask) return;
    await deleteTask(deletingTask.id);
  }

  async function signOut() {
    setIsSigningOut(true);
    setSignOutError("");
    try {
      await authService.signOut();
    } catch {
      setSignOutError("We couldn’t sign you out. Check your connection and try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="min-h-svh bg-background">
      <WorkspaceHeader
        email={user?.email}
        isSigningOut={isSigningOut}
        onSignOut={signOut}
      />
      <main className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-10 max-[700px]:pt-11 md:px-8 lg:px-16">
        <header className="mb-6 flex items-center justify-between gap-6 max-[700px]:flex-col max-[700px]:items-stretch max-[700px]:gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="m-0 text-[30px] font-extrabold leading-[1.35] tracking-[-0.025em] text-foreground max-[700px]:text-[26px]">My Work List</h1>
              {!isLoading && !hasLoadError ? (
                <span className="whitespace-nowrap rounded-full bg-secondary px-2.5 py-1 text-xs font-bold leading-5 text-t1-gray-500">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 text-sm leading-5 text-t1-gray-500 max-[700px]:mt-2">A little focus. A lot of progress.</p>
          </div>
          {isLoading ? (
            <span className="h-11 w-[104px] animate-pulse rounded-xl bg-t1-gray-100 max-[700px]:w-full motion-reduce:animate-none" aria-hidden="true" />
          ) : hasLoadError ? null : (
            <Button className="max-[700px]:w-full" onClick={openCreateForm}>
              + New Task
            </Button>
          )}
        </header>

        {signOutError ? <p className="mb-4 rounded-xl bg-error-muted px-3.5 py-3 text-[13px] leading-5 text-error" role="alert">{signOutError}</p> : null}
        {actionError ? <p className="mb-4 rounded-xl bg-error-muted px-3.5 py-3 text-[13px] leading-5 text-error" role="alert">{actionError}</p> : null}

        {hasLoadError ? null : (
          <TaskToolbar
            counts={taskCounts}
            isLoading={isLoading}
            showCounts
            search={search}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
          />
        )}
        <TaskList
          hasLoadError={hasLoadError}
          isLoading={isLoading}
          tasks={visibleTasks}
          hasTasks={tasks.length > 0}
          onCreate={openCreateForm}
          onEdit={(task) => {
            setEditingTask(task);
            setIsFormOpen(true);
          }}
          onDelete={setDeletingTask}
          onRetry={loadTasks}
          onStatusChange={changeTaskStatus}
          onClearFilters={() => {
            setSearch("");
            setStatusFilter("All");
          }}
        />
      </main>

      <TaskFormDialog
        open={isFormOpen}
        task={editingTask}
        onClose={closeForm}
        onSave={saveTask}
      />
      <DeleteTaskDialog
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
