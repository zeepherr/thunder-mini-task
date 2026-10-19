# Phase 3 — Supabase Authentication Flow

**Status:** In progress
**Scope source:** [Project specification](../../../spec.md)

## 1. Detailed Explanation

This phase implements email and password registration, sign-in, and sign-out with Supabase Auth. Sessions must persist after a browser refresh and when opening a new tab. The app must prevent signed-out users from viewing or changing task data. Browser requests to Supabase must use only the anon key.

This phase addresses AC-01, AC-02, and AC-03, and supports AC-07 by blocking unauthenticated access.

## 2. To Take Action

- [X] Implement email/password registration; the Supabase project must have email confirmation disabled for immediate sessions.
- [X] Implement email/password sign-in and user-facing invalid-credential errors.
- [X] Implement logout and clear the active session.
- [X] Subscribe to Supabase auth state changes and enable persisted sessions across refreshes and tabs.
- [X] Gate task access so unauthenticated users cannot view or manipulate task data.
- [X] Use the browser Supabase client with a public anon or publishable key; no service-role credential is used.
- [X] Connect the app view to the authentication gate.
- [X] Keep the App Router page thin; keep auth UI in feature components and Supabase Auth operations behind the feature service/provider boundary.
- [ ] Verify registration, sign-in, persistence, logout, and unauthenticated access behavior.
- [X] Implement the desktop and mobile auth layouts using the paired Figma frames.
- [ ] Verify the desktop and mobile layouts for each auth state.

### Implementation evidence

- Follow [the architecture guide](../architecture.md): the route composes the auth feature; feature components use an injected auth service; the provider owns session lifecycle.
- The shared browser client is in `src/lib/supabase.ts`; it enables session persistence and token refresh and accepts the configured public key name.
- `src/features/auth/providers/AuthProvider.tsx` restores the session and subscribes to auth-state changes through `AuthService`.
- `src/features/auth/services/AuthService.ts` wraps sign-up, sign-in, sign-out, and session operations using the injected browser client.
- `src/features/auth/components/` contains the authentication gate and form; `src/features/auth/index.ts` exposes the feature API.
- `src/app/page.tsx` only composes the auth provider and gate. The gate blocks the task area until a session exists.
- The Phase 3 UI matches the referenced desktop and mobile Figma auth frames and uses the local ThunderOne tokens and downloaded Figma SVG assets.
- TypeScript check and the Impeccable UI detector pass. Interactive Supabase behavior still needs a real-account check.

### Figma references

All references are frames on the Figma file's single page, `Page 1`:

- Desktop [Sign in — Default](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-12622)
- Desktop [Create account](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-12655)
- Desktop [Sign in — Invalid credentials](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-12690)
- Mobile [Sign in — Default](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-19543)
- Mobile [Create account](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-19577)
- Mobile [Sign in — Invalid credentials](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-19613)

### Acceptance criteria

Primary criteria: AC-01, AC-02, and AC-03. Authentication gating contributes to AC-07.

## 3. My Concerns / Questions

- **Email confirmation:** Verify that email confirmation is disabled in the practice Supabase project before confirming AC-01. If Supabase returns no session after sign-up, the UI reports that project setting.
- **End-to-end check:** Run the sign-up, sign-in, refresh/new-tab persistence, sign-out, and signed-out gating checks against the configured project before marking this phase complete.
