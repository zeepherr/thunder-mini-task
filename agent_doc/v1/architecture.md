# Architecture and Code Conventions

This guide adapts the architecture notes in the Developer Internship Obsidian project folder to **My Work List**. Follow the approved [project specification](../../spec.md) for application behavior and security boundaries.

## Reference architecture

### ThunderOne frontend (`thunder_one_prj`)

Use its conventions that fit this standalone assignment:

- Keep `src/app/` focused on Next.js routes, layouts, global styles, and composition of feature screens.
- Organize product work by feature under `src/features/<feature>/`.
- Keep feature UI in `components/`, stateful hooks in `hooks/`, data access and orchestration in `services/` or `repositories/`, and feature-owned types beside the feature.
- Put shared, domain-neutral controls in `src/components/ui/`, shared app chrome in `src/components/layout/`, shared public environment parsing in `src/config/env.ts`, and shared infrastructure clients in `src/lib/`.
- Keep feature services as the boundary between components and external data access. Pass typed results into UI components; avoid putting query logic in presentational components.
- Use typed props, named exports, small cohesive components, and multi-line JSX with one element per line for larger trees.
- Keep shared styles and design tokens in the existing ThunderOne design system. Do not add another styling system or raw Tailwind color palettes.

ThunderOne production uses server components and a BFF proxy to communicate with Thunder_Core. This assignment has an explicit browser-Supabase architecture instead; do not copy the production proxy or session-cookie flow into this app.

### Thunder_Core backend (`/api/core/v1*`)

Treat Thunder_Core as a backend API and database handler. Its canonical human-facing routes are under `src/app/api/core/v1/**/route.ts`; do not copy legacy UI routes or unrelated `/api/v0.1` endpoints.

If a separately approved requirement adds an HTTP API to this project, follow these backend boundary conventions:

1. Keep the route handler responsible for the HTTP boundary: parse and validate input, authenticate and authorize the caller, invoke one cohesive operation, and return a consistent JSON response.
2. Use shared request wrappers, error mapping, and auth guards rather than reimplementing them per route.
3. Keep domain behavior in a cohesive feature service/repository or database operation, not in a large route handler.
4. Keep server credentials on the server. Never expose a service-role key or backend API secret in browser code or `NEXT_PUBLIC_` variables.

Thunder_Core's app-key gate, tenant membership/RBAC, admin Supabase client, privileged RPC grants, and MFA rules belong to its multi-tenant platform. They are not part of this single-user assignment and must not be copied here.

## My Work List structure

```text
src/
├── app/                         # Next.js route composition and global styles
│   ├── layout.tsx
│   ├── page.tsx                 # Composes the auth gate and task feature
│   └── globals.css
├── components/
│   ├── layout/                  # Shared application shell/header when reused
│   └── ui/                      # Reusable, domain-neutral UI controls
├── config/
│   └── env.ts                   # Browser-safe public Supabase env access only
├── design-system/               # Vendored ThunderOne stylesheet; do not hand-edit
├── features/
│   ├── auth/
│   │   ├── components/          # Auth form and access gate
│   │   ├── providers/           # Session restore and subscription lifecycle
│   │   ├── services/            # Supabase Auth operations
│   │   └── index.ts             # Feature public exports
│   └── tasks/
│       ├── components/          # Board, task cards, forms, confirmation dialog
│       ├── hooks/               # Feature state and async UI state
│       ├── repositories/        # Typed Supabase table queries
│       ├── services/            # Task rules and orchestration when useful
│       ├── types.ts
│       └── validation.ts        # Shared/non-trivial feature validation
├── lib/
│   └── supabase.ts              # Shared browser Supabase client
└── types/                       # Types shared by multiple features only

supabase/
├── migrations/                  # Ordered schema, constraints, and RLS migrations
└── rollback/                    # Matching rollback scripts
```

