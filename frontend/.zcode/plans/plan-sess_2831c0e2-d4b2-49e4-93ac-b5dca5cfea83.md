## Goal
Make the Members section cleaner (code) and more premium (visual), consistent with the rest of the app. Three parts: (1) refactor the provider to your own 3-file convention, (2) split the 910-line `MembersList.jsx` into focused files like `layout/`, (3) a bolder visual redesign of the card + hero. Plus small correctness fixes.

> Note: `MembersProvider` is **already wired correctly** — it's route-scoped to `/app/members/*` via `MembersLayout` in `src/app/router-helpers.jsx`. That's the right design (member data is only needed on member pages), so I'm keeping it route-scoped and only cleaning up its *file structure*, not promoting it app-wide.

---

## Part 1 — Refactor the provider to the theme/auth convention
Your `theme/` and `features/auth/` providers split into `<X>.jsx` + `context.js` + `useX.js` + `index.js`. The members provider crams all of that into one `MembersContext.jsx`. Split it the same way:

**Delete:** `src/features/members/MembersContext.jsx`

**Create:**
- `src/features/members/context.js` — bare `createContext(null)` + the `@typedef Member` JSDoc.
- `src/features/members/MembersProvider.jsx` — provider component: `useState(seedMembers)` + `addMember/updateMember/removeMember/getMember` + the `useMemo` value. Private helpers (`makeId`, `deriveNameFromEmail`) stay here.
- `src/features/members/useMembers.js` — the `useMembers()` consumer hook (throws if used outside provider).

**Update:** `src/features/members/index.js` barrel to re-export from the new files (keeps `MembersProvider`, `useMembers`, `MembersList`, `AddMember`, `EditMember`, `UserForm` — external imports via `@/features/members` are unaffected).

**Update internal imports** in the three pages: `import { useMembers } from "../useMembers"` (direct, avoids barrel cycle).

Surface API is **unchanged**, so consumers need no logic changes.

---

## Part 2 — Split the 910-line `MembersList.jsx`
Mirror your `layout/` folder-per-group convention. The page becomes a lean composition root; pieces move into focused files:

```
src/features/members/
  lib/
    format.js                 # formatDate, formatRelative, buildPageList
  components/
    pills.jsx                 # RolePill, StatusPill
    StatTile.jsx
    RoleFilterChip.jsx
    EmptyMembers.jsx
    member-card/
      MemberAvatar.jsx        # avatar + role ring + active dot
      MemberActionMenu.jsx    # the [⋯] popover (edit / copy email / remove)
      MemberCard.jsx          # the card shell (Part 3 redesign)
      MemberCardSkeleton.jsx
  pages/
    MembersList.jsx           # lean: state + filtering + layout composition
```
All presentational logic is preserved; only the file boundaries change. (`UserForm.jsx` is untouched.)

---

## Part 3 — Bolder visual redesign (chosen)
Reuses your existing tokens only — `glass-card`, `texture-paper`, `highlight-edge`, farm palette (`leaf/sage-deep/clay/wheat/sky-warm/soil`), `pattern-contour`, and the per-role palettes from `src/constants/roles.js`. No new CSS needed.

**MemberCard (reworked):**
- **Role-tinted surface** — card gets a subtle `r.bgSoft` wash so each card carries its role's hue (was neutral).
- **Centered avatar headline** — larger avatar with role-colored ring + a role badge chip + active status dot, name + `You` badge, email below — all centered.
- **Condensed inline meta** — replaces the 2-column bordered grid with compact icon-led rows (`Joined`, `Last active` / `Pending`), less boxy.
- Keeps the role gradient top strip, hover lift, action menu, and bottom role-description line.

**Hero (reworked):** more compact icon-headline treatment — section icon tile, title, an inline "N active · N pending" summary line, and the Copy-link / Add-member actions on the right. Keeps the gradient + `pattern-contour` + blobs.

**Stat tiles + filter bar + empty state:** lighter polish for consistency (unified accent tokens, spacing) — no structural change.

---

## Part 4 — Correctness fixes (from the "check it is correct" ask)
1. **Destructive remove has no confirmation.** The card action menu removes a member instantly; `EditMember` confirms via Popover. I'll add a lightweight confirm step to the card's remove (reusing the `Popover`/`Dialog` primitive) for parity and safety.
2. **Use the canonical owner check.** `EditMember.jsx` uses an inline `(user?.role || "").toLowerCase() === "owner"`; switch to the existing `checkIsOwner` helper from `@/lib/utils` (used elsewhere).

---

## Part 5 — Verification
- `npm run lint` clean (the repo uses ESLint + Prettier with `prettier-plugin-tailwindcss`).
- `npm run build` succeeds.
- Manual: `/app/members` renders, role/status/search filters + pagination work, add/edit/remove flows work, dark + light themes look right.

---

## Files touched
**New (11):** `context.js`, `MembersProvider.jsx`, `useMembers.js`, `lib/format.js`, `components/pills.jsx`, `components/StatTile.jsx`, `components/RoleFilterChip.jsx`, `components/EmptyMembers.jsx`, `components/member-card/{MemberAvatar,MemberActionMenu,MemberCard,MemberCardSkeleton}.jsx`
**Rewritten:** `pages/MembersList.jsx` (lean), `index.js` (barrel)
**Edited:** `pages/AddMember.jsx`, `pages/EditMember.jsx` (import path + `checkIsOwner`), `components/member-card/MemberActionMenu.jsx` (remove confirm)
**Deleted:** `MembersContext.jsx`