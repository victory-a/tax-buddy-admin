# Admin app — plan

Separate Next.js app at `admin/` (port 3001). Shares Express API with the user frontend. Not a second user dashboard.

**Out of v1:** ledger browser / CSV of someone else's statements; editing transactions or tax inclusion; rewriting `TaxComputation`; filing / accountant queues; per-profile billing; runtime edits to category rules or tax bands.

**Privacy:** prefer counts, statuses, errors. Open narrations / amounts only when debugging a case. Audit every write.

---

## Build order

| # | Feature | Route | Backend (today → need) |
| - | ------- | ----- | ---------------------- |
| 0 | Admin auth | all `/api/admin/*` | Google SSO + session → `ADMIN_EMAILS` + `requireAdmin` |
| 1 | Users & billing | `/users`, `/users/[id]` | live · audit + grant/revoke/reset/session |
| 2 | Queues | `/queues` | live · fail ingestion, cancel classify, release/requeue batches |
| 3 | Persona keywords | `/rules` | seed + user `/keywords` → admin CRUD; move off user Rules |
| 4 | Models + probe | `/models` | `/api/models/*` admin-gated |
| 5 | Overview | `/overview` | health signals + queue/account viz (Health page folded in) |
| 6 | Settings | `/settings` | subscription knobs via `Setting`; model config on `/models` |

**Out for now:** in-app support case under a user (imports / tax / personal keywords). Handle those tickets by email; queues + billing stay in admin.

Audit log ships with the first mutating admin API (users/billing), not with the gate alone.

---

## 0 — Auth

Reuse Google SSO + `tb_session`. Authorization on top — no second login system.

**Who is admin (v1):** `ADMIN_EMAILS` env (comma-separated, case-insensitive). Empty list → nobody. Later optional `User.isAdmin` with env as bootstrap override.

**Gate:** `requireAuth` → `requireAdmin` on every `/api/admin/*`. Non-admin → **403** (not 401). Also gate `/api/models/*`, persona-keyword catalog, classifier probe when those move.

**`GET /auth/me`:** include `isAdmin`. Admin UI: no session → `/login`; session + `!isAdmin` → forbidden page + logout; session + admin → shell.

**OAuth across two apps:**
- `ADMIN_URL` (dev default `http://localhost:3001`)
- Start Google with `?next=/path&app=admin` (admin) or path-only (user app)
- Callback redirects to `ADMIN_URL` or `FRONTEND_URL` from OAuth state — paths only, never absolute `next` URLs
- `CORS_ORIGIN` includes both origins
- Local same-origin `/api` proxy: each app gets its own host-scoped cookie (fine)
- Prod: `SESSION_COOKIE_DOMAIN=.parent` if admin + API share a parent domain

**Session:** one active session per user (existing). Admin sign-in revokes the user-app session for that Google account — accept for v1.

**Not doing:** separate admin passwords; client-trusted `isAdmin`; open redirects.

---

## 1 — Users & billing

Billing lives on `User` (`isPaid`, `paidUntil`, `freeUsesUsed`), not on tax profile.

- Search by email / name.
- Card: created, Google id, profiles (name, kind, counts), session (UA, IP, expiry, revoke).
- Actions: grant paid (incl. open-ended = `isPaid` + `paidUntil` null), revoke, set end date, reset free uses.
- Usage: classify jobs, last status, 402-blocked.
- Until payment webhook ships, this screen **is** billing. Later: webhook event log + signed-payload tester.
- Show free-uses limit from app config (editable on `/settings`).
- First mutating APIs get the audit log (who, when, target user, what changed).

Replaces manual SQL in `backend/docs/subscription-webhook.md`.

---

## 2 — Queues

- Ingestion: `processing` / `failed`, error, age; fail stuck jobs.
- Classification jobs: status, requester, scope, `lastClaimedAt` wait.
- Batches: `queued` / `leased` / `failed`, attempt, `leaseExpiresAt`, lastError; release lease / requeue.
- One active classify job per user (DB partial unique) — a wedged job blocks that user.

---

## 3 — Rules

- **PersonaKeyword** — admin CRUD per persona (`freelanceGig`, `smallBusiness`, `payeSideIncome`, `multiStream`): label, kind, weight. Usage check before delete. Move catalog off user `/dashboard/rules`; admin-gate `persona-keywords/all`.
- **Category catalog** — view-only (code in `categoryCatalog.ts`).
- **Rule packs** — view-only (`rule-packs/` JSON). Publish = deploy until packs become data.

---

## 4 — Models & health

Admin-gated (`requireAdmin` on `/api/models/*`).

- Classifier + PDF statement-reader: catalog listing, last probe / error.
- Empty `OPENROUTER_API_KEY` → show "LLM skipped", not healthy green.
- Model id / max tokens / prompt temperatures: **Configure** tab on `/models` (config + `GET/PATCH /api/models/prompts`).
- Catalog picker: `GET /api/models/catalog` (google / openai / anthropic / qwen / nvidia; vision subset for statement reader).
---

## 5 — Overview

Compose on one page (no separate Health nav): API/DB/OpenRouter/classifier signals, queue depths, paid/free mix, 24h signups / failed uploads. Deeper model detail stays on `/models`.

---

## 6 — Settings

`GET/PATCH /api/admin/config` — env bootstrap + `Setting` overrides + in-memory cache loaded at boot.

`/settings`: free uses + enforcement. `/models?tab=configure`: classifier/PDF model + max tokens (draft + Save, dirty markers).

**Stay in env:** secrets (`OPENROUTER_API_KEY`, OAuth, session), infra (DB, CORS, URLs), `OPENROUTER_APP_TITLE`, concurrency / worker knobs, `ADMIN_EMAILS`.

---

## Scaffold (done)

| Path | Notes |
| ---- | ----- |
| `/login` | Google SSO; `app=admin` on OAuth start |
| `/overview` … `/health` | placeholders |
| `/forbidden` | signed-in non-admin |

Shell forked from `frontend/`: tokens, `@/components/ui`, axios + TanStack Query, auth session. No tax-profile header.

---

## Ship checklist (backend)

- [x] `ADMIN_EMAILS` + `requireAdmin` on `/api/admin/*` (`GET /api/admin/ping`)
- [x] `ADMIN_URL` + OAuth `app=admin` redirect; CORS includes admin origin
- [x] `isAdmin` on `GET /auth/me`
- [x] Audit log for admin writes (`AdminAuditLog` + billing/session actions)
- [x] Admin user search + subscription grant/revoke/reset + revoke session APIs
- [x] Admin job/batch list + cancel / release lease / requeue
- [x] Admin PersonaKeyword CRUD + usage on delete; gate `/persona-keywords/all`; remove user Rules nav (redirect)
- [~] Support case under user — deferred; handle via email
- [x] Gate `/api/models/*` to admin; Models page live
- [x] Overview aggregate (`GET /api/admin/overview`) + health signals + light viz; `/health` redirects here
- [x] App config (`GET/PATCH /api/admin/config`) + admin Settings page
