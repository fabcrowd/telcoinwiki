# React Migration Parity Tracker

This log captures the status of each surface as we migrate from the legacy static build to the React + Supabase application. Update the table whenever a route, feature, or integration reaches parity so stakeholders can quickly understand remaining work.

| Page / Feature | Static source | React implementation | Parity status | Notes |
| -------------- | ------------- | -------------------- | ------------- | ----- |
| Home | `index.html` | `src/pages/HomePage.tsx` (`/`) | ✅ Complete | Supabase FAQ data still sourced from JSON during preview. Flip to Supabase RPC once migrations are verified in production. |
| Start Here | `start-here.html` | `src/pages/StartHerePage.tsx` (`/start-here`) | ✅ Complete | Content validated against June 2024 static snapshot. |
| Wallet | `wallet.html` | `src/pages/WalletPage.tsx` (`/wallet`) | ✅ Complete | Screenshots mirrored from `/assets/wallet`. Confirm responsive layout before launch. |
| Deep Dive hub | `deep-dive.html` | `src/pages/DeepDivePage.tsx` (`/deep-dive`) | ✅ Complete | Links fan out to static detail pages until React sub-routes ship. |
| FAQ detail pages | `faq/index.html` + JSON | _(TBD)_ | 🚧 In progress | Awaiting Supabase-backed FAQ route. Blocked on search + filter experience. |
| Search modal | `js/main.js` Lunr integration | `_planned_` | 🚧 In progress | Requires Supabase full-text endpoint or edge function. Track in Supabase backlog. |
| Status metrics | `status.json` injected at build time | `_planned_` | 🚧 In progress | Pending Supabase migrations + hooks to load live metrics. |
| Governance / TELx / Network deep dives | `governance.html`, `telx.html`, `network.html`, etc. | `_planned_` | ⏳ Not started | To be implemented as nested routes under `/deep-dive`. |
| Pools, Builders, Remittances, Digital Cash, About, etc. | Individual static HTML pages | `_planned_` | ⏳ Not started | Prioritize according to analytics / stakeholder feedback. |
| Supabase-powered search index build | `scripts/build-search-index.mjs` | `_planned_` | ⏳ Not started | Replace JSON-based Lunr index with Supabase materialized view + Vite plugin. |

## How to update this tracker

1. Add or adjust rows as new React routes and features land.
2. Link to the relevant PR or issue in the **Notes** column when you mark an item as complete.
3. Keep at least one row per critical integration (search, Supabase status metrics, analytics) so launch readiness is clear.
4. Once the React app fully replaces the static site, mark remaining static assets as archived and move this file to your post-launch docs.
