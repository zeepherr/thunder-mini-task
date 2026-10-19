# Phase 3 — Supabase Authentication Flow

**Status:** Not started
**Scope source:** [Project specification](../../../spec.md)

## 1. Detailed Explanation

This phase implements email and password registration, sign-in, and sign-out with Supabase Auth. Sessions must persist after a browser refresh and when opening a new tab. The app must prevent signed-out users from viewing or changing task data. Browser requests to Supabase must use only the anon key.

This phase addresses AC-01, AC-02, and AC-03, and supports AC-07 by blocking unauthenticated access.

## 2. To Take Action

- [ ] Implement email/password registration without email verification.
- [ ] Implement email/password sign-in and user-facing invalid-credential errors.
- [ ] Implement logout and clear the active session.
- [ ] Subscribe to Supabase auth state changes and keep the session available after refresh and in a new tab.
- [ ] Gate task access so unauthenticated users cannot view or manipulate task data.
- [ ] Use only the browser Supabase client and anon key; do not add service-role credentials to client code.
- [ ] Connect the existing app view to the authentication gate.
- [ ] Verify registration, sign-in, persistence, logout, and unauthenticated access behavior.

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

- **Email confirmation:** Is email confirmation disabled in the practice Supabase project, as required for AC-01? Verify this setting before starting authentication tests.
