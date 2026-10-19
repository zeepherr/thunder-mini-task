# Architecture and Code Conventions

This guide records the folder and coding patterns to follow for My Work List. Use `Thunder_Core`'s versioned `/api/core/v1*` route handlers as the backend API reference and `thunder_one_prj` for frontend structure and presentation patterns. Apply both within the approved architecture in [the project specification](../../spec.md).

## Reference projects

### Backend structure and separation of concerns

For backend conventions, focus on `Thunder_Core/src/app/api/core/v1/**/route.ts` and the shared helpers those route handlers import. Do not use unrelated legacy API versions or infer the target structure from `src/lib/core/` internals.

- Use the versioned route path shape `src/app/api/core/v1/<resource>/route.ts`; dynamic resources use nested route folders (for example, `[id]/route.ts`).
- Keep the route handler responsible for the HTTP boundary: parse and validate input, authenticate/authorize the caller, call a cohesive operation, and return a consistent JSON response.
- Follow the shared response/error wrapper and auth guards used by the v1 routes (such as `apiHandler`, `getApiAuth`, and explicit permission guards) instead of reimplementing them per route.
- Treat the v1 route's request and response shapes as the frontend API contract. Keep frontend API calls in feature service modules and pass typed results into components.
- Keep credentials server-side. Thunder_Core's API key, service-role access, tenant role checks, and admin client are specific to Core's server boundary; never place them in browser code.

Examples reviewed: `Thunder_Core/src/app/api/core/v1/users/route.ts`, `src/lib/api-utils.ts`, and `src/lib/core-api-utils.ts`.

### Frontend structure and component style

Use these `thunder_one_prj` patterns as references:

- Keep `src/app/` focused on routes, layouts, loading/error boundaries, and composing feature screens.
- Put product workflows in `src/features/<feature>/`; group their UI under `components/`, feature data access under `services/`, and public exports in `index.ts` where useful.
- Frontend feature services own calls to the feature's data/API boundary; do not put fetch or Supabase query logic into presentational components.
- Put genuinely reusable controls in `src/components/ui/` and shared chrome in `src/components/layout/`.
- Use typed component props, named exports, and small components composed into page-level feature views.
- Format JSX with one element per line and normal multiline indentation when the return tree has more than a couple of elements.
- Keep theme and shared styles in the existing design system and app styles. Use semantic tokens instead of adding local palette values or a second styling system.

Examples reviewed: `thunder_one_prj/AGENTS.md`, `src/features/workspaces/components/WorkspacesPage.tsx`, `src/features/workspaces/services/workspace-stats-api.ts`, `src/features/workspaces/index.ts`, `src/components/ui/Button.tsx`, and `src/app/globals.css`.

In `thunder_one_prj`, server-side feature services call Thunder_Core's `/api/core/v1*` endpoints through shared API helpers. Use that as the reference for an authorized HTTP API boundary; it does not override this project's separately approved browser-Supabase data path.

## My Work List structure

Keep the current project stack and organize new work around these responsibilities:

```text
src/
├── app/                         # Next.js route composition and global styles
│   ├── layout.tsx
│   ├── page.tsx                 # Composes the auth gate and task feature
│   └── globals.css
├── components/
│   ├── layout/                  # Shared application shell/header
│   └── ui/                      # Reusable, domain-neutral UI controls
├── features/
│   ├── auth/
│   │   ├── components/          # Auth form and authentication gate
│   │   ├── providers/           # Session state lifecycle
│   │   ├── services/            # Auth SDK orchestration
│   │   └── index.ts             # Feature public exports
│   └── tasks/                   # Task board, forms, hooks, and task data access
│       ├── components/
│       ├── hooks/
│       ├── repositories/        # Typed Supabase task queries, if separated
│       ├── services/            # Task rules and orchestration, if needed
│       ├── types.ts
│       └── validation.ts        # Add only if validation is shared or non-trivial
├── lib/
│   └── supabase.ts              # Shared browser-client factory
├── design-system/               # Vendored ThunderOne stylesheet; do not hand-edit
└── types/                       # Shared types only; feature types stay with features

supabase/
├── migrations/                  # Ordered, forward schema/RLS migrations
└── rollback/                    # Matching rollback scripts
```

