# Admin app — plan

Separate Next.js app at `admin/` (port 3001). Shares Express API with the user frontend. Not a second user dashboard.

**Out of v1:** ledger browser / CSV of someone else's statements; editing transactions or tax inclusion; rewriting `TaxComputation`; filing / accountant queues; per-profile billing; runtime edits to category rules or tax bands.

**Privacy:** prefer counts, statuses, errors. Open narrations / amounts only when debugging a case. Audit every write.

---

## Build order

| # | Feature | Route | Backend (today → need) |
| - | ------- | ----- | ---------------------- |
| 0 | Admin auth + audit log | all `/api/admin/*` | none → `isAdmin` / allowlist + audit table |
| 1 | Users & billing | `/users`, `/users/[id]` | `grantPaidAccessAsync` / `revoke` (SQL only) → admin APIs |
| 2 | Queues | `/queues` | job tables exist → list / cancel / release lease APIs |
| 3 | Support case (under user) | `/users/[id]` | same + import / classify / tax read APIs |
| 4 | Persona keywords | `/rules` | seed + user `/keywords` → admin CRUD; move off user Rules |
| 5 | Models + probe | `/models`, `/health` | `/api/models/*` live (any user) → admin-gate; probe |
| 6 | Overview | `/overview` | compose health + queue counts + signup metrics |

---

## 0 — Access

- Allowlist or `User.isAdmin`. Gate every `/api/admin/*`.
- Separate app (this one). No link in the user sidebar.
- Audit log: who, when, which user, what changed.
- Read-only by default on bank data.

---

## 1 — Users & billing

Billing lives on `User` (`isPaid`, `paidUntil`, `freeUsesUsed`), not on tax profile.

- Search by email / name.
- Card: created, Google id, profiles (name, kind, counts), session (UA, IP, expiry, revoke).
- Actions: grant paid (incl. open-ended = `isPaid` + `paidUntil` null), revoke, set end date, reset free uses.
- Usage: classify jobs, last status, 402-blocked.
- Until payment webhook ships, this screen **is** billing. Later: webhook event log + signed-payload tester.
- Show `SUBSCRIPTION_FREE_USES` as read-only (env, not a form).

Replaces manual SQL in `backend/docs/subscription-webhook.md`.

---

## 2 — Queues

- Ingestion: `processing` / `failed`, error, age; fail stuck jobs.
- Classification jobs: status, requester, scope, `lastClaimedAt` wait.
- Batches: `queued` / `leased` / `failed`, attempt, `leaseExpiresAt`, lastError; release lease / requeue.
- One active classify job per user (DB partial unique) — a wedged job blocks that user.

---

## 3 — Support case

One user (+ optional profile). Same data as queues, scoped.

- Imports: file, `customerName`, persona, status, error, staged vs confirmed counts.
- Classification: job + batches; cancel / release.
- Tax: deductions for a year; `TaxComputation` list (rule pack, period, `dataCompleteness`) — explain only, never rewrite.
- Personal keywords: rare audited edits.
- Leave include/exclude and category overrides to the user.

---

## 4 — Rules

- **PersonaKeyword** — admin CRUD per persona (`freelanceGig`, `smallBusiness`, `payeSideIncome`, `multiStream`): label, kind, weight. Usage check before delete. Move catalog off user `/dashboard/rules`; admin-gate `persona-keywords/all`.
- **Category catalog** — view-only (code in `categoryCatalog.ts`).
- **Rule packs** — view-only (`rule-packs/` JSON). Publish = deploy until packs become data.

---

## 5 — Models & health

Already partially built; not admin-gated.

- Classifier + PDF statement-reader: model id, max tokens, catalog listing, last probe / error.
- Prompt temperatures: `Setting` via `GET/PATCH /api/models/prompts`.
- Empty `OPENROUTER_API_KEY` → show "LLM skipped", not healthy green.
- Model id switch: env + redeploy for v1. Live `PUT` only after probe + audit.
- Health page: `/api/health-check`, `/ready`, classifier probe.

---

## 6 — Overview

Compose: DB ready, model status, classifier probe, queue depths, signups / paid vs free / free exhausted / failed uploads (24h).

---

## Scaffold (done)

| Path | Notes |
| ---- | ----- |
| `/login` | Google SSO (same cookie API; admin gate TBD) |
| `/overview` | placeholder |
| `/users`, `/users/[userId]` | placeholder |
| `/queues` | placeholder |
| `/rules` | placeholder |
| `/models` | placeholder |
| `/health` | placeholder |

Shell forked from `frontend/`: tokens, `@/components/ui`, axios + TanStack Query, auth session. No tax-profile header (admin is not profile-scoped).

---

## Ship checklist (backend)

- [ ] `isAdmin` / allowlist + `requireAdmin` on `/api/admin/*`
- [ ] Audit log for admin writes
- [ ] Admin user search + subscription grant/revoke/reset APIs
- [ ] Admin job/batch list + cancel / release lease
- [ ] Admin PersonaKeyword CRUD; remove user Rules page + Settings link
- [ ] Gate `/api/models/*` (and probe) to admin
- [ ] Overview aggregate endpoint (or compose existing)
