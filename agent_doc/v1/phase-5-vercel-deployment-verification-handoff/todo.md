# Phase 5 — Vercel Deployment, Verification & Handoff

**Status:** Not started
**Scope source:** [Project specification](../../../spec.md)

## 1. Detailed Explanation

This final phase deploys the app to Vercel and connects it to the practice Supabase project. It configures the Supabase URL and anon key in the production environment and verifies that no service-role secret is exposed in the browser. The deployed app is checked against AC-01 through AC-12, and verification evidence and a reviewer handoff document are prepared.

## 2. To Take Action

- [ ] Confirm the repository has a clean, versioned lockfile and setup documentation.
- [ ] Deploy the app to Vercel and connect it to the practice Supabase project.
- [ ] Configure the Supabase URL and anon key in the correct Vercel environments; verify no service-role secret is exposed to the browser.
- [ ] Confirm the production database migration and RLS policies are applied.
- [ ] Create `docs/AC_VERIFICATION.md` and record evidence for AC-01 through AC-12 against the deployed URL.
- [ ] Verify desktop and mobile layouts and the Figma-linked states on the production deployment.
- [ ] Create `docs/HANDOFF.md` with architecture, deployment details, verification results, and reviewer instructions.
- [ ] Confirm the deployed URL and handoff materials are ready for assignment review.

### Figma references

Use the relevant desktop and mobile work-list, auth, CRUD, empty, loading, and error frames from [Page 1](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled). Use the linked frames in the Phase 3 and Phase 4 checklists as the visual QA reference set.

### Acceptance criteria

Primary criteria: AC-10, AC-11, and AC-12. The verification record must cover AC-01 through AC-12.

## 3. My Concerns / Questions

- **Vercel project:** Which Vercel account or team should own the deployment and production URL?
- **Production access:** Who will provide the access needed to manage Vercel environment variables and the production Supabase project?
