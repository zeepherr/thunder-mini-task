"use client";

import { useEffect, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import type { Task } from "../types/task.types";

type DeleteTaskDialogProps = {
  task: Task | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteTaskDialog({ task, onClose, onConfirm }: DeleteTaskDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (task) {
      setError("");
      if (dialog && !dialog.open) dialog.showModal();
    } else if (dialog?.open) {
      dialog.close();
    }
  }, [task]);

  async function handleConfirm() {
    setError("");
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete this task.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed left-1/2 top-1/2 m-0 max-h-[calc(100dvh-32px)] w-[min(384px,calc(100vw-40px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border-0 bg-card p-6 text-foreground shadow-[0_16px_48px_rgb(17_24_39_/_0.18)] [&::backdrop]:bg-black/40 max-[600px]:rounded-2xl"
      aria-labelledby="delete-task-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!isDeleting) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="grid size-[42px] place-items-center rounded-full bg-t1-red-100 text-t1-red-500"><AppIcon name="warning" className="size-[26px]" /></div>
      <h2 className="mt-[18px] text-xl font-extrabold leading-7 max-[600px]:mt-6 max-[600px]:text-2xl" id="delete-task-title">Delete Task</h2>
      <p className="mt-2 text-xs leading-5 text-t1-gray-500 max-[600px]:text-sm">Are you sure you want to delete this task? This action cannot be undone.</p>
      {task ? (
        <div className="mt-[18px] flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs leading-5 text-foreground max-[600px]:mt-5 max-[600px]:min-h-[54px] max-[600px]:text-sm">
          <AppIcon name="document" className="size-[19px]" />
          <span className="break-all">{task.title}</span>
        </div>
      ) : null}
      {error ? <p className="mt-3.5 rounded-lg bg-error-muted px-3 py-2.5 text-xs leading-5 text-error" role="alert">{error}</p> : null}
      <div className="mt-6 flex justify-end gap-2 max-[600px]:mt-7 max-[600px]:grid max-[600px]:grid-cols-2">
        <Button variant="secondary" size="small" className="max-[600px]:min-h-12 max-[600px]:text-sm" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" size="small" className="max-[600px]:min-h-12 max-[600px]:text-sm" onClick={() => void handleConfirm()} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </dialog>
  );
}
