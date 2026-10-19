# My Work List — v1 Progress

Project scope and acceptance criteria are defined in [spec.md](../../spec.md). This file tracks progress across its five implementation phases. Each phase's detailed checklist is in that phase folder's `todo.md`.

## Phase status

| Phase | Status | Checklist |
| --- | --- | --- |
| Phase 1 — Project Scaffolding & Design System Wiring | [X] Complete | [Phase 1 todo](phase-1-project-scaffolding-design-system-wiring/todo.md) |
| Phase 2 — Database Schema & Strict RLS Migration | [X] Complete | [Phase 2 todo](phase-2-database-schema-strict-rls-migration/todo.md) |
| Phase 3 — Supabase Authentication Flow | [-] In progress | [Phase 3 todo](phase-3-supabase-authentication-flow/todo.md) |
| Phase 4 — Task CRUD & ThunderOne UI | [-] Not started | [Phase 4 todo](phase-4-task-crud-thunderone-ui/todo.md) |
| Phase 5 — Vercel Deployment, Verification & Handoff | [-] Not started | [Phase 5 todo](phase-5-vercel-deployment-verification-handoff/todo.md) |

## Phase 1 completion evidence

- Next.js App Router, Tailwind CSS v4, `@ant-design/icons`, and `@supabase/supabase-js` are configured.
- The ThunderOne stylesheet is vendored. Its Manrope font import is loaded before Tailwind so the stylesheet compiles; token declarations are preserved.
- `.env.example` contains only the browser Supabase URL and anon key placeholders.
- The development server served the app and compiled stylesheet with HTTP 200 after the CSS import-order fix.
- Local setup instructions are in `README.md`.

## Project guardrails

- Follow [the architecture guide](architecture.md) for feature organization and the route → feature → service/repository → browser client → RLS flow.
- The Obsidian architecture notes confirm this Mini Project exception: keep task access on the browser Supabase SDK with PostgreSQL RLS. ThunderOne's production BFF and Thunder_Core's `/api/core/v1*` are reference patterns only unless `spec.md` is explicitly changed.
- Follow ThunderOne's feature-first frontend organization and Thunder_Core's route-boundary conventions only if an HTTP API is later approved. Do not copy Core's tenant RBAC, admin client, service-role access, or MFA into this single-user assignment.
- Public Supabase environment access is centralized in `src/config/env.ts`; only anon/publishable browser credentials are allowed there.
- Every Figma page has paired desktop and mobile designs; implementation and verification must cover both.
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

## Phase 3 progress

- Implemented browser Supabase client setup, auth-state restoration and subscription, registration, sign-in, sign-out, invalid-credential feedback, and the signed-out access gate through the auth feature/service flow.
- `src/features/auth/providers/AuthProvider.tsx` owns session restoration and subscription; `src/features/auth/services/AuthService.ts` wraps auth operations using the injected browser client.
- `src/features/auth/components/` contains the gate and form; `src/app/page.tsx` composes the feature.
- The authentication screens follow the linked desktop and mobile Figma frames, using ThunderOne tokens and local copies of the Figma SVG assets.
- The browser client accepts a public anon key or the newer publishable-key environment variable; no service-role key is referenced.
- TypeScript check and the Impeccable UI detector pass.
- Live authentication behavior and the Supabase email-confirmation setting remain to be verified before completing Phase 3.
- Public Supabase URL/key lookup is centralized in `src/config/env.ts`, and `src/lib/supabase.ts` creates the shared browser client from that config.
- Responsive auth refinements now set an explicit device viewport, respect mobile safe areas, and retain 44px touch targets; visual verification of all auth states remains open in the Phase 3 checklist.

## Architecture alignment

- Reviewed the project-specific Obsidian notes for ThunderOne frontend, Thunder_Core backend, authentication, Supabase/RLS, and the ThunderOne design system.
- Updated [the architecture guide](architecture.md) to capture reusable conventions and explicitly preserve this assignment's direct browser-Supabase/RLS boundary.
- No files in the Obsidian vault were modified.
