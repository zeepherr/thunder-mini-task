# Project Specification: Mini Project — My Work List (`spec.md`)

**Target Directory:** `D:\Programming\ThunderOne\my-work-list`
**Design System Reference:** `https://github.com/rdThunderThailand/-thunder-design-system` / [[07 - ThunderOne Design System (thunderone-ui)]] (`t1-tailwind-v4.css`, `DS-01` to `DS-14`)
**Architecture Standards:** Next.js App Router + Supabase Client SDK + PostgreSQL Row Level Security (RLS) + Vercel Deployment
**Company Assignment Reference:** Ticket #3 / #4: "Mini Project — My Work List" (Due Date: October 23, 2026)

---

## 1. Problem Statement & Assignment Goal

The goal of this assignment is to develop and deploy an authentic, production-grade personal task management web application (**"My Work List"**) to test the developer's mastery of:
1. **Next.js (App Router)** & State/Session Management.
2. **Supabase Authentication & Row Level Security (RLS)** using the browser SDK without exposing backend secrets.
3. **ThunderOne Design System (`thunderone-ui`)** following semantic tokens, platform styling, and accessible async states.
4. **Vercel Cloud Deployment** with clean environment variable isolation and reproducible verification criteria.

---

## 2. In-Scope vs. Out-of-Scope (Boundaries)

### ✅ In-Scope (Strict Mandatory Criteria AC-01 to AC-12)
1. **Auth & Session Management**:
   - Register with email/password without email verification (AC-01).
   - Login & Logout with proper session clearing (AC-02).
   - Session persistence on browser refresh and opening in new tabs (AC-03).
   - Unauthenticated users cannot view or manipulate any task data (AC-07).
2. **Task CRUD & Lifecycle Operations**:
   - Create, read, edit details, and delete tasks.
   - Non-empty name validation (client + database constraint).
   - Optional details field.
   - Exact status values: `Todo`, `Doing`, `Done` with state transition controls (AC-04).
   - Confirmation dialog before deletion (destruction barrier).
3. **Database Security & Multi-Account Isolation**:
   - PostgreSQL table `public.tasks` with strict Row Level Security (RLS) enabled.
   - RLS policies ensuring Account A cannot read, edit, delete, or reassign Account B's tasks (AC-06).
   - No `service_role` secret keys in browser bundles or client code.
4. **ThunderOne Design System & UX**:
   - `t1-tailwind-v4.css`, Manrope Google Font, and semantic `--t1-*` tokens (`DS-01` to `DS-14`).
   - DS-11 mandatory async states: **Loading**, **Empty State**, and **Error State with retry**.
   - Input focus rings, accessible keyboard navigation, and meaningful icon names.
5. **Deployment & Deliverables**:
   - Dedicated GitHub repository with versioned lockfile.
   - Deployment on Vercel connected to practice Supabase project (AC-12).
   - Clean `README.md`, `.env.example`, and reproducible `schema.sql` migration scripts.
   - Verification evidence and Handoff brief following company standards.

### ❌ Out-of-Scope (Explicitly Excluded by Brief §2)
- Password reset / "Forgot Password" flows.
- OAuth / Social login (Google, GitHub).
- Team sharing or multi-user task delegation across tenants.
- Realtime WebSocket subscriptions.
- File attachments / storage uploads.

---

## 3. Core Architecture & Security Flow

```mermaid
sequenceDiagram
    actor User as User Browser
    participant App as Next.js App (Client Components)
    participant Auth as Supabase Auth (/auth/v1)
    participant DB as Supabase PostgreSQL (public.tasks)

    Note over User,DB: Registration & Login Flow (No Email Verification)
    User->>App: Submits Email & Password
    App->>Auth: supabase.auth.signUp() / signInWithPassword()
    Auth-->>App: Returns Auth Session + JWT
    App->>App: Session cached in browser storage / cookies

    Note over User,DB: Task CRUD Operations via Client SDK + RLS
    User->>App: Load Tasks List
    App->>DB: supabase.from('tasks').select('*') [with Bearer JWT]
    DB->>DB: RLS Policy: auth.uid() = user_id
    DB-->>App: Returns only User's own tasks (Account A cannot see B)
    App-->>User: Renders Tasks Grid with ThunderOne Design System
```

---

## 4. Data Model & RLS Security Specification