Keep private types and helpers beside their feature. Move code into `components/`, `lib/`, or `types/` only when more than one feature needs it. Add a hook, service, or repository when it has a clear responsibility; avoid wrappers that only forward a call.

## Data flow and security boundary

```text
App Router page
  → feature components
  → feature hook/service
  → typed repository / shared Supabase Auth service
  → singleton browser Supabase client (public anon/publishable key)
  → Supabase Auth + PostgreSQL RLS
```

For task data, PostgreSQL RLS is the authorization boundary. The browser is untrusted: client-side ownership checks improve UX but do not replace RLS. Never add a service-role client, server admin client, or Next.js API route solely to proxy task CRUD. The app's approved requirements intentionally exercise direct browser SDK requests and RLS isolation.

The browser client is shared and injected into feature data-access code; do not create one client per component or query. Keep environment access centralized in `src/config/env.ts`, and only read public browser-safe values there. Do not add secret keys to `.env.example`, client code, or committed files.

If a future, explicit requirement changes the data path to an HTTP API, update `spec.md` and this guide first. Place such an API under `/api/core/v1*`, preserve JWT-based user authorization, use a server-only secret where required, and keep feature API calls in feature services. Do not silently infer that change from the ThunderOne production architecture.

## Implementation conventions

- Keep App Router files small. A route composes features; it does not implement task behavior.
- Auth components call the injected `AuthService`; the auth provider owns session restoration and auth-state subscription.
- Keep task UI under `src/features/tasks/components/`, state in feature hooks, typed table queries in repositories, and business rules in a service when that separation clarifies behavior.
- Give database rows, input payloads, and UI view models explicit TypeScript types. Keep database column names distinct from UI-only fields.
- Check Supabase `{ data, error }` results. A failed query must not be shown as an empty task list.
- Validate and normalize titles before writing; retain PostgreSQL constraints as the final integrity guard.
- Use exactly `Todo`, `Doing`, and `Done`; centralize status types and values rather than duplicating string literals.
- Show clear action-oriented UI errors; do not expose raw database or internal server errors to users.
- Use the existing ThunderOne tokens, Manrope setup, Tailwind v4, and installed dependencies. Do not introduce another component or CSS framework.
- Keep schema changes in a new ordered SQL migration, paired with a rollback script. Do not edit an already-applied migration to represent a new change.
- Keep documentation in `agent_doc/v1/` in English. The Obsidian vault is a read-only reference for this task.

## Design and responsive requirements

- Every Figma page has desktop and mobile designs. Treat both as paired requirements for the same page and state.
- Before implementing a page, locate both frames in the phase checklist and inspect them together.
- Implement and verify both responsive layouts and interactions. Mobile is a first-class layout, not a later desktop shrink pass.
- When a page has loading, empty, error, or dialog states, cover desktop and mobile for each relevant state.
- Follow ThunderOne design-system rules: semantic tokens, 4px spacing grid, Manrope, accessible focus/contrast, and the required loading/empty/error states for data-driven surfaces.

## Phase guidance

- **Phase 3 (auth):** `src/app/page.tsx` composes the provider and gate; auth components call `AuthService`; the provider owns session restore/subscription; `AuthService` receives the shared browser client.
- **Phase 4 (tasks):** use `component → hook/service → repository → shared browser Supabase client → PostgreSQL RLS`; keep the page thin and cover CRUD, async states, validation, and responsive Figma pairs.
- **Phase 5 (delivery):** document and verify the same browser-SDK/RLS flow, migration state, public-key-only browser configuration, and desktop/mobile behavior. Do not move task access behind an unneeded API route.

## Source priority

1. `spec.md` and explicit user-approved decisions.
2. This repository's `AGENTS.md` and current implementation patterns.
3. This adapted architecture guide, based on the Obsidian ThunderOne and Thunder_Core notes.
4. Reference repository details that do not conflict with the first three sources.

The reference repositories are examples, not runtime dependencies. Do not import their code or copy unrelated multi-tenant, admin, or workspace behavior into My Work List.
