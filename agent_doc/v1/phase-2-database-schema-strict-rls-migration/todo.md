# Phase 2 — Database Schema & Strict RLS Migration

**Status:** Complete
**Scope source:** [Project specification](../../../spec.md)
**Architecture:** Follow [the architecture guide](../architecture.md); Core API handlers use the anon key and caller JWT, with PostgreSQL RLS as the task-data authorization boundary.

## 1. Detailed Explanation

This phase creates the `public.tasks` table, rejects blank titles, and limits statuses to `Todo`, `Doing`, and `Done`. Row Level Security (RLS) policies ensure each authenticated user can only read, create, update, and delete their own tasks. The migration and rollback SQL are prepared, then applied to the practice Supabase project and checked for data isolation between Account A and Account B.

This phase directly addresses AC-06 and establishes the database security foundation for AC-04, AC-05, and AC-07.

## 2. To Take Action

- [x] Create `supabase/migrations/001_create_tasks.sql` for `public.tasks` with UUID primary key, owner UUID, title, optional details, status, and timestamps.
- [x] Add database constraints: non-empty trimmed title and exact statuses `Todo`, `Doing`, and `Done`.
- [x] Set defaults and cascade task cleanup when an auth user is deleted.
- [x] Enable RLS and add separate authenticated-user policies for SELECT, INSERT, UPDATE, and DELETE.
- [x] Ensure UPDATE policies prevent changing a task's `user_id` to another account.
- [x] Add explanatory SQL comments and `supabase/rollback/001_create_tasks.rollback.sql`.
- [x] Apply `supabase/migrations/001_create_tasks.sql` to the linked practice Supabase project using `npx supabase db push`; migration history confirms local and remote version `001` match.
- [x] Verify isolation with two test accounts: Account B could not read, update, or delete Account A's task, and Account A could not reassign its ownership to B.
- [x] Record the migration and RLS verification outcome in the project documentation.

### Figma references

No Figma frame directly defines the database schema or RLS behavior. The task fields and statuses should remain consistent with the work-list design in [Page 1](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-12726).

### Acceptance criteria

Primary criterion: AC-06. The schema and policies also provide the persistence and access-control foundation for AC-04, AC-05, and AC-07.

## 3. My Concerns / Questions

- **`updated_at` behavior:** The specification sets `DEFAULT now()` for new rows but does not define a trigger to update the timestamp when a row changes. The current migration follows the specification and only sets the default. Should the UI set the timestamp on each edit, or should a database trigger be added?
- **Supabase deployment record:** Migration `001` and the two-account RLS checks are complete and recorded in `agent_doc/v1/progress.md`.
