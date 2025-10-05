# Telcoin Wiki

This repository hosts both the legacy static site and the in-progress React + Supabase rewrite for telcoinwiki.com. Use the [React Migration Handbook](docs/migration.md) for detailed setup steps, deployment notes, and the switchover checklist.

## Project structure

- `telcoinwiki-react/` – Vite + React application that will replace the static build.
- `supabase/` – SQL migrations and seed data powering FAQs and status metrics.
- `assets/`, `styles/`, `*.html` – Current production static site assets (to be archived post-launch).
- `docs/parity-tracker.md` – Status log showing remaining gaps between static and React implementations.

## Getting started

```bash
# Install root tooling
npm install

# Install React dependencies
npm --prefix telcoinwiki-react install

# Start the React dev server
npm run dev
```

Check the [migration handbook](docs/migration.md) for Supabase connection steps, preview deployment behavior, and the launch checklist.

## Supabase diagnostics & verification

- Required environment variables (set in Netlify + local `.env`):
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- After deploy, visit **/supabase-test/** to see live status.
- Automated check:
  - Add the same four variables as **GitHub Secrets** if you want CI (React/Vite + verification scripts):
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Run **Actions → Verify Supabase** or `npm run verify:supabase` locally.
