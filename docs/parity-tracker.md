# React Migration Parity Tracker

This log captures the status of each surface in the React application. Update the table whenever a route, feature, or integration changes so stakeholders can quickly understand remaining work.

> **Corrected 2026-08-16.** This tracker had drifted badly out of date. It previously listed `StartHerePage.tsx`, `WalletPage.tsx`, and a `/start-here` and `/wallet` route as "✅ Complete" — none of those files exist. The app collapsed to a single-page experience plus a Deep Dive route at some point, and the tracker was never updated. Rows below now reflect what is actually in `src/pages`.

## Routes that exist today

| Route | React implementation | Status | Notes |
| ----- | -------------------- | ------ | ----- |
| `/` | `src/pages/HomePage.tsx` | ✅ Live | Cinematic scroll narrative plus the full FAQ accordion (`#faq-section`). |
| `/deep-dive` | `src/pages/DeepDivePage.tsx` | ✅ Live | Hero + table-of-contents chips, content lazy-loaded from `components/deepDive/sections.tsx`. |
| `*` | `src/pages/NotFoundPage.tsx` | ✅ Live | Catch-all. |

There are no other React routes. Any earlier reference to Wallet, Start Here, Pools, Builders, Remittances, or Digital Cash as separate pages describes the retired static site, not this application. That material now lives as sections within `/deep-dive`.

## Features

| Feature | Implementation | Status | Notes |
| ------- | -------------- | ------ | ----- |
| FAQ content | `components/faq/data.tsx` | ✅ Live | 46 items across 11 groups. Grouping is by question text, guarded by `components/faq/__tests__/data.test.ts`. |
| Deep Dive content | `components/deepDive/sections.tsx` | ✅ Live | 15 sections. Anchors guarded by `components/deepDive/__tests__/anchors.test.ts`. |
| Site search | `hooks/useSearchIndex.ts` + `components/search/SearchModal.tsx` | ✅ Live | Re-enabled 2026-08-16. Dependency-free scorer; index fetched lazily on first open. |
| Search index build | `tools/build-search-index.mjs` | ✅ Live | Runs in `prebuild`. Renders the real FAQ/Deep Dive React trees to text, so the index cannot drift from the site. |
| Status metrics | `public/status.json` | ⚠️ Unused | Nothing reads this file. `remittanceCorridors` is an unverified carry-over from an old snapshot. Either wire it up against a real source or delete it. |
| Supabase integration | — | ❌ Removed | Removed in the 2025-10-10 performance pass. FAQ and metrics are static JSON. Do not reintroduce without a plan for the runtime cost. |

## Known gaps

- `public/status.json` is dead data (see above).
- `npm run lint` currently reports 10 pre-existing problems in `Header.tsx`, `lenisScroll.ts`, and `SlidingStack.tsx` (unused vars, `any`, one exhaustive-deps warning). Unrelated to content or search; not addressed here.
- `package.json` still lists `gsap`, `lenis`, and `framer-motion` as dependencies even though the 2025-10-10 changelog entry describes purging them. `vendor-gsap` (114 kB) and `vendor-lenis` (18 kB) still ship in the build. Worth auditing.

## How to update this tracker

1. Add or adjust rows as routes and features land or are removed.
2. Link to the relevant PR or issue in the **Notes** column when you change a status.
3. When a surface is retired, delete the row rather than leaving it marked complete — a stale "✅" is worse than no row at all, as this file demonstrated.
