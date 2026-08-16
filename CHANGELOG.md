# Changelog

## 2026-08-16 (4) – Network Atlas: the 3D model, adapted into the site

Ported the standalone WebGL "Telcoin Network Atlas" artifact into a real
`/atlas` route, rebuilt for the site rather than dropped in as-is.

### What changed from the artifact

- **Rewritten as typed, per-instance TypeScript**, not a page-scoped IIFE:
  `lib/atlas/mat4.ts` (matrix math), `lib/atlas/data.ts` (ecosystem/consensus
  data), `lib/atlas/engine.ts` (the WebGL engine), `components/atlas/NetworkAtlas.tsx`
  (the React shell). All simulation/camera/picking state lives inside the
  engine's closure — nothing at module scope — so multiple mounts can never
  share state.
- **Full lifecycle correctness for an SPA.** The artifact was a single static
  page that never unmounted; this route can mount and unmount many times per
  session. `destroy()` now cancels the rAF handle, aborts every listener via
  a single `AbortController`, disconnects both observers, deletes GL buffers
  and programs, and calls `WEBGL_lose_context` — proactively releasing the
  context rather than waiting on GC, since browsers cap live WebGL contexts
  per page. Verified with 3x real SPA navigate-away-and-back: renders
  correctly every time, zero console errors.
- **Own visual identity, not a foreign console.** The HUD is restyled from
  the site's own `--tc-*` tokens (border, ink, accent) instead of a bespoke
  cyan/gold palette. Added one new semantic-only pair, `--tc-gold` /
  `--tc-gold-soft`, explicitly for "regulated money" vs. "network machine" —
  not a brand color. The artifact's own top brand bar was dropped entirely;
  the site's real header does that job.
- **Two new capabilities the standalone page didn't need:**
  - Pauses the render loop when the tab is hidden or the stage scrolls out
    of view (`IntersectionObserver` + `visibilitychange`) — real savings now
    that this lives inside a normal scrollable page instead of being the
    entire viewport.
  - `/atlas?scene=eco&node=<id>` deep links pre-select a scene and entity on
    mount. The search index now emits one of these per ecosystem entity
    (8 new docs), so searching "Digital Asset Bank" lands pre-focused on
    that exact node in the 3D graph, not just on the page.
- **Grounded in the rest of the wiki, not an island.** Every ecosystem
  entity's inspector panel carries a "Learn more" link into the matching
  Deep Dive or Protocol section (TEL → `/protocol#proto-token`, TELx →
  `/deep-dive#deep-incentives`, etc.), and the DAG inspector links to
  `/protocol#proto-consensus` / `#proto-lifecycle`. These are plain `<a>`
  tags (so right-click / open-in-new-tab still work) with a delegated
  click handler that hands plain left-clicks to the router instead of a
  full page reload. Added matching callouts on the Protocol and Deep Dive
  hero cards linking back to `/atlas`.
- **Lazy-loaded route** (12.4 kB gzipped) — the shaders and engine stay off
  every other page's bundle.

### Tests (24 new, 77 total across 11 suites)

- `mat4.test.ts` — multiply-by-identity, `lookAt` orthonormality and eye
  placement, `perspective`/`projectPoint` clip-space behavior.
- `data.test.ts` — every ecosystem entity's `href` resolves to a real
  Deep Dive or Protocol section id (regression guard, same shape as the
  existing anchor tests); no orphan nodes; quorum is a genuine 2f+1
  majority; `isEcosystemId` accepts every real id and rejects garbage.
- `wiring.test.ts` — route/nav/header/mega-menu/page-meta all wired; every
  `/atlas?scene=eco&node=` reference anywhere in source names a real entity.
- `NetworkAtlas.test.tsx` — the no-WebGL fallback path (stubbed
  deterministically, since jsdom's `getContext('webgl2')` behavior isn't
  consistent across versions) renders without throwing; mount → unmount →
  mount survives; garbage query params don't crash.
- `jest.config.ts` `testMatch` extended to include `src/lib/**/__tests__/**`
  — the existing glob only covered `components/` and `hooks/`, so these
  wouldn't have run at all otherwise.

