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

## Current project status

- Phase 1 — scaffolding and ThunderOne design system: complete.
- Phase 2 — task schema and RLS migration: complete; applied to the practice Supabase project and checked with two accounts.
- Phase 3 — authentication and responsive auth UI: complete, based on the project owner’s confirmation of the live auth and desktop/mobile checks.
- Phase 4 — task CRUD and task UI: not started.
- Phase 5 — Vercel deployment, final verification, and handoff: not started.

The task API and task database schema exist, but the task-management UI and end-to-end task workflow still need Phase 4 implementation.

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
