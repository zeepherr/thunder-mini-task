# Mini Project — My Work List

A personal task management website for practicing Next.js, Supabase, and the Thunder Design System. The assignment is Ticket #3 / #4, “Mini Project — My Work List.” Users should be able to register, sign in, and manage their own Todo / Doing / Done tasks on desktop and mobile.

This repository is a practice project. Use personal GitHub, Supabase, and Vercel accounts with hypothetical data only. Do not use company systems, credentials, or customer data.

## Assignment ownership and responsibility

Record the assigned person's name on the assignment ticket before starting. The Mentor/Assignor is the Requester, Reviewer, and Approver; record their name on the ticket as well. The project owner remains responsible for reviewing and accepting all code, data changes, and test results, including work produced with AI assistance. AI output is not verification evidence by itself.

The assignment timeline is five working days from the start date agreed with the mentor. Record the actual start and end dates and any mentor-agreed progress check-ins on the ticket. The feature implementation order is up to the contractor.

## Assignment scope

### User account

- Register with email and password without email confirmation.
- Log in and log out; restore the correct session after refresh and in a new page/tab.
- Prevent signed-out or invalid sessions from accessing personal information.
- Show useful errors for incomplete input, password requirements, and failed login.

### Tasks

- Create, read, edit, change status, and delete tasks.
- Require a non-blank task name; details are optional.
- Use exactly `Todo`, `Doing`, and `Done` statuses.
- Persist tasks across refresh and sign-out/sign-in.
- Allow each user to access only their own tasks, enforced by PostgreSQL RLS.
- Confirm before deletion.

### User experience

- English UI with responsive desktop and mobile layouts.
- Use the Thunder Design System source and semantic tokens; document the source revision/theme version below and in delivery notes.
- Provide loading, empty, and error states with retry where appropriate.
- Prevent duplicate submissions while a request is in progress; never report a save as successful if it failed.
- Support keyboard use, visible focus, and meaningful accessible names for icon controls.

### Out of scope

Password reset, social login, task sharing, tenants/teams, file attachments, and realtime features are excluded from the assignment.

## Architecture note: assignment brief and current implementation

The assignment’s development details explicitly require Auth and CRUD operations to call the Supabase SDK from the browser, using a client-safe anon/publishable key and PostgreSQL RLS. The current implementation instead follows the previously selected ThunderOne BFF and Thunder_Core learning architecture:

```text
Feature UI → shared Axios transport → Next.js BFF → /api/core/v1/*
           → Supabase anon client + user JWT → PostgreSQL RLS
```

Auth tokens are stored in HttpOnly cookies. No service-role key is used. The Core-compatible routes are in this repository because the referenced Thunder_Core project does not provide My Work List task endpoints. This architecture difference is material: the current code does **not** meet the brief’s direct browser-Supabase SDK requirement as written. Confirm the accepted architecture with the Mentor/Assignor before treating the implementation as assignment-compliant. This README documents the current code path; it does not claim the two designs are equivalent.

## Phase 4 implementation guide

Phase 4 implements the task board and its CRUD flow. The app has one page route, `/`; the sign-in/register form and task board are views rendered on that route. The create, edit, and delete dialogs are components, not separate pages.

### 1. Next.js page and authentication flow

1. [`src/app/layout.tsx`](src/app/layout.tsx) provides the root HTML document, metadata, viewport, and global app styling.
2. [`src/app/page.tsx`](src/app/page.tsx) is the `/` route. It composes `AuthProvider`, `AuthGate`, and `TaskBoard`. The page entry itself is a Server Component; the provider and interactive feature components are client-side boundaries.
3. [`AuthProvider`](src/features/auth/providers/AuthProvider.tsx) owns the browser's current auth state. On mount, it asks `AuthService` to restore the session, subscribes to auth changes, and updates the context. It also listens for cross-tab/session changes and avoids setting state after unmount.
4. [`AuthGate`](src/features/auth/components/AuthGate.tsx) chooses the view from that state: setup guidance when required config is missing, a loading view while session restoration is in progress, the auth form when there is no user, or the task board for a signed-in user.
5. [`AuthService`](src/features/auth/services/AuthService.ts) calls same-origin Next.js auth endpoints with credentials included. The browser does not read the HttpOnly auth cookies itself.