### Verified

tsc clean; 77/77 tests; lint unchanged at the pre-existing 10 problems;
clean production build. Real-browser pass (48 checks): WebGL renders and
draws real pixels, DAG simulation advances and commits, play/pause/resume,
certificate and ecosystem-entity picking, cross-reference jump chips,
SPA-navigating "Learn more" links (confirmed no full reload), header/mega-menu/
callout navigation, 3x remount survival, valid and invalid deep-link query
params, viewport-intersection pause verified with a genuine occlusion
(not a too-short test viewport, which produced one false failure caught
and root-caused before landing), 390px/768px with no overflow, and search
surfacing the new per-entity `/atlas` docs alongside the existing Deep
Dive ones.

## 2026-08-16 (3) – Protocol reference page

New `/protocol` route: a working reference for Telcoin Network itself, researched
from Telcoin's own published documentation (docs.telcoin.network and
telcoin.org/documentation) rather than written from model knowledge.

### Content — 13 sections

Overview, modular architecture (the four layers as the docs frame them),
transaction lifecycle, Narwhal/Bullshark consensus, the native token and the
`0x7e1` TEL precompile, epochs and committee selection, the validator membership
model and staking, fees and the gas limit penalty, EVM compatibility, the
security model, validator hardware requirements, networks and endpoints, and a
full index of every primary documentation source.

Specifics captured that were not on the wiki before: mainnet chain ID 487 /
testnet 2017, sub-half-second finality, the 30M gas limit per block, the 1M TEL
launch stake, the `weight = stakeAmount x consensusHeaderCount` reward formula,
the six validator lifecycle states, epoch-boundary base fee adjustment with base
fees accruing to governance rather than being destroyed, the quadratic gas limit
penalty below 10% utilisation (exempt at or below 210,000 gas), Axelar/wTEL
bridging, Fisher-Yates committee shuffling seeded from an aggregated BLS
signature, and the published node hardware specification.

Contract addresses are deliberately *not* reproduced — the page says so and
points at the primary source, because address substitution is a real attack and
a community wiki is where someone would try it.

### Design

Built with the site's own system rather than a new one: `tc-card-glass` hero,
`toc-chip` navigation, the existing deep-dive section chrome, and the telcoin-*
tokens throughout. New elements (stat grid, spec tables, formula blocks,
definition lists, source callouts) are all defined from existing tokens.
Restored list markers on the new lists, which Tailwind preflight and
`critical.css` both strip.

### Integration

- Lazy-loaded route so the reference stays off the main bundle (10.2 kB gzipped).
- Added to header nav (desktop + mobile), NAV_ITEMS, PAGE_META and the mega menu.
- Indexed by `tools/build-search-index.mjs`, which now renders both the deep-dive
  and protocol content trees; the index grew from 17 to 31 documents. Verified
  that "gas limit penalty", "validator hardware", "precompile", "Axelar",
  "ConsensusNFT" and "epoch boundary" each resolve to the correct section.
- Deep links now open the targeted section and scroll to it — the existing Deep
  Dive drops you on a collapsed accordion, which made anchors from search
  results much less useful.
- New `protocol/__tests__/sections.test.ts` guards unique ids, the `proto-`
  namespace, chip length, every `/protocol#` reference resolving, mega-menu
  targets, and that the route, nav entry and header link all exist.

Verified with tsc, 24 Jest tests across 4 suites, `npm run build`, and a real
browser pass (rendering, deep linking, expand/collapse, search ranking, header
navigation, no 404s, no console errors, no overflow at 390px). Lint unchanged at
the pre-existing 10 problems.

## 2026-08-16 (2) – Fact-check pass against primary sources

Cross-referenced the content added earlier the same day against Telcoin's own
announcements, Nebraska regulatory filings, and the Narwhal/Bullshark academic
papers. Six real inaccuracies found and fixed:

