-- My Work List task schema and owner-isolation policies.

CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL DEFAULT auth.uid()
        REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL CHECK (btrim(title) <> ''),
    details text DEFAULT '',
    status text NOT NULL DEFAULT 'Todo'
        CHECK (status IN ('Todo', 'Doing', 'Done')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.tasks IS
    'Personal tasks. Row access is restricted to the owning authenticated user by RLS.';
COMMENT ON COLUMN public.tasks.user_id IS
    'Owner from auth.users; inserts default to the current authenticated user.';
COMMENT ON COLUMN public.tasks.title IS
    'Required non-empty task title.';
COMMENT ON COLUMN public.tasks.details IS
    'Optional task details.';
COMMENT ON COLUMN public.tasks.status IS
    'Task status; valid values are Todo, Doing, and Done.';
COMMENT ON COLUMN public.tasks.updated_at IS
    'Timestamp initialized on insert; updates must supply a new value until an update trigger is specified.';

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Authenticated users receive table privileges; RLS limits rows to the owner.
REVOKE ALL ON TABLE public.tasks FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO authenticated;

CREATE POLICY "Users can view their own tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
ON public.tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
ON public.tasks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
