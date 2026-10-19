# Phase 1 — Project Scaffolding & Design System Wiring

**Status:** Complete
**Scope source:** [Project specification](../../../spec.md)
**Architecture:** Follow [the adapted architecture guide](../architecture.md); keep browser-safe Supabase environment access limited to public keys.

## 1. Detailed Explanation

This phase establishes the Next.js App Router foundation and integrates Tailwind CSS v4 with the ThunderOne Design System. It adds the Manrope font, icon and Supabase browser SDK dependencies, and environment variable examples. The app can run locally, providing the foundation for the remaining phases.

## 2. To Take Action

- [x] Set up Next.js App Router and TypeScript.
- [x] Configure Tailwind CSS v4 and its PostCSS integration.
- [x] Add `@ant-design/icons` and `@supabase/supabase-js` dependencies with a versioned lockfile.
- [x] Vendor the ThunderOne Tailwind v4 tokens and use Manrope typography.
- [x] Hoist the Manrope CSS import before Tailwind output so Next.js can compile the global stylesheet; preserve the design token declarations.
- [x] Add `.env.example` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` placeholders only.
- [x] Document local installation and startup in `README.md`.
- [x] Confirm the development server and compiled stylesheet return HTTP 200.

### Figma references

The file has one page (`Page 1`) and 20 frames. These work-list frames establish the visual context for the design-system setup:

- [Desktop work list — 1280 × 960](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-12726)
- [Mobile work list — 390 × 1239](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-12858)

The inspected desktop frame uses a 69px header, 16px task-card radius, 12px control radius, and fully rounded status pills. The Todo and Doing colors match ThunderOne tokens; the Done pill colors differ and should be accounted for when implementing status styles in Phase 4.

### Completion evidence

- Setup files: `package.json`, `package-lock.json`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `.env.example`, and `README.md`.
- App entry points and global styling: `src/app/`.
- Browser-safe environment lookup: `src/config/env.ts`; it accepts only the Supabase URL and public anon/publishable key.
- Vendored design tokens: `src/design-system/t1-tailwind-v4.css`.
- Startup and CSS delivery verified at `http://localhost:3000` after the import-order fix.

## 3. My Concerns / Questions

- There are no unresolved questions for Phase 1.
