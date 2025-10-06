# React Migration Handbook

This guide consolidates the commands and checklists needed to build, test, and launch the React + Supabase rewrite while the legacy static site remains in production.

## Local development workflow

### Prerequisites
- Node.js 22.x (match `.nvmrc` / Netlify build settings)
- npm 10+
- Supabase CLI (`brew install supabase/tap/supabase` or download from https://supabase.com/docs/guides/cli)

### Install dependencies
```bash
# Install root tooling (lint, link checks, scripts)
npm install

# Install React app dependencies
npm --prefix telcoinwiki-react install
```

### Run the React dev server
```bash
# From the repo root
npm run dev
# or, inside telcoinwiki-react
cd telcoinwiki-react
npm run dev
```
The app boots on http://localhost:5173 by default. Environment variables prefixed with `VITE_` are read from `.env` or `.env.local` inside `telcoinwiki-react/`.

### Troubleshooting merge conflicts

GitHub's web conflict editor cannot open `telcoinwiki-react/package-lock.json` because the file is ~272 KB across 7,961 lines. Resolve conflicts locally instead of attempting to edit in the browser.

```bash
git fetch origin
git checkout <branch>
git merge origin/main
npm --prefix telcoinwiki-react install
git add telcoinwiki-react/package-lock.json
git commit
git push
```

## Supabase migrations & seeds

The SQL lives under [`supabase/`](../supabase/). You can apply it with either the Supabase CLI or direct `psql` commands.

```bash
# Start a local Supabase stack (optional, for local API + Postgres)
supabase start

# Reset the database to match migrations/ + seeds/
supabase db reset

# To push migrations only (no seed)
supabase db push

# To rerun seeds against an existing database
psql "$SUPABASE_DB_URL" -f supabase/seeds/20240611121000_seed_faq_and_status.sql
```

Seeds are idempotent—rerunning them will upsert the latest FAQ entries, tags, and status metrics.

### Syncing the React app with Supabase
1. Copy `.env.example` (or create `.env.local`) under `telcoinwiki-react/` with:
   ```ini
   VITE_SUPABASE_URL=... # project REST URL
   VITE_SUPABASE_ANON_KEY=...
   ```
2. Restart `npm run dev` so the client picks up new credentials.
3. Use `npm run verify:supabase` from the repo root to validate connectivity before pushing.

## Preview deployments (Netlify branch deploys)

Branch deploys build the React app so stakeholders can verify pages before DNS cutover.

- Every non-production branch pushed to GitHub triggers a Netlify branch deploy.
- Build command: installs root + React dependencies, exports Supabase env vars, and runs `npm run build` (Vite).
- Publish directory: `telcoinwiki-react/dist`.
- Environment variable `DEPLOY_CONTEXT=preview` is available for gating preview-only UI (e.g., parity banner).

Production deploys continue to publish the static site until the React app clears the launch checklist.

## Final switchover checklist

Use this list to coordinate the go-live weekend. Link each item to the relevant issue or doc in the [parity tracker](./parity-tracker.md).

- [ ] **Content freeze announced** – communicate a freeze window and merge React PRs ahead of time.
- [ ] **Supabase data audit** – compare live tables against `supabase/seeds/` and parity docs. Run `supabase db diff` to ensure no drift.
- [ ] **Accessibility review** – audit React routes with tooling (axe, Lighthouse) plus manual keyboard/assistive tech checks.
- [ ] **Analytics & SEO verification** – confirm metadata, structured data, sitemap, and analytics scripts match or exceed the static site.
- [ ] **Search & status parity** – ensure Supabase-backed search and status metrics are live and reflected in the parity tracker.
- [ ] **Netlify production toggle** – update `netlify.toml` production context to publish the React build, then trigger a deploy.
- [ ] **Stakeholder sign-off** – circulate preview deploy URL + QA notes for explicit approval.

## Post-launch cleanup

Once the React site is live:

1. Archive or remove the legacy static HTML, CSS, and `dist/` assets. Keep a tag or branch if you need historical reference.
2. Update onboarding material (including `README.md`, internal runbooks, and contributor guides) to refer only to `telcoinwiki-react/`.
3. Delete unused Netlify redirects/headers tied to the static build if the React router handles them.
4. Move the [parity tracker](./parity-tracker.md) to an archive section or close it out once all rows read ✅.
