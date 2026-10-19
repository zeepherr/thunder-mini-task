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

Set `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` to the values for your Supabase project. These public keys are used by the browser SDK. Never add a service-role key to this app or to a `NEXT_PUBLIC_` variable.

Start the development server:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project setup

- `src/app/` contains thin Next.js App Router entry points that compose feature screens.
- `src/features/<feature>/` owns workflow components, hooks, services, repositories, and feature types. Shared controls belong in `src/components/ui/`.
- `src/lib/supabase.ts` creates the shared browser Supabase client. Data access follows feature → service/repository → browser client → PostgreSQL RLS; see [`agent_doc/v1/architecture.md`](agent_doc/v1/architecture.md).
- `src/design-system/t1-tailwind-v4.css` contains the vendored ThunderOne tokens and Manrope typography.
- `src/app/globals.css` loads the Manrope stylesheet before Tailwind CSS v4 and the ThunderOne stylesheet. The font import is hoisted here because Tailwind expands its CSS before the vendored stylesheet, and CSS requires external imports to come first.
- `.env.example` documents the browser-safe Supabase settings required by the project architecture.

The package dependencies include `@supabase/supabase-js` and `@ant-design/icons` for the project implementation.
