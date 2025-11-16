# Changelog

## 2025-10-11 – Maintenance deploy trigger

- Recorded a lightweight maintenance entry to ensure Netlify picks up the
  latest repository state and redeploys today’s updates.

## 2025-10-10 – Performance remediation (scrolling fixed)

- Removed Lenis + GSAP smooth-scrolling and ScrollTrigger timelines.
  - Replaced `useSmoothScroll` with a minimal hook that only exposes the
    user’s reduced‑motion preference.
  - Switched hash scrolling to native behavior.
  - Deleted timeline hooks and CSS rules tied to Lenis.
- Disabled client‑side search indexing (elasticlunr) and removed its bundle.
  - Search modal now renders a temporary notice and does no indexing at runtime.
- Removed Supabase runtime usage and dependency; FAQs and Status metrics now
  load from static JSON fallbacks.
  - Deleted `supabaseClient` and gated video sources to ignore signed URLs.
  - Updated UI copy to reflect fallback/cached data where appropriate.
- Test infra: kept Jest only; updated `useSmoothScroll` test to Jest APIs.
- Build system/Netlify:
  - Purged `gsap`, `lenis`, `elasticlunr`, and `@supabase/supabase-js` from
    `package.json` and lockfile; Netlify `npm ci` now passes.
  - Current production build artifacts: main JS ~460 kB gz ~140 kB, no
    `vendor-gsap` or Lenis chunks.

Validation checklist:
- `rg "gsap|lenis" dist` returns no matches.
- `rg supabase dist` returns no matches.
- `npm run lint`, `npm test -- useSmoothScroll`, `npm run build` succeed.
- Optional: run `npm run perf` with `CHROME_PATH` set to verify Lighthouse
  TBT/TTI are back to normal.

Notes:
- Search and live metrics can be revisited later via server‑side indexing or
  by wiring a secure API layer. For now, the runtime workload and broken
  external calls are eliminated to prioritize responsiveness.
