# Phase 3 — Supabase Authentication Flow

**Status:** In progress
**Scope source:** [Project specification](../../../spec.md)
**Architecture:** Follow [the architecture guide](../architecture.md); auth UI calls the BFF, which calls versioned Core auth routes and manages HttpOnly cookies.

## 1. Detailed Explanation

This phase implements email and password registration, sign-in, and sign-out through `/api/auth/*` BFF routes and `/api/core/v1/auth/*` handlers. Sessions persist through HttpOnly cookies after refresh and in new tabs. The app must prevent signed-out users from viewing or changing task data. The server uses only Supabase's anon key, paired with the user's JWT; no service-role key is allowed.

This phase addresses AC-01, AC-02, and AC-03, and supports AC-07 by blocking unauthenticated access.

## 2. To Take Action

- [X] Implement email/password registration; the Supabase project must have email confirmation disabled for immediate sessions.
- [X] Implement email/password sign-in and user-facing invalid-credential errors.
- [X] Implement logout and clear the active session.
- [X] Restore the session through the BFF on mount/focus and persist it using HttpOnly access/refresh cookies across refreshes and tabs.
- [X] Gate task access so unauthenticated users cannot view or manipulate task data.
- [X] Keep auth tokens out of browser JavaScript and use the server-side Supabase anon client; no service-role credential is used.
- [X] Connect the app view to the authentication gate.
- [X] Keep the App Router page thin; keep auth UI in feature components and BFF-backed auth operations behind the feature service/provider boundary.
- [ ] Verify registration, sign-in, persistence, logout, and unauthenticated access behavior.
- [X] Implement the desktop and mobile auth layouts using the paired Figma frames.
- [X] Set a device-width mobile viewport, account for notched-screen safe areas, and keep auth controls touch-friendly on mobile.
- [ ] Verify the desktop and mobile layouts for each auth state.

### Implementation evidence

- Follow [the architecture guide](../architecture.md): the route composes the auth feature; feature components call `AuthService`; the provider owns session lifecycle.
- `src/features/auth/services/AuthService.ts` calls same-origin `/api/auth/*` endpoints. It does not create a browser Supabase client or handle raw tokens.
- `src/app/api/auth/*` implements BFF routes and HttpOnly cookie lifecycle; those routes call `/api/core/v1/auth/*` through `src/lib/core-api.ts`.
- `src/app/api/core/v1/auth/*` validates the app key and uses the Supabase anon client for registration, login, refresh, logout, and session validation.
- `src/config/server-env.ts` centralizes server-only configuration; `src/config/env.ts` exposes only the browser API base URL.
- `src/features/auth/components/` contains the authentication gate and form; `src/features/auth/index.ts` exposes the feature API.
- `src/app/page.tsx` only composes the auth provider and gate. The gate blocks the task area until a session exists.
- The Phase 3 UI matches the referenced desktop and mobile Figma auth frames and uses the local ThunderOne tokens and downloaded Figma SVG assets.
- `src/app/layout.tsx` enables `viewport-fit=cover`; the responsive styles account for safe-area insets and preserve 44px touch targets for primary mobile controls.
- Interactive Supabase behavior still needs a real-account check.

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
