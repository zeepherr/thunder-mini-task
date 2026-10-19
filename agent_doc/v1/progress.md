# My Work List — v1 Progress

Project scope and acceptance criteria are defined in [spec.md](../../spec.md). This file tracks progress across its five implementation phases. Each phase's detailed checklist is in that phase folder's `todo.md`.

## Phase status

| Phase | Status | Checklist |
| --- | --- | --- |
| Phase 1 — Project Scaffolding & Design System Wiring | [X] Complete | [Phase 1 todo](phase-1-project-scaffolding-design-system-wiring/todo.md) |
| Phase 2 — Database Schema & Strict RLS Migration | [X] Complete | [Phase 2 todo](phase-2-database-schema-strict-rls-migration/todo.md) |
| Phase 3 — Supabase Authentication Flow | [-] Not started | [Phase 3 todo](phase-3-supabase-authentication-flow/todo.md) |
| Phase 4 — Task CRUD & ThunderOne UI | [-] Not started | [Phase 4 todo](phase-4-task-crud-thunderone-ui/todo.md) |
| Phase 5 — Vercel Deployment, Verification & Handoff | [-] Not started | [Phase 5 todo](phase-5-vercel-deployment-verification-handoff/todo.md) |

## Phase 1 completion evidence

- Next.js App Router, Tailwind CSS v4, `@ant-design/icons`, and `@supabase/supabase-js` are configured.
- The ThunderOne stylesheet is vendored. Its Manrope font import is loaded before Tailwind so the stylesheet compiles; token declarations are preserved.
- `.env.example` contains only the browser Supabase URL and anon key placeholders.
- The development server served the app and compiled stylesheet with HTTP 200 after the CSS import-order fix.
- Local setup instructions are in `README.md`.

## Project guardrails

- Use the browser Supabase SDK with the anon key. Never expose a service-role key in client code or `NEXT_PUBLIC_` variables.
- Enforce per-user data isolation with PostgreSQL RLS as specified in `spec.md`.
- The Figma source has one page, `Page 1`, with 20 desktop and mobile frames. Phase checklists link the frames relevant to their work.

Last updated: 2026-10-19

## Phase 2 progress

- Migration and rollback SQL files are prepared locally.
- Migration `001` was applied to the linked practice Supabase project with `npx supabase db push`; `npx supabase migration list --linked` confirms local and remote version `001` match.
- RLS isolation was checked using Account A `e61426fa-210a-43c5-9ae8-eb1b5bb8f64b` and Account B `ad29755a-16ad-4968-b637-17fe86b62a76`, with PostgreSQL role `authenticated` and each account ID supplied as the JWT subject.
- Account A successfully inserted a task. Account B saw zero rows, updated zero rows, and deleted zero rows.
- Account A's ownership reassignment attempt was rejected with PostgreSQL error `42501`, as required by the UPDATE policy.
- Account A deleted the temporary test task successfully, and a final query confirmed no matching test row remains.
- Phase 2 migration and RLS checks are complete.
- Open questions are tracked in the Phase 2 checklist.
