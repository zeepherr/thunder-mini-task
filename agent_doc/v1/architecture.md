# Architecture and Code Conventions

This guide defines the ThunderOne frontend and Thunder_Core API conventions used by My Work List. Follow [spec.md](../../spec.md) for approved behavior and security requirements.

## Architecture boundary

```text
Next.js App Router page
  → feature component and hook
  → feature service
  → shared Axios transport (requestApi)
  → Next.js BFF (/api/proxy/*)
  → versioned Core API (/api/core/v1/*)
  → Supabase anon client + caller JWT
  → PostgreSQL RLS
```

Auth uses the same Core API boundary. Browser calls `/api/auth/*`; those BFF handlers call versioned Core auth routes and store access and refresh tokens in HttpOnly cookies. The browser receives a safe user profile, never the tokens. Data access uses the anon key and the caller's JWT, so PostgreSQL RLS remains active. Never add a service-role key.

The assignment's task endpoints are implemented in this repository under `src/app/api/core/v1/`, following Thunder_Core's versioned route, app-key guard, user-JWT validation, error handling, and response-envelope conventions. The current Thunder_Core repository has no My Work List task endpoint. `CORE_API_URL` defaults to this app's local origin and can target a compatible Core deployment later.

## ThunderOne frontend conventions

- Keep `src/app/` focused on Next.js routes, layouts, global styles, and feature composition.
- Organize product work under `src/features/<feature>/`. Keep UI in `components/`, state in `hooks/`, API orchestration in `services/`, and feature types/validation beside the feature.
- Components call feature services; services call `requestApi`. Do not put Axios, endpoint paths, or response envelope parsing in UI components.
- Put shared, domain-neutral controls in `src/components/ui/`, app chrome in `src/components/layout/`, public browser configuration in `src/config/env.ts`, and shared infrastructure in `src/lib/`.
- Use typed props, named exports, cohesive modules, and existing ThunderOne tokens and Tailwind v4. Do not add another styling system or raw color palette.

## Thunder_Core route conventions

All domain API endpoints live under `src/app/api/core/v1/**/route.ts`.

1. At the HTTP boundary, validate input with Zod, verify the app key, validate the caller JWT, and return the standard `{ success, data }` or `{ success, error }` envelope.
2. Use shared helpers from `src/lib/api-utils.ts` for the app-key check, user authentication, error mapping, and response envelope.
3. Keep database access user-scoped: create a Supabase anon client and pass the verified caller JWT. Never accept `user_id` from task request bodies; derive ownership from the verified user.
4. Keep private credentials in server-only `src/config/server-env.ts`. `CORE_API_KEY`, Supabase URL, and anon key must never be exposed through `NEXT_PUBLIC_*` variables or browser bundles.
5. Preserve PostgreSQL RLS as the data authorization boundary. The API's ownership filter is defense in depth, not a replacement for RLS.

Do not copy Thunder_Core's multi-tenant registry, tenant RBAC, admin/service-role client, privileged RPC grants, or MFA flows into this single-user assignment.

## Project structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/                 # BFF auth routes and HttpOnly cookie lifecycle
│   │   ├── proxy/[...path]/      # BFF for browser feature API requests
│   │   └── core/v1/              # Versioned, authenticated domain API
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   └── ui/
├── config/
│   ├── env.ts                    # Browser-safe API base URL only
│   └── server-env.ts             # Server-only API and Supabase settings
├── features/
│   ├── auth/                     # Components, provider, and BFF-backed service
│   └── tasks/                    # Components, hooks, API service, and types
├── lib/
│   ├── api/                      # Axios transport and shared request wrapper
│   ├── auth/                     # Server session cookie helpers
│   ├── api-utils.ts              # Core route guards and response/error helpers
│   ├── core-api.ts               # Server-to-server Core API client
│   └── core-api-utils.ts         # Core route validation/errors
└── utils/supabase/server.ts      # Server-only anon and user-JWT client factories

supabase/migrations/             # Ordered schema, constraints, and RLS migrations
supabase/rollback/               # Matching rollback scripts
```

Add a hook, service, repository, or shared helper when it has a clear responsibility. Keep feature-specific logic inside its feature; avoid wrappers that only forward calls.

## Authentication and API behavior

- `/api/auth/login`, `/register`, `/session`, `/refresh`, and `/logout` are the browser-facing BFF routes. They call `/api/core/v1/auth/*` and manage HttpOnly `to_at` and `to_rt` cookies.
- The `to_at` cookie is sent by the BFF as a bearer token to Core. The refresh token is used only by the refresh flow. Set `Secure` in production and `SameSite=Lax`.
- `/api/proxy/[...path]` forwards allowed feature endpoints to `CORE_API_URL/api/core/v1/*`, adding `x-api-key` and the caller JWT server-side.
- Keep the Core API key as a server-to-server learning boundary. It is not a substitute for JWT authentication or RLS, and must not be placed in frontend code.
- Validate input and database results. Do not convert failed queries into empty lists or expose internal database errors to users.

## Design and responsive requirements

- Every Figma page has paired desktop and mobile designs. Treat both as requirements for the same page and state.
- Before implementing a page, locate both frames in the phase checklist and inspect them together.
- Implement and verify both responsive layouts. Mobile is a first-class layout.
- Cover loading, empty, error, and dialog states on relevant desktop and mobile layouts.
- Follow ThunderOne tokens, Manrope, 4px spacing grid, accessible focus/contrast, and required data states.

## Phase guidance

- **Phase 3 (auth):** Auth UI calls the BFF-backed `AuthService`; BFF auth routes call versioned Core auth handlers; HttpOnly cookies preserve sessions across refreshes and tabs.
- **Phase 4 (tasks):** use `component → hook → feature service → requestApi → BFF proxy → /api/core/v1/tasks → user-JWT Supabase anon client → RLS` for CRUD, validation, async states, and responsive Figma pairs.
- **Phase 5 (delivery):** document this end-to-end path, configure server-only environment variables, deploy the BFF/Core-compatible app, and verify the RLS behavior and desktop/mobile UI.

## Source priority

1. `spec.md` and explicit user-approved decisions.
2. This repository's `AGENTS.md` and current implementation patterns.
3. This architecture guide.
4. Reference repository details that do not conflict with the first three sources.

The reference repositories are learning guides, not runtime dependencies. Do not import their code or copy unrelated multi-tenant, admin, or workspace behavior.
