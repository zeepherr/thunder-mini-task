# Phase 4 — Task CRUD & ThunderOne UI

**Status:** Not started
**Scope source:** [Project specification](../../../spec.md)

## 1. Detailed Explanation

This phase implements reading, creating, updating, and deleting the signed-in user's tasks through the browser Supabase SDK. Blank titles are rejected in both the UI and database. Search, status filters, status changes, create/edit forms, and delete confirmation follow the Figma design and ThunderOne tokens. The interface also includes loading, empty, and retryable error states, plus keyboard accessibility.

This phase addresses AC-04, AC-05, AC-08, and AC-09, while preserving the RLS owner isolation established in Phase 2.

## 2. To Take Action

- [ ] Implement browser-SDK task read, create, update, and delete operations scoped to the authenticated user and protected by RLS.
- [ ] Validate non-empty task names in the UI and retain the database constraint from Phase 2.
- [ ] Support optional task details and the exact statuses `Todo`, `Doing`, and `Done`.
- [ ] Implement the task board, search, status filters, task cards, and create/edit/delete controls.
- [ ] Add the create/edit form and a confirmation dialog before deletion.
- [ ] Add loading, empty, and error states with retry behavior.
- [ ] Add accessible focus styles, keyboard navigation, and meaningful accessible names for icons and controls.
- [ ] Match the ThunderOne tokens and responsive Figma layouts; resolve the Done-pill color difference noted in Phase 1.
- [ ] Verify task persistence and status transitions across sign-out and sign-in.

### Figma references

These are frames on the Figma file's single page, `Page 1`:

| Design state | Desktop | Mobile |
| --- | --- | --- |
| Work list | [Desktop](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-12726) | [Mobile](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-12858) |
| Create task | [Overlay](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-12974) | [Overlay](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-19652) |
| Edit task | [Overlay](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-13131) | [Overlay](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-19832) |
| Delete task | [Confirmation](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-13288) | [Confirmation](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-20012) |
| Empty state | [Desktop](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-13424) | [Mobile](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-20169) |
| Load error | [Desktop](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-13473) | [Mobile](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-20219) |
| Loading | [Desktop](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-13522) | [Mobile](https://www.figma.com/design/moMl0Bb3Awx279DT8vWck2/Untitled?node-id=4-20272) |

### Acceptance criteria

Primary criteria: AC-04, AC-05, AC-08, and AC-09. Preserve the owner isolation established by AC-06 and AC-07.

## 3. My Concerns / Questions

- **Done pill color:** Figma uses `#059669` / `#D1FAE5`, while the ThunderOne success tokens are `#10B981` / `#ECFDF5`. Should implementation follow the exact Figma colors or use the ThunderOne success tokens?
