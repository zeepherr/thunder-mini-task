-- Rollback for 001_create_tasks.sql.
-- Remove only the phase-owned table; do not cascade into unrelated objects.

DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

DROP TABLE IF EXISTS public.tasks;