If session restoration fails, the provider currently falls back to a signed-out state so the auth form is shown. There is no separate session-restoration error page.

### 2. Task board and UI state flow

[`TaskBoard`](src/features/tasks/components/TaskBoard.tsx) coordinates the signed-in task experience. It gets task data from [`useTasks`](src/features/tasks/hooks/useTasks.ts), calculates status counts, and derives search/filter results with `useMemo`. Search and status filters are client-side operations over the tasks already loaded; they do not send a new database query.

[`TaskList`](src/features/tasks/components/TaskList.tsx) selects a state in this order:

1. **Loading:** [`TaskListStates`](src/features/tasks/components/TaskListStates.tsx) shows skeleton cards while the initial request is pending.
2. **Load error:** show an error and a retry action if the initial fetch fails.
3. **No tasks:** show the create-first-task empty state when the database returned no tasks.
4. **No matches:** show a separate message and clear-filter action when tasks exist but the current search/filter hides them all.
5. **Task cards:** render the visible tasks when results exist.

The toolbar also has a loading skeleton. Create and edit use [`TaskFormDialog`](src/features/tasks/components/TaskFormDialog.tsx), which trims and rejects a blank title. Delete uses [`DeleteTaskDialog`](src/features/tasks/components/DeleteTaskDialog.tsx) for confirmation. Status changes use [`TaskStatusSelect`](src/features/tasks/components/TaskStatusSelect.tsx), built with Radix Select. Each mutation disables the relevant control while pending and reports errors in the relevant dialog or board.

### 3. CRUD request path through Next.js

Task components call `TaskService`; it calls the shared Axios transport in [`request-api.ts`](src/lib/api/request-api.ts). The browser base URL defaults to `/api/proxy`, so a task request stays same-origin and enters the Next.js BFF at `/api/proxy/tasks`.

The catch-all route [`src/app/api/proxy/[...path]/route.ts`](src/app/api/proxy/%5B...path%5D/route.ts) restricts the forwarded path to the supported task API, checks the request origin, reads the access token from the HttpOnly cookie, and adds the server-side app key and user Bearer token. It forwards the request to `CORE_API_URL` under `/api/core/v1/*`.

In local setup, `.env.example` points `CORE_API_URL` to `http://localhost:3000`. This means the BFF request re-enters the same Next.js server at the distinct `/api/core/v1/tasks` route; it is not a proxy loop. The Core-compatible route is local to this repository because the referenced Thunder_Core project does not currently provide these task endpoints.

The task API routes in [`src/app/api/core/v1/tasks/route.ts`](src/app/api/core/v1/tasks/route.ts) and [`src/app/api/core/v1/tasks/[id]/route.ts`](src/app/api/core/v1/tasks/%5Bid%5D/route.ts) then:

- Check the app key and validate the user's Bearer JWT with Supabase Auth.
- Validate create/update request bodies with Zod.
- Read, insert, update, or delete `public.tasks` using a Supabase client carrying the user's JWT.
- Scope reads and mutations to the authenticated `user_id`; create always sets `user_id` from the verified user, never from the browser payload.
- Return a consistent success/data envelope; missing or non-owned task IDs resolve as not found.

`requestApi<T>` unwraps that response envelope and turns HTTP/network failures into errors for the feature layer. `useTasks` changes React state only after the server confirms a successful mutation; these CRUD operations are not optimistic. A failed save therefore leaves the previous task data in place.

### 4. Supabase Auth, JWT, and row security

The current code uses Supabase on the server side:

- Login/register/logout/session restoration go through Next.js auth routes and the Supabase Auth API. Login cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- Task requests carry the access token through the HttpOnly cookie to the BFF, then as a Bearer token to the Core-compatible route.
- The server verifies that token with `supabase.auth.getUser()`. It creates a Supabase client with the anon key and the user's JWT; the service-role key is not used.
- PostgreSQL RLS in [`supabase/migrations/001_create_tasks.sql`](supabase/migrations/001_create_tasks.sql) enforces owner access with `auth.uid() = user_id` for select, insert, update, and delete. The API's `user_id` filter is useful defense in depth, while RLS remains the database authorization boundary.