- **Bank charter was written as an open question; it's actually resolved.**
  Telcoin Digital Asset Bank's Nebraska Digital Asset Depository Institution
  charter went final on **12 November 2025** (conditional approval was 3
  February 2025), signed by Governor Jim Pillen — the first such charter in
  the US. It authorizes eUSD issuance, connecting conventional bank accounts
  to blockchain assets, and (per Telcoin's own release) explicitly connecting
  US consumers to DeFi. Nebraska law requires ≥100% liquid USD reserves and no
  FDIC insurance. The Deep Dive Bank section and the matching FAQ answer were
  rewritten from a hedge into dated, sourced fact.
- **Wrong currency ticker.** The Digital Cash grid used `eXOF` for the West
  African CFA franc; Telcoin's own site brands it `eCFA` (the asset file
  already existed at `eCFA.png` and was simply unused). Swapped, and the
  naming-convention paragraph now calls out this one exception explicitly.
- **Digital Cash grid mixed live and roadmap currencies with no distinction.**
  Split into 12 confirmed live (Polygon) vs. 8 announced-but-undated, each
  image alt-tagged accordingly. `status.json` split the same way instead of a
  single figure that quietly conflated both sets.
- **TAN was misdefined.** Earlier copy described TAN (Telcoin Application
  Network) as a compliance-reporting framework. It is actually the
  application layer of a three-layer stack — Telcoin Network (settlement) →
  TELx (liquidity) → TAN (self-custodial wallet apps built by GSMA telecom
  members) — and the Telcoin Wallet is a TAN application. Fixed in the
  Glossary, Governance, Community, and Wallet sections, and in a pre-existing
  homepage card that had the same error.
- **Wallet security claim was vague where a precise, verifiable one exists.**
  "Multi-key design that distributes key material across factors" is now the
  actual mechanism: three signing keys (device-held User Key, Telcoin-held
  Telcoin Key, an independent Trusted Third-Party Key), 2-of-3 to authorize a
  transaction, access tied to the phone number rather than a phrase. Also
  corrected an internal contradiction: the wiki's own self-custody glossary
  entry said "no third party can move or freeze assets," which isn't true of
  a 2-of-3 scheme where Telcoin holds one key — softened to name the
  "assisted self-custody" tradeoff explicitly, in the Deep Dive and the
  matching FAQ answer alike.
- **Governance section skipped the actual structure.** Rewrote to include
  what the Association's own docs use as load-bearing terminology: elected
  Miner Councils (Platform and Treasury, TAN, TELx, Compliance) representing
  four miner types (Validators, Liquidity Miners, Developers, Stakers), and a
  Miner Assembly with constitutional-level authority. Also corrected "Swiss
  association" to the precise legal form, a Swiss *Verein* domiciled in
  Lugano. Added Miner Council/Miner Assembly to the glossary.

