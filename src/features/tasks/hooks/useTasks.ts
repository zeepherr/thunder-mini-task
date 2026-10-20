"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask as updateTaskRequest,
} from "../services/taskService";
import type {
  Task,
  TaskUpdateInput,
  TaskWriteInput,
} from "../types/task.types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setHasLoadError(false);

    try {
      setTasks(await getTasks());
    } catch {
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  async function create(input: TaskWriteInput) {
    const task = await createTaskRequest(input);
    setTasks((currentTasks) => [task, ...currentTasks]);
  }

  async function update(id: string, input: TaskUpdateInput) {
    const updatedTask = await updateTaskRequest(id, input);
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? updatedTask : task)),
    );
  }

  async function remove(id: string) {
    await deleteTaskRequest(id);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  return {
    tasks,
    isLoading,
    hasLoadError,
    loadTasks,
    createTask: create,
    updateTask: update,
    deleteTask: remove,
  };
}
