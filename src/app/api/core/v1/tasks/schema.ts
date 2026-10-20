import { z } from "zod";

const taskStatusSchema = z.enum(["Todo", "Doing", "Done"]);

export const createTaskSchema = z
  .object({
    title: z.string().trim().min(1),
    details: z.string().optional().default(""),
    status: taskStatusSchema.optional().default("Todo"),
  })
  .strict();

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    details: z.string().optional(),
    status: taskStatusSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0);
