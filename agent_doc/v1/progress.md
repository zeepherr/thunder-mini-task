# My Work List — v1 Progress

Project scope and acceptance criteria are defined in [spec.md](../../spec.md). This file tracks progress across its five implementation phases. Each phase's detailed checklist is in that phase folder's `todo.md`.

## Phase status

| Phase | Status | Checklist |
| --- | --- | --- |
| Phase 1 — Project Scaffolding & Design System Wiring | [X] Complete | [Phase 1 todo](phase-1-project-scaffolding-design-system-wiring/todo.md) |
| Phase 2 — Database Schema & Strict RLS Migration | [X] Complete | [Phase 2 todo](phase-2-database-schema-strict-rls-migration/todo.md) |
| Phase 3 — Supabase Authentication Flow | [X] Complete | [Phase 3 todo](phase-3-supabase-authentication-flow/todo.md) |
| Phase 4 — Task CRUD & ThunderOne UI | [-] Not started | [Phase 4 todo](phase-4-task-crud-thunderone-ui/todo.md) |
| Phase 5 — Vercel Deployment, Verification & Handoff | [-] Not started | [Phase 5 todo](phase-5-vercel-deployment-verification-handoff/todo.md) |

## Phase 1 completion evidence

- Next.js App Router, Tailwind CSS v4, `@ant-design/icons`, `@supabase/supabase-js`, Axios, and Zod are configured.
- The ThunderOne stylesheet is vendored. Its Manrope font import is loaded before Tailwind so the stylesheet compiles; token declarations are preserved.
- `.env.example` contains same-origin API routing, server-only Core settings, and Supabase URL/anon key placeholders; no service-role key is used.
- The development server served the app and compiled stylesheet with HTTP 200 after the CSS import-order fix.
- Local setup instructions are in `README.md`.

## Project guardrails

- Follow [the architecture guide](architecture.md) for feature → service → shared transport → Next.js BFF → `/api/core/v1*` → user-JWT Supabase anon client → RLS.
- Auth tokens stay in HttpOnly cookies. The browser receives only a safe user profile and calls same-origin BFF routes.
- Server-only settings are centralized in `src/config/server-env.ts`; `src/config/env.ts` contains only the browser API base URL.
- Do not copy Core's tenant RBAC, admin client, service-role access, or MFA into this single-user assignment.
- Every Figma page has paired desktop and mobile designs; implementation and verification must cover both.
- Use the Supabase anon key with the verified caller JWT on the server. Never expose a service-role key or server credentials in client code or `NEXT_PUBLIC_` variables.
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

## Phase 3 progress

- Implemented server-backed registration, sign-in, sign-out, session restore, refresh, HttpOnly cookies, invalid-credential feedback, and the signed-out access gate through the auth feature/service flow.
- `src/features/auth/providers/AuthProvider.tsx` owns session restore and refresh checks; `src/features/auth/services/AuthService.ts` calls same-origin `/api/auth/*` routes.
- `src/features/auth/components/` contains the gate and form; `src/app/page.tsx` composes the feature.
- The authentication screens follow the linked desktop and mobile Figma frames, using ThunderOne tokens and local copies of the Figma SVG assets.
- The Core-compatible auth and task routes use a Supabase anon client with the caller JWT. No service-role key is referenced.
- The user confirmed registration, sign-in, persistence, logout, unauthenticated gating, and desktop/mobile auth-state checks are complete.
- Responsive auth refinements set an explicit device viewport, respect mobile safe areas, and retain 44px touch targets.

## Architecture alignment

- Reviewed the project-specific Obsidian notes for ThunderOne frontend, Thunder_Core backend, authentication, Supabase/RLS, and the ThunderOne design system.
- Per the user's latest architecture decision, this project now uses the ThunderOne BFF and Thunder_Core `/api/core/v1*` structure as its implementation path, retaining user-JWT RLS and excluding service-role access.
- Updated [the architecture guide](architecture.md), `spec.md`, README, and the affected phase checklists to describe the same structure.
- TypeScript check (`npx tsc --noEmit`) passes. Live authentication checks remain open in Phase 3.
- No files in the Obsidian vault were modified.
