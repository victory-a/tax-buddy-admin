# Tax Buddy Admin — Agent Context

**Read:** [`docs/PLAN.md`](./docs/PLAN.md) → this file.

1. **Operator app only.** No user ledger/tax editing. Bank narrations stay read-gated; prefer counts/status over raw rows.
2. **Design system** — `@/components/ui`, tokens in `globals.css`, `cn` from `@/lib/utils`. Light theme only.
3. **Backend via HTTP** — `NEXT_PUBLIC_API_URL`, `withCredentials: true`. Types + hooks in `src/lib/api/`. camelCase on the wire.
4. **Admin auth** — Google SSO with `?app=admin`. Backend `ADMIN_EMAILS` + `requireAdmin`. UI: `user.isAdmin` or `/forbidden`. 403 ≠ 401.
5. **Audit every write** when implementing mutations (who, when, which user, what changed).
6. **Smallest `"use client"` boundary.** Thin `page.tsx`; feature UI under `components/<feature>/`.
7. **Keep components ≤ ~250 lines.** Split panels/sections into sibling files instead of growing one view.
8. **Port 3001** — do not collide with the user frontend on 3000.

| Item | Location |
| ---- | -------- |
| Feature plan | `docs/PLAN.md` |
| API client | `src/lib/api/client.ts` |
| Auth session | `src/lib/api/session.ts` |
| Nav routes | `src/components/shell/sidebar-nav.ts` |