The assignment brief's direct-browser-Supabase requirement and this BFF design are different architectures. That acceptance decision remains a Phase 5 prerequisite; changing to direct browser SDK calls would change the auth and data flow, not just a URL.

### 5. TypeScript and validation boundaries

- [`task.types.ts`](src/features/tasks/types/task.types.ts) defines the domain model in camelCase, such as `Task.updatedAt`, plus task input types for create and update.
- `TASK_STATUSES as const` is the source for the `TaskStatus` literal union, so UI status values remain narrow instead of becoming arbitrary strings. The `TaskFilter` type adds the `All` option.
- [`taskService.ts`](src/features/tasks/services/taskService.ts) maps the API's snake_case record (`updated_at`) into the UI's camelCase model (`updatedAt`). That conversion makes the API/domain boundary explicit.
- `requestApi<T>` gives callers a compile-time response type. TypeScript types disappear at runtime, so they do **not** prove incoming JSON is valid. Zod schemas on the server validate untrusted request bodies at runtime.
- The status list also exists in the server Zod schema and the database check constraint. If statuses change, update all three boundaries together: UI/domain types, API validation, and PostgreSQL constraint.

### Phase 4 learning map

| Concern | Start here | Follow it to |
| --- | --- | --- |
| Page composition and session gate | `src/app/page.tsx` | `AuthProvider` → `AuthService` → `AuthGate` |
| Task UI and states | `TaskBoard.tsx` → `TaskList.tsx` | `useTasks.ts` → `TaskListStates.tsx` |
| Create, edit, delete, status | `TaskBoard.tsx` | `TaskFormDialog.tsx`, `DeleteTaskDialog.tsx`, `TaskStatusSelect.tsx` |
| Request/response typing | `taskService.ts` | `request-api.ts` → `src/lib/api/client.ts` |
| BFF and token forwarding | `src/app/api/proxy/[...path]/route.ts` | `src/app/api/core/v1/tasks/*` → `src/lib/api-utils.ts` |
| Supabase and owner isolation | `src/utils/supabase/server.ts` | `001_create_tasks.sql` RLS policies |

This guide explains the current implementation; it is not a record that the remaining manual Phase 4 checks have passed.

## Current project status

- Phase 1 — scaffolding and ThunderOne design system: complete.
- Phase 2 — task schema and RLS migration: complete; applied to the practice Supabase project and checked with two accounts.
- Phase 3 — authentication and responsive auth UI: complete, based on the project owner’s confirmation of the live auth and desktop/mobile checks.
- Phase 4 — task CRUD and task UI implementation: complete. The manual responsive UI and cross-session persistence checks below are still pending.
- Phase 5 — Vercel deployment, final verification, and handoff: not started.

Before Phase 5, finish both pending Phase 4 checks: (1) verify the task board, forms, dialogs, and loading/empty/error states at desktop and mobile breakpoints; and (2) verify task persistence and status transitions across sign-out and sign-in. Also confirm with the Mentor/Assignor whether the BFF architecture is accepted despite the assignment brief's browser-Supabase requirement.

## Requirements

- Node.js 20.9 or later
- npm
- A personal Supabase project with email confirmation disabled

## Local setup

Install dependencies and create a local environment file:

```powershell
npm install
Copy-Item .env.example .env.local
```