Keep a feature’s private types and helpers beside that feature. Move code to `src/components`, `src/lib`, or `src/types` only when more than one feature needs it.

## Data flow and security boundary

```text
Thunder_Core reference:
frontend feature service → /api/core/v1 route → shared request auth/validation → Core operation

My Work List (per spec.md):
route → feature components/hooks → feature service/repository → browser Supabase client
     → Supabase Auth / PostgreSQL RLS checks auth.uid() against tasks.user_id
```

For this assignment, task CRUD is performed with `@supabase/supabase-js` in the browser. PostgreSQL RLS is the authorization boundary. Do not add a service-role client, server admin client, or a Next.js API route solely to proxy task CRUD. Do not trust client-side ownership checks as a replacement for RLS. Never place a service-role key in client code, `NEXT_PUBLIC_` variables, or committed environment files. If an approved requirement later adds a separate HTTP API, put its handler under `/api/core/v1*` and preserve the public-key/JWT/RLS security model; update `spec.md` before changing the current data flow.

The reference backend's privileged/admin workflows exist for Thunder_Core's multi-tenant operations and must not be copied into this single-user task application. For My Work List, take Core's versioned route boundary and request-handling conventions as reference only; keep key handling and direct-to-Supabase task access governed by `spec.md`.

## Implementation conventions

- Keep route files small. Put task behavior in `src/features/tasks/`; use a repository for query composition and a service for business rules when that separation reduces duplication or makes behavior clearer.
- Keep UI components under the feature's `components/`, stateful hooks under `hooks/`, SDK orchestration under `services/`, and table queries under `repositories/`. The route composes feature exports; it does not implement task behavior.
- Authentication UI calls the injected `AuthService`; the session provider owns session subscription and restoration. Auth SDK calls stay behind that service/provider boundary.
- Inject the existing browser Supabase client into data-access functions/classes. Avoid creating a new client per component or query.
- Give database rows, inputs, and view models explicit TypeScript types. Keep database column names and UI-only fields distinguishable.
- Check Supabase `{ data, error }` results. Do not silently treat a failed query as an empty task list.
- Validate and normalize task titles before writing, and retain the matching PostgreSQL constraint as the final data-integrity guard.
- Keep task status values exactly `Todo`, `Doing`, and `Done`; centralize shared values/types instead of duplicating string literals.
- Use clear, action-oriented UI error messages. Keep implementation details and raw database errors out of normal user-facing copy.
- Use the existing ThunderOne design tokens, Manrope setup, Tailwind v4, and current dependencies. Do not introduce another component or CSS framework for a feature.
- Keep schema changes in a new ordered SQL migration and provide a corresponding rollback script. Do not edit an already-applied migration to represent a new change.
- Follow this repository's TypeScript/JSX formatting and local project instructions when they are more specific than a reference project's style.

### Phase implementation flow

- **Phase 3 (auth):** `src/app/page.tsx` composes the auth provider and gate; auth components call `AuthService`; the provider owns session restore/subscription; `AuthService` receives the shared browser client.
- **Phase 4 (tasks):** keep board/forms in `src/features/tasks/components/`, task state in feature hooks, business rules in a task service, and typed table queries in a task repository. Flow: component → hook/service → repository → shared browser Supabase client → PostgreSQL RLS.
- **Phase 5 (delivery):** document and verify the same flow, migration/RLS state, and public-key-only browser configuration. Deployment work must not add a server admin client or move task access behind an unneeded API route.

### Figma desktop and mobile coverage

- Each Figma page has a desktop design and a mobile design. Treat them as paired requirements for the same page/state.
- Before implementing a page, locate both frames in that phase's checklist and inspect them together.
- Build and verify both responsive layouts and their interactions; do not treat mobile as an optional later pass or merely shrink the desktop layout.
- When a Figma page has multiple states (for example, default/error/loading/empty), cover the desktop and mobile pair for every relevant state.

## Source priority

When guidance conflicts, apply it in this order:

1. `spec.md` and explicit user-approved decisions.
2. This repository's `AGENTS.md` and existing implementation patterns.
3. This architecture guide's adapted Thunder_Core and thunder_one_prj conventions.
4. The reference repositories' implementation details.

The reference repositories are examples, not runtime dependencies. Do not import their code or copy unrelated multi-tenant, admin, or workspace behavior into My Work List.
