# My Work List

A personal task list app built with Next.js App Router and the ThunderOne Design System. This repository currently contains the Phase 1 project scaffold and design-system setup.

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

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` to the values for your Supabase project. These variables are exposed to the browser, so use only the project's anon key. Never add a service-role key to this app or to a `NEXT_PUBLIC_` variable.

Start the development server:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project setup

- `src/app/` contains the Next.js App Router entry points.
- `src/design-system/t1-tailwind-v4.css` contains the vendored ThunderOne tokens and Manrope typography.
- `src/app/globals.css` loads the Manrope stylesheet before Tailwind CSS v4 and the ThunderOne stylesheet. The font import is hoisted here because Tailwind expands its CSS before the vendored stylesheet, and CSS requires external imports to come first.
- `.env.example` documents the browser-safe Supabase settings required by the project architecture.

The package dependencies include `@supabase/supabase-js` and `@ant-design/icons` for the project implementation. Authentication and task operations are not part of this Phase 1 scaffold yet.
