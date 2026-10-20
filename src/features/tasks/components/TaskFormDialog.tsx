"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import type { Task, TaskStatus, TaskWriteInput } from "../types/task.types";
import { TaskStatusPicker } from "./TaskStatusPicker";

type TaskFormDialogProps = {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (input: TaskWriteInput) => Promise<void>;
};

export function TaskFormDialog({ open, task, onClose, onSave }: TaskFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formId = useId();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Todo");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = task !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open) {
      setTitle(task?.title ?? "");
      setDetails(task?.details ?? "");
      setStatus(task?.status ?? "Todo");
      setError("");
      if (dialog && !dialog.open) dialog.showModal();
    } else if (dialog?.open) {
      dialog.close();
    }
  }, [open, task]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Enter a task title before saving.");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      await onSave({ title: trimmedTitle, details, status });
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save this task.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed left-1/2 top-1/2 m-0 max-h-[calc(100dvh-32px)] w-[min(440px,calc(100vw-40px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border-0 bg-card p-6 text-foreground shadow-[0_16px_48px_rgb(17_24_39_/_0.18)] [&::backdrop]:bg-black/40 max-[600px]:rounded-[14px] max-[600px]:p-5"
      aria-labelledby={`${formId}-title`}
      onCancel={(event) => {
        event.preventDefault();
        if (!isSaving) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="m-0 text-xl font-extrabold leading-[1.4] max-[600px]:text-2xl" id={`${formId}-title`}>{isEditing ? "Edit Task" : "Create New Task"}</h2>
          <p className="mt-1 text-xs leading-5 text-t1-gray-500 max-[600px]:text-sm">{isEditing ? "A quick update keeps your work moving." : "Capture what you want to get done."}</p>
        </div>
        <Button variant="quiet" size="compact" className="-mr-1.5 -mt-1.5 grid size-9 shrink-0 place-items-center p-0 text-t1-gray-500" onClick={onClose} aria-label="Close task form" disabled={isSaving}>
          <AppIcon name="close" className="size-5" />
        </Button>
      </div>

      <form id={formId} className="mt-5 flex flex-col gap-[18px] max-[600px]:gap-5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-[13px] font-bold text-foreground max-[600px]:text-sm">
          <span>Task Title <span className="text-t1-red-700">*</span></span>
          <input
            className="h-[42px] w-full min-w-0 rounded-xl border border-border bg-card px-3 text-[13px] font-normal leading-5 text-foreground placeholder:text-t1-gray-500 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 max-[600px]:h-12 max-[600px]:text-sm"
            autoFocus
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Plan next week"
            aria-describedby={error ? `${formId}-error` : undefined}
          />
        </label>

        <label className="flex flex-col gap-2 text-[13px] font-bold text-foreground max-[600px]:text-sm">
          <span>Description</span>
          <textarea
            className="min-h-[90px] w-full min-w-0 resize-y rounded-xl border border-border bg-card px-3 py-2.5 text-[13px] font-normal leading-5 text-foreground placeholder:text-t1-gray-500 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 max-[600px]:min-h-28 max-[600px]:text-sm"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Add a few details (optional)"
            rows={4}
          />
        </label>

        <TaskStatusPicker status={status} onChange={setStatus} />

        {error ? <p className="-mt-1 rounded-lg bg-error-muted px-3 py-2.5 text-xs leading-5 text-error" id={`${formId}-error`} role="alert">{error}</p> : null}

        <div className="flex items-center justify-between gap-4 border-t border-border pt-4 max-[600px]:items-stretch max-[600px]:flex-col">
          <p className="m-0 text-[10px] leading-4 text-t1-gray-500 max-[600px]:text-[11px]">* Required field</p>
          <div className="flex items-center gap-2 max-[600px]:grid max-[600px]:grid-cols-2">
            <Button variant="secondary" size="small" className="max-[600px]:min-h-11 max-[600px]:text-sm" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" size="small" className="max-[600px]:min-h-11 max-[600px]:text-sm" disabled={isSaving}>
              {isSaving ? "Saving…" : "Save Task"}
            </Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
