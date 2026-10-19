# My Work List

A personal task list app built with Next.js App Router, Supabase, and the ThunderOne Design System. Implementation progress is tracked in [`agent_doc/v1/progress.md`](agent_doc/v1/progress.md).

## Requirements

- Node.js 20.9 or later
- npm

## Local setup

Install dependencies:

```powershell
npm install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env.local
```

Set these values in `.env.local`:

- `CORE_API_URL`: local app origin (`http://localhost:3000`); in deployment, set the reachable HTTPS origin that hosts the compatible `/api/core/v1/*` routes.
- `CORE_API_KEY`: replace the example with a long random secret. It is used only by the BFF and Core routes.
- `SUPABASE_URL` and `SUPABASE_ANON_KEY`: your Supabase project URL and anon/publishable key. These are read only on the server; the anon key is paired with the caller's JWT so PostgreSQL RLS still applies.
- `NEXT_PUBLIC_API_BASE_URL`: leave as `/api/proxy` for browser requests through the same-origin BFF.

Never add a Supabase service-role key to this app. Do not prefix server credentials with `NEXT_PUBLIC_`.

Start the development server:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project setup

- `src/app/` contains thin Next.js App Router entry points that compose feature screens.
- `src/features/<feature>/` owns workflow components, hooks, services, repositories, and feature types. Shared controls belong in `src/components/ui/`.
- `src/features/<feature>/services/` calls the shared Axios transport in `src/lib/api/`; requests pass through the Next.js BFF to versioned `/api/core/v1/*` routes. The server creates a Supabase anon client with the caller's JWT, keeping PostgreSQL RLS active; see [`agent_doc/v1/architecture.md`](agent_doc/v1/architecture.md).
- `src/design-system/t1-tailwind-v4.css` contains the vendored ThunderOne tokens and Manrope typography.
- `src/app/globals.css` loads the Manrope stylesheet before Tailwind CSS v4 and the ThunderOne stylesheet. The font import is hoisted here because Tailwind expands its CSS before the vendored stylesheet, and CSS requires external imports to come first.
- `.env.example` documents the BFF, Core API, and server-side Supabase anon settings. Auth tokens are stored in HttpOnly cookies and are not returned to browser JavaScript.

The package dependencies include `@supabase/supabase-js`, `@ant-design/icons`, Axios, and Zod for the project implementation.