Set the following values in `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Browser API base. Keep `/api/proxy` for same-origin BFF requests. |
| `CORE_API_URL` | Origin serving compatible `/api/core/v1/*` routes. Locally, use `http://localhost:3000`. |
| `CORE_API_KEY` | Long random server-to-server key shared by this app's BFF and Core-compatible routes. |
| `SUPABASE_URL` | Supabase project URL, server-side only in the current architecture. |
| `SUPABASE_ANON_KEY` | Supabase anon/publishable key, paired with the authenticated user's JWT. Never use a service-role key. |

Do not commit `.env.local`, put server credentials in `NEXT_PUBLIC_*` variables, or expose secret values in screenshots, logs, or handoff evidence. `.env.example` contains variable names and non-secret defaults only.

Start the development server:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Local success does not replace verification on the deployed Vercel URL.

## Database setup and RLS

The reproducible migration and rollback are:

- [`supabase/migrations/001_create_tasks.sql`](supabase/migrations/001_create_tasks.sql)
- [`supabase/rollback/001_create_tasks.rollback.sql`](supabase/rollback/001_create_tasks.rollback.sql)

The migration creates `public.tasks`, validates task names and statuses, enables RLS, and adds separate authenticated-user policies for select, insert, update, and delete. RLS is the authorization boundary; UI hiding and API-side filtering alone do not satisfy owner isolation. Verify that Account A cannot read, edit, delete, or reassign Account B's task, and cannot create a task owned by B.

Configure Supabase Auth to disable email confirmation for this exercise. Set the Supabase Site URL to the deployed app URL. Add redirect URLs only if the chosen auth flow uses redirects. Describe these settings in delivery notes without copying secret values.

## Design system

- Vendored stylesheet: [`src/design-system/t1-tailwind-v4.css`](src/design-system/t1-tailwind-v4.css)
- Global CSS entry: [`src/app/globals.css`](src/app/globals.css)
- Typography: Manrope
- Design source: Thunder Design System repository, [`rdThunderThailand/-thunder-design-system`](https://github.com/rdThunderThailand/-thunder-design-system)
- Source revision/theme version used: **record the exact revision and theme version used before handoff**.

Use semantic tokens and the core design rules relevant to this app. The design system is not expected to supply every button, input, card, or table as a ready-made component.

## Acceptance criteria and deployed verification

Record the method, actual result, and evidence for each criterion. Test the deployed URL, not only the local server.

| ID | Required result | Verification |
| --- | --- | --- |
| AC-01 | Register without email confirmation | Create an account and reach the task list without opening an email. |
| AC-02 | Login and logout work | Sign in, sign out, then verify personal information is inaccessible. |
| AC-03 | Session state persists correctly | Refresh and open a new page/tab while signed in; confirm the current session. |
| AC-04 | CRUD and status changes work | Create, read, edit, change status, and delete; check saved values. |
| AC-05 | Data persists | Refresh and sign out/sign back in; verify undeleted tasks remain. |
| AC-06 | Database owner isolation works | With Accounts A and B, verify cross-account read/edit/delete/create-as-owner/reassignment are rejected by RLS. |
| AC-07 | Signed-out users cannot access tasks | Attempt task reads and writes without a valid session; verify the database rejects them. |
| AC-08 | Validation and async states work | Try blank/space-only names, empty lists, loading, and failed requests; verify clear recovery and retry. |
| AC-09 | Design system and accessibility are present | Identify theme/token files and usage; check desktop, mobile, keyboard navigation, and visible focus. |
| AC-10 | Repository is ready to run | Follow README and setup files with an independent environment without guessing required steps. |
| AC-11 | Implementation can be explained and changed | Explain Auth → SDK → database, RLS, and UI; incorporate minor reviewer fixes. |
| AC-12 | Own-account Vercel deployment works | Reviewer opens the submitted URL, directly opens/refreshes internal pages, tests AC-01–AC-09, and matches the deployment to the submitted commit. |

For each result, record what was tested, account labels (never passwords), actual outcome, evidence location, and anything not tested. A successful build or deployment alone is not proof of acceptance.

## Repository and deployment delivery

- Repository: [zeepherr/thunder-mini-task](https://github.com/zeepherr/thunder-mini-task)
- Working branch: `dev`
- Commit and deployed version: **record the exact commit and matching Vercel deployment URL/ID submitted for review**.
- Use a Vercel project in your own account connected to your own GitHub repository.
- Configure required environment variables in the Vercel environment used for submission. Never place hidden values in the repository or evidence.
- Ensure the submitted URL, deployed commit, and repository revision match.
- Custom domain purchase is not required.

## Handoff contents

Prepare a concise handoff for the company’s project-doc format with:

- Task, Sender, Receiver, and Date/Time.
- Status and actions taken; delivery results and revisions.
- AC test method, actual result, and evidence; untested items and pending issues.
- Next step and successor.
- GitHub repository, branch, commit, Vercel app URL/deployment ID, and proof that the checked deployment matches the submitted commit.
- Owner and Mentor/Assignor roles, plus the project owner’s responsibility for AI-assisted code, data, and test results.
- A/B test account labels only; withhold passwords and all secret values.

A short summary of key decision reasons in this README is sufficient; a separate SOP or ADR for every ticket is not required.
