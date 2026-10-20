# My Work List

A responsive task management app built with Next.js, Supabase, and the Thunder Design System. Users can create an account, sign in, and manage personal tasks with `Todo`, `Doing`, and `Done` statuses.

## Features

- Email and password registration, sign-in, and sign-out
- Session restoration after refresh
- Create, view, edit, delete, and update task status
- Search and filter tasks by status
- Loading, empty, and error states
- PostgreSQL row-level security (RLS) for task ownership

## Technology

- Next.js App Router and React
- TypeScript
- Supabase Auth and PostgreSQL
- Axios for browser-to-server requests
- Zod for API request validation
- Tailwind CSS v4 and Thunder Design System tokens

## Architecture

The browser sends requests to this app's Next.js API routes. The server validates the user's session and forwards task operations to Supabase using the user's access token.

```text
Browser UI
  ├── Authentication → Next.js auth routes
  └── Task CRUD → Axios → Next.js BFF → Core-compatible API routes
                                         → Supabase Auth and PostgreSQL RLS
```

Auth tokens are stored in `HttpOnly` cookies. Task API routes verify the user's JWT and use a Supabase client configured with the anon key and that user's token. PostgreSQL RLS restricts each user to their own tasks. The service-role key is not used.

For local development, `CORE_API_URL` points to this Next.js app. The BFF forwards requests to a separate `/api/core/v1/*` route in the same app.

## Project structure

```text
src/
  app/                 Next.js pages and API routes
  features/auth/       Authentication UI, state, and service
  features/tasks/      Task board, components, hooks, and service
  lib/                 API transport, auth cookies, and server helpers
  utils/supabase/      Server-side Supabase client
supabase/
  migrations/          Database schema and RLS policies
  rollback/            Migration rollback scripts
```

## Requirements

- Node.js 20.9 or later
- npm
- A Supabase project

## Local development

Install dependencies and create a local environment file:

```powershell
npm install
Copy-Item .env.example .env.local
```

Set the values in `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Same-origin browser API base. Use `/api/proxy`. |
| `CORE_API_URL` | Origin for the Core-compatible API. Use `http://localhost:3000` locally. |
| `CORE_API_KEY` | Server-to-server key used by the BFF and Core-compatible routes. |
| `SUPABASE_URL` | Supabase project URL. Server-side only. |
| `SUPABASE_ANON_KEY` | Supabase anon/publishable key used with the authenticated user's JWT. Do not use a service-role key. |

Configure Supabase Auth for the registration flow used by this app. Apply the task schema and RLS policies from [`supabase/migrations/001_create_tasks.sql`](supabase/migrations/001_create_tasks.sql).

Start the development server:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

The migration creates `public.tasks`, validates task titles and statuses, and enables RLS policies for select, insert, update, and delete. Policies use `auth.uid()` to enforce task ownership.

- Migration: [`supabase/migrations/001_create_tasks.sql`](supabase/migrations/001_create_tasks.sql)
- Rollback: [`supabase/rollback/001_create_tasks.rollback.sql`](supabase/rollback/001_create_tasks.rollback.sql)

## Design system

- Tailwind entry point: [`src/app/globals.css`](src/app/globals.css)
- Thunder Design System stylesheet: [`src/design-system/t1-tailwind-v4.css`](src/design-system/t1-tailwind-v4.css)
- Typeface: Manrope
- Design source: [`rdThunderThailand/-thunder-design-system`](https://github.com/rdThunderThailand/-thunder-design-system)

## Deployment

Deploy the repository with Vercel and configure the environment variables listed above. Set `CORE_API_URL` to the deployed app's origin when the BFF and Core-compatible routes run in the same deployment. Set the Supabase Site URL to the deployed app URL.

Keep `.env.local` and secret values out of Git. The repository includes `.env.example` with variable names and non-secret local defaults.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Build the production app. |
| `npm run start` | Start the production server. |
