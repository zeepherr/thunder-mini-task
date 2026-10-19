# Phase 5 — Vercel Deployment, Verification & Handoff

**Status:** Not started
**Scope source:** [Project specification](../../../spec.md)
**Architecture:** Follow [the architecture guide](../architecture.md); document feature → transport → BFF → `/api/core/v1*` → user-JWT RLS and server-only environment configuration.

## 1. Detailed Explanation

This final phase deploys the app to Vercel and connects it to the practice Supabase project. It configures the Core API URL/key and Supabase URL/anon key as server-only environment variables, then verifies the BFF and user-JWT RLS path. No service-role secret is used or exposed. The deployed app is checked against AC-01 through AC-12, and verification evidence and a reviewer handoff document are prepared.

## 2. To Take Action

- [ ] Follow [the architecture guide](../architecture.md) when documenting the app; show the feature → transport → BFF → Core route → user-JWT anon client → RLS data flow.
- [ ] Verify browser requests go only to the same-origin BFF and task access remains protected by PostgreSQL RLS.
- [ ] Keep `CORE_API_URL`, `CORE_API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY` server-only; never configure a service-role key.
- [ ] Confirm the repository has a clean, versioned lockfile and setup documentation.
- [ ] Deploy the app to Vercel and connect it to the practice Supabase project.
- [ ] Configure the Core API URL/key and Supabase URL/anon key in the correct Vercel server environments; verify no secret is exposed to the browser.
- [ ] Confirm the production database migration and RLS policies are applied.
- [ ] Create `docs/AC_VERIFICATION.md` and record evidence for AC-01 through AC-12 against the deployed URL.
- [ ] Verify both desktop and mobile layouts for every implemented Figma page/state on the production deployment.
- [ ] Create `docs/HANDOFF.md` with architecture, deployment details, verification results, and reviewer instructions.
- [ ] Confirm the deployed URL and handoff materials are ready for assignment review.

### Figma references

Use the relevant desktop and mobile work-list, auth, CRUD, empty, loading, and error frames from [Page 1](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled). Use the linked frames in the Phase 3 and Phase 4 checklists as the visual QA reference set.

### Acceptance criteria

Primary criteria: AC-10, AC-11, and AC-12. The verification record must cover AC-01 through AC-12.

## 3. My Concerns / Questions

- **Vercel project:** Which Vercel account or team should own the deployment and production URL?
- **Production access:** Who will provide the access needed to manage Vercel environment variables and the production Supabase project?
