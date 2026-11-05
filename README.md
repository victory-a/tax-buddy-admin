# Tax Buddy Admin

Operator console for Tax Buddy. Separate Next.js app; shares the Express API with the user frontend.

- Plan: [`docs/PLAN.md`](./docs/PLAN.md)
- Dev: `npm install && npm run dev` → [http://localhost:3001](http://localhost:3001)
- API: same backend as `frontend/` (`NEXT_PUBLIC_API_URL`, default `http://localhost:8080`)

Shell (design tokens, UI primitives, Google SSO cookie client) is forked from `frontend/`. Feature work lands behind `/api/admin/*` once gated.