Smaller corrections: TELx's chain footprint was overstated as evenly
Polygon/Base/Ethereum — pools are concentrated on Polygon and Base today,
Ethereum has hosted pools historically, and a live governance proposal is
standardizing across all three; noted the ongoing Uniswap v4 + "Telcoin Hook"
migration. Added a sourced concrete figure to the Remittances section (20+
destination countries, ~16 for US/Canada fiat-funded transfers, ~2% total
cost, Telcoin's own published numbers, flagged as such). Cited the actual
Narwhal (Danezis/Kogias/Sonnino/Spiegelman, 2021) and Bullshark
(Giridharan/Kokoris-Kogias/Sonnino/Spiegelman, 2022) papers in the glossary
instead of "academic research." Verified the founder background claim
(Neuner: telecom fraud management, ~20 years) against three independent
sources — it checked out as originally written.

Re-verified after every content change: `tsc --noEmit`, full Jest suite (16
tests), `npm run build`, and a real Chromium run against the built preview
confirming the corrected facts actually render (eCFA image present, eXOF
gone, new dates/terms appear in the DOM, search still resolves, no console
errors, no failed requests). Lint returned to the pre-existing 10-problem
baseline after re-running the same apostrophe-escaping pass the new prose
needed.

## 2026-08-16 – Content expansion and search re-enabled

### Content

- Deep Dive grew from 8 sections to 15. New: **The Problem (Broken Money)**,
  **Telcoin Digital Asset Bank**, **The Telcoin Wallet**, **Remittances and
  Corridors**, **TEL Tokenomics and Supply**, **Security, Risks and Open
  Questions**, and **Glossary and Primary Sources**. Existing sections gained
  material on founding history, validator composition, the Narwhal/Bullshark
  design rationale, TELx liquidity-provider risk, and governance structure.
- FAQ grew from 28 items to 46, reorganised into 11 groups (added Start Here,
  Remittances and Payments, TEL Tokenomics, Security and Safety, and Risks and
  Open Questions).
- Added an explicit risk section, a "this wiki is not official" answer, and a
  primary-sources list. Content that could not be verified from either repo is
  hedged rather than asserted, and the glossary carries a review date.

### Fixed

- **Ten dead links.** The home page linked to `/deep-dive#deep-problem`,
  `#deep-bank`, `#deep-tokenomics`, and `#deep-faq`; none of those anchors
  existed. The first three are now real sections; the FAQ card points at
  `/#faq-section`, where the FAQ actually lives.
- **Three 404 images.** `icon-blockchain.svg`, `icon-crypto-bank.svg`, and
  `icon-mnos.svg` were referenced under `/media/deep-dive/digital-cash/` but
  live in `/media/marquee/logos/`.
- `public/status.json` claimed 3 Digital Cash currencies while the page renders
  20. Corrected, and the unverified `remittanceCorridors` value is now labelled
  as such. (Nothing reads this file — see the parity tracker.)
- `PAGE_META` was missing a `/deep-dive` entry; the mega menu listed two links
  to a single section.
- FAQ groups referenced items by array index, so inserting an item silently
  re-pointed every later group. Groups now resolve by question text.

### Search (re-enabled)

- `useSearchIndex` was a stub returning `[]`. It is now a real implementation:
  tokenised AND-matching with field weighting (title > tags/headings > body),
  phrase bonus, and snippet generation with `<mark>` highlighting.
- **No new dependencies.** `elasticlunr` was removed in the 2025-10-10
  performance pass and has not been reinstated; the scorer is ~200 lines.
- **Fetch is deferred until the overlay is first opened** and shared across
  modal instances, so page load is unaffected — the original reason search was
  switched off.
- Snippets escape per segment and only ever contain `<mark>` tags, which
  matters because the modal renders them via `dangerouslySetInnerHTML`.
- `public/data/search-index.json` was stale: it indexed retired routes (Wallet,
  Remittances, Start Here) and every entry pointed at `/`. Both it and
  `faq.json` are now generated by `tools/build-search-index.mjs`, which renders
  the actual React content trees to text during `prebuild`, so the index cannot
  drift from the site.

### Tests

- First tests in the repo: 16 across three suites.
  - `faq/__tests__/data.test.ts` — every catalogue item appears in exactly one
    group, so a typo in a group cannot silently drop an answer.
  - `deepDive/__tests__/anchors.test.ts` — walks the source for
    `/deep-dive#…` references and fails on any that has no matching section.
    This is the regression guard for the ten dead links above.
  - `hooks/__tests__/useSearchIndex.test.ts` — lazy loading, ranking, HTML
    escaping, FAQ-only fallback, and error/reload recovery.
- Verified in a real browser against the production build (search returns
  ranked, highlighted, navigable results; no 404s; no console errors), because
  typecheck and unit tests do not execute the bundle.

### Notes

- `SECTIONS` moved to `components/deepDive/sections.tsx` so the content array
  can be imported by the generator and tests without breaking fast refresh.
- Bundle impact: main chunk 22.8 → 29.8 kB gzipped (the larger FAQ, which is on
  the home page). Deep Dive content stays lazy-loaded at 22.2 kB gzipped and is
  only fetched on `/deep-dive`.
- Lint went from 38 problems to 10; all remaining ones pre-date this change and
  sit in `Header.tsx`, `lenisScroll.ts`, and `SlidingStack.tsx`.

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