### PostgreSQL Table: `public.tasks`
```sql
CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL CHECK (btrim(title) <> ''),
    details text DEFAULT '',
    status text NOT NULL DEFAULT 'Todo' CHECK (status IN ('Todo', 'Doing', 'Done')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policy 1: SELECT (Only owner can read)
CREATE POLICY "Users can view their own tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: INSERT (Only owner can create for self)
CREATE POLICY "Users can insert their own tasks"
ON public.tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: UPDATE (Only owner can update self tasks and cannot transfer owner)
CREATE POLICY "Users can update their own tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: DELETE (Only owner can delete)
CREATE POLICY "Users can delete their own tasks"
ON public.tasks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

---

## 5. Project Directory Structure (`D:\Programming\ThunderOne\my-work-list`)

```text
my-work-list/
├── docs/
│   ├── HANDOFF.md                   # Formal assignment handoff document
│   └── AC_VERIFICATION.md           # Evidence checklist for AC-01 to AC-12
├── supabase/
│   ├── migrations/
│   │   └── 001_create_tasks.sql     # Schema + Constraints + RLS Policies + Comments
│   └── rollback/
│       └── 001_create_tasks.rollback.sql
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx           # ThunderOne 69px header with User pill & Logout
│   │   └── ui/
│   │       ├── StatusBadge.tsx      # DS-04 Status Pill for Todo, Doing, Done
│   │       ├── DeleteConfirmModal.tsx # Confirmation barrier before task deletion
│   │       └── Toast.tsx            # Semantic notifications
│   ├── config/
│   │   └── env.ts                   # NEXT_PUBLIC_SUPABASE_URL and ANON_KEY
│   ├── design-system/
│   │   └── t1-tailwind-v4.css       # Vendored ThunderOne tokens and Manrope font
│   ├── features/
│   │   ├── auth/
│   │   │   ├── AuthForm.tsx         # Toggleable Register / Login UI with validation
│   │   │   └── useAuth.ts           # Session subscriber hook
│   │   └── tasks/
│   │       ├── TaskBoard.tsx        # Task list, category filters, and CRUD triggers
│   │       ├── TaskFormModal.tsx    # Create/Edit Task dialog with validation
│   │       └── useTasks.ts          # Client SDK data operations with async states
│   ├── lib/
│   │   └── supabase.ts              # Browser Supabase client factory (Anon Key only)
│   └── app/
│       ├── layout.tsx               # Manrope font + Design system globals
│       ├── globals.css              # Imports t1-tailwind-v4.css + Tailwind v4
│       └── page.tsx                 # Primary app view (Auth gate -> TaskBoard)
├── .env.example                     # Clean template without secrets
├── package.json
├── tsconfig.json
└── README.md                        # Setup, RLS docs, and Vercel deployment guide
```

---

## 6. Phased Implementation Plan

- **Phase 1: Project Scaffolding & Design System Wiring**
  - Scaffold `my-work-list` with Next.js App Router, Tailwind v4, `@ant-design/icons`, `@supabase/supabase-js`.
  - Vendor `t1-tailwind-v4.css`, configure `Manrope` typography and `.env.example`.
- **Phase 2: Database Schema & Strict RLS Migration**
  - Create `001_create_tasks.sql` with table constraints and 4 atomic RLS policies.
  - Deploy to practice Supabase project and verify RLS isolation with 2 test accounts (Account A vs Account B).
- **Phase 3: Supabase Authentication Flow (Register, Login, Session)**
  - Implement `AuthForm.tsx` (email/password without confirmation).
  - Implement session listener (`onAuthStateChange`) ensuring session persistence on refresh and logout clearing.
- **Phase 4: Task CRUD & ThunderOne UI Implementation**
  - Implement `TaskBoard.tsx`, `TaskFormModal.tsx`, and `DeleteConfirmModal.tsx`.
  - Implement DS-11 states (Loading skeletons, empty state, error retry).
  - Add status transitions (`Todo` $\rightarrow$ `Doing` $\rightarrow$ `Done`).
- **Phase 5: Vercel Deployment, Verification & Handoff Delivery**
  - Push repository to personal GitHub.
  - Deploy to Vercel, configure production environment variables.
  - Execute AC-01 through AC-12 live tests on the deployed production URL and produce `HANDOFF.md`.

---

## 7. Acceptance Criteria Mapping (Verification Protocol)

| Criterion ID | Requirement | Verification Method |
| :--- | :--- | :--- |
| **AC-01** | Register without email confirmation | Create new account `user_test_1@example.com`; instant login without email. |
| **AC-02** | Login & Logout | Login, view tasks, click Logout, verify redirection and session teardown. |
| **AC-03** | Session Persistence | Hard refresh (`Ctrl + F5`) and open new tab; verify session remains intact. |
| **AC-04** | CRUD & Status Transitions | Create, update title/details, cycle `Todo` $\rightarrow$ `Doing` $\rightarrow$ `Done`, delete task. |
| **AC-05** | Data Persistence | Logout and log back in; verify all tasks persist in database. |
| **AC-06** | Database RLS Separation | Create task in Account A. Log into Account B via SDK; verify Account B receives empty array or error if attempting to access Account A's task ID. |
| **AC-07** | Unauthenticated Blocking | Call Supabase SDK without active session; verify database rejects all operations. |
| **AC-08** | Validation & Async States | Test blank titles, empty list state, loading skeletons, and network retry. |
| **AC-09** | Design System Adherence | Verify Manrope typography, `--t1-*` tokens, 12px gaps, and keyboard accessibility. |
| **AC-10** | Clear README Setup | Reviewer can clone repo and run with their own Supabase keys following README. |
| **AC-11** | Engineering Explanations | Clear documentation of Auth $\rightarrow$ SDK $\rightarrow$ DB RLS architecture. |
| **AC-12** | Production Vercel Delivery | Verify live deployed URL passes all tests on actual cloud deployment. |
