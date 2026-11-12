# Operational core — 13/11/2026

This branch uses Prisma/PostgreSQL for accounts, children, activity observations, roadmaps, trials and consultation requests. The original working tree at D:/Học/bino-nurture-path was not modified.

## Implemented
- Signed HttpOnly session with expiry; ownership checks for child, activity, roadmap and consultation actions. Client-supplied user IDs do not establish identity.
- Registration requires email verification; random verification token expires after 24 hours. SMTP failure is reported.
- Database activity journal and last-seven-days totals replace fabricated developmental scores.
- AI roadmap receives age, condition, requested goal and recent observations; response is validated and failures are visible. Saved roadmaps can be reopened.
- Chat uses authenticated ownership-checked child observations. The public arbitrary Ollama proxy is disabled.
- Server-persisted one-time 14-day trial and expiry status.
- Consultation requests persist, can be cancelled while pending, and have a restricted operations queue at /operations. Operator must contact the parent and agree the appointment before confirming. No notification is sent automatically.
- Unverified expert profiles and inflated homepage metrics removed. Placeholder checkout no longer solicits money or falsely claims payment confirmation.
- Privacy/about pages and navigation corrections.

## Setup
1. Install Node and run `npm ci` in this source folder.
2. Supply server environment variables from `.env.example`. Set PostgreSQL URLs, a random BINO_SESSION_SECRET of at least 32 characters, SMTP, APP_URL, LLM provider/key/model and BINO_OPERATOR_EMAIL.
3. Create a separate empty staging database first. Run `npm run db:deploy` against that database. Run `npm run db:generate`.
4. For an existing database matching the OLD schema, back up and compare its actual schema first. Mark only the baseline as applied: `npx prisma migrate resolve --applied 202611130001_baseline`. Then run `npm run db:deploy`. Never mark the operational migration as applied without executing it. Do not run migrations against existing production until staging and backup restore are verified.
5. `npm run typecheck`, `npm test`, `npm run build`, `npm run dev`.
6. Configure the same variables in Vercel, with APP_URL set to the deployed HTTPS domain. The build command includes Prisma generation and server dependency packaging.

## Verification completed
- TypeScript check passed.
- Production Vite client/server build passed.
- 3 signed-session tests passed (tampering, expiry/malformed/absent session, missing secret).
- Local browser smoke test verified an empty tracker without invented progress and consultation sign-in guidance; no browser errors observed in those views.
- SQL migrations generated offline. They have NOT been applied to any existing database.

## Release gates still open
- PostgreSQL integration tests and two-account authorization tests: Docker daemon was unavailable. No independent test database was provided. Database writes, migrations, trial concurrency and full login flows are not yet verified end-to-end.
- AI output quality and timing need evaluation against a real configured provider; JSON validity does not prove the requested clinical/activity constraints are satisfied.
- Real mail delivery, resend verification, password recovery, persistent abuse/rate limits, monitoring, backups and restore rehearsal still need implementation/verification.
- Commercial payment gateway, signed webhook, reconciliation and refunds are not implemented. Checkout intentionally remains unavailable.
- Resource library still reads the pre-existing Supabase/catalog fallback. Premium is not yet enforced consistently across every download/editor action; do not sell subscriptions yet.
- Lesson Builder persistence/export access, expert onboarding and booking notifications require additional work.
- Privacy text requires actual controller/provider/contact/retention details and operational review before public launch.
- Frontend mobile/accessibility and full E2E tests remain required.
- `.env` was tracked in repository history. It is removed from tracking on this branch. Review and rotate real credentials from that history before deployment; this change does not erase history or revoke keys.

This is a tested implementation milestone, not a certification that the entire product is production-ready. No push, production migration, deployment, real consultation email or payment was performed.
