# React Migration Innovation Strategy

This document proposes pragmatic yet ambitious solutions for the highest-risk gaps identified in the React migration effort. Each section couples a north-star concept with incremental deliverables so the team can move quickly without overcommitting. The final section captures a rolling TODO list so progress stays visible and accountable.

## Master Execution TODO

> _Update this checklist at the end of every sprint review. Bold items indicate unblockers for downstream work._

- [ ] **Ratify Supabase schemas** for FAQs, search documents, metrics events, and launch gating tables; publish ERDs in the design system.
- [ ] Stand up the GitHub → Supabase sync GitHub Action and confirm idempotent writes in staging.
- [ ] Deliver the MVP Supabase FAQ route (list + detail) behind a feature flag and capture first user feedback signals.
- [ ] Launch the materialized `search_documents` view with automated refresh hooks and replace the Lunr build step.
- [ ] Deploy realtime metrics ingestion workers with alerting thresholds for two critical TELx pools.
- [ ] Migrate one deep-dive page end-to-end through the composable MDX pipeline and document the author workflow.
- [ ] Turn on the CI launch guardian (Supabase drift, accessibility, analytics) with green builds in both main and release branches.
- [ ] Close the loop by reviewing analytics/feedback data and reprioritising backlog tasks every two weeks.

## 1. Supabase-Powered FAQ Experience

**Vision:** Deliver a living FAQ surface that automatically reflects editorial changes, surfaces related content, and gathers engagement signals for continuous improvement.

### Architecture Blueprint

- **Source of truth**: Mirror Markdown/MDX FAQs from the repo into Supabase via a GitHub Action that converts content into structured JSON and uploads to storage buckets for rich media.
- **Relational layer**: Model `faq_entries`, `faq_categories`, `faq_relations`, and `faq_feedback` tables with generated TypeScript types to guarantee runtime safety.
- **Serving layer**: Introduce a Netlify Edge Function that hydrates a `FaqKnowledgePanel` React route with batched Supabase queries plus CDN caching.

### Implementation Waves

1. **Wave 0 – Schema & Sync**
   - Stand up Supabase migrations for FAQ tables and bootstrap them with existing markdown metadata.
   - Configure GitHub Action dry-runs to validate diffing/merging logic before writing to production tables.
2. **Wave 1 – MVP Experience**
   - Build list/detail routes with React Query and suspense boundaries, wrapped behind a feature flag for staged rollout.
   - Instrument client-side analytics to record searches, filter usage, and helpfulness votes into Supabase.
3. **Wave 2 – Intelligence Loop**
   - Add realtime previews for editors, integrate Notion CMS submissions, and schedule anomaly detection (bounce, low satisfaction) to auto-create Jira tickets.

### Risks & Mitigations

- **Content drift between GitHub and Supabase** → enforce checksum comparisons in the sync job and surface drift alerts in Slack.
- **Feedback abuse** → throttle submissions through edge functions with Turnstile challenges for suspicious IPs.
- **Editor adoption** → ship Loom walkthroughs and embed tooltips in Supabase Studio forms.

### Success Metrics

- 100% of FAQ pageviews served from Supabase-backed routes.
- ≥60% of FAQ entries with at least one feedback signal within the first month.
- Reduction in manual FAQ update turnaround from days to hours.

## 2. Search & Discovery Platform

**Vision:** Replace the brittle Lunr index with a Supabase-native discovery layer that scales to richer content types and personalized filters.

### Architecture Blueprint

- **Search fabric**: Materialized view `search_documents` combining FAQs, release notes, parity tracker updates, and glossary entries with weighted `tsvector` columns.
- **Smart refresh**: Triggers fire from content sync events and editorial submissions, refreshing only the affected rows to keep latency low.
- **Insight instrumentation**: `search_events` captures query text, dwell time, conversion type, and session context for ranking feedback loops.

### Implementation Waves

1. **Wave 0 – Data Plumbing**
   - Build migrations for the materialized view, RPC functions, and telemetry tables.
   - Create seed scripts that replay historical Lunr indices to validate coverage.
2. **Wave 1 – API & Caching**
   - Launch a Supabase Edge Function wrapper with bot protection and per-session caching headers.
   - Pipe telemetry into BigQuery (or Supabase analytics) for offline modelling experiments.
3. **Wave 2 – Rich UI**
   - Replace the modal with a `CommandPalette` route featuring adaptive filters, fuzzy suggestions, and offline caching via IndexedDB.
   - Experiment with personalized ranking (e.g., highlight governance content after repeated queries on “vote”).

### Risks & Mitigations

- **Search performance under load** → apply Postgres `pg_trgm` indexes and prewarm caches during deploys.
- **Telemetry privacy concerns** → hash user identifiers, store only truncated query text for sensitive terms.
- **Stakeholder hesitation to abandon Lunr** → run side-by-side AB tests and share conversion deltas weekly.

### Success Metrics

- <250 ms p95 query latency for top 10 search categories.
- ≥15% uplift in search click-through compared to Lunr baseline.
- ≥30% of sessions use at least one facet within three weeks of launch.

## 3. Live Supabase Status Metrics

**Vision:** Provide real-time transparency into TELx pools, governance stats, and network health using Supabase as the single source of truth.

### Architecture Blueprint

- **Data lake**: `metrics_events` table stores raw JSON payloads with provenance, checksums, and SLA metadata.
- **Analytics views**: Parameterized materialized views expose aggregated snapshots (`network_metrics`, `telx_pools`, `governance_snapshots`) tuned for UI queries.
- **Realtime bus**: Supabase realtime channels broadcast updates to React clients and alerting services.

### Implementation Waves

1. **Wave 0 – Schema Hardening**
   - Define migrations, indexes, and retention policies for metrics data; add automated backfill scripts for historical context.
   - Generate Zod schemas and typed hooks so ingestion/consumption code share contracts.
2. **Wave 1 – Streaming Ingestion**
   - Deploy workers (Deno Deploy or Cloudflare Workers) using service role keys with row-level scope.
   - Add circuit-breakers when upstream feeds stall, failing over to cached Netlify storage snapshots.
3. **Wave 2 – Visualization & Alerts**
   - Build composable viz primitives (`Sparkline`, `TrendCard`, `DeltaBadge`) and integrate into dashboard routes.
   - Offer self-service threshold alerts via Supabase Functions delivering Discord/webhook notifications.

### Risks & Mitigations

- **Upstream data outages** → maintain cached fallbacks and surface status banners triggered by ingestion circuit-breakers.
- **Cost of realtime updates** → coalesce writes and throttle broadcast frequency based on UI subscription density.
- **Data accuracy concerns** → schedule automated reconciliation jobs comparing Supabase data against source-of-truth APIs.

### Success Metrics

- 99% of metric updates available within 60 seconds of upstream changes.
- Weekly reconciliation drift <1% across monitored pools.
- At least 50 subscribers opt into threshold alerts post-launch.

## 4. Deep Content Porting Accelerator

**Vision:** Rapidly migrate long-form “deep dive” content with minimal manual work while future-proofing for interactive components.

### Architecture Blueprint

- **Composable MDX**: Define reusable components (`<Callout>`, `<Timeline>`, `<GlossaryRef>`, `<MetricSpotlight>`) with theming tokens shared between docs and the app.
- **Conversion pipeline**: CLI tool parses existing static content into MDX, flagging TODO comments for editorial review.
- **Metadata mesh**: Supabase tables track content lifecycle (`deep_content_entries`, `deep_content_reviews`, `deep_content_assets`) plus cross-links to FAQs and metrics.

### Implementation Waves

1. **Wave 0 – Foundation**
   - Ship MDX component library with Storybook documentation and accessibility test coverage.
   - Automate linting (Vale + remark) and visual regression testing (Percy or Chromatic) in CI.
2. **Wave 1 – Authoring Studio**
   - Launch a Next.js-based “Deep Content Studio” with live preview and Supabase-backed drafts.
   - Provide migration scripts that open GitHub PRs with converted MDX plus inline review notes.
3. **Wave 2 – Operational Insight**
   - Expand parity tracker dashboards showing Draft → Review → Published flow, contributor leaderboards, and search-driven prioritization cues.

### Risks & Mitigations

- **Author fatigue** → deliver real-time previews, keyboard shortcuts, and AI-assisted copy suggestions.
- **Component sprawl** → enforce design tokens and create a component governance committee that approves new MDX primitives.
- **Broken embeds/links** → run nightly link integrity checks and embed tests in CI.

### Success Metrics

- Complete migration of top 10 deep dive pages within three sprints of tooling launch.
- Reduce editorial review cycles by 40% through the live preview workflow.
- Achieve ≥90 Lighthouse accessibility scores for migrated content pages.

## 5. Automated Launch-Readiness Verification

**Vision:** Replace manual checklist auditing with a living CI/CD guardian that blocks releases until Supabase, accessibility, and analytics requirements pass.

### Architecture Blueprint

- **CI Guardian**: GitHub Actions pipeline orchestrates Supabase schema diffs, RLS regression tests, accessibility scans, analytics validation, and Playwright smoke runs.
- **Policy Hub**: Supabase tables (`launch_blockers`, `launch_features`, `qa_runs`) centralize pass/fail status with Slack notifications.
- **Observability Mesh**: OpenTelemetry instrumentation sends traces/metrics to a managed collector, powering release dashboards.

### Implementation Waves

1. **Wave 0 – Foundational Checks**
   - Integrate `supabase db diff`, RLS test suites, and TypeScript type generation into CI; block merges on failure.
   - Establish golden data fixtures for Playwright to interact with consistent Supabase state.
2. **Wave 1 – Holistic Quality Gates**
   - Add Pa11y/Axe scans, analytics assertions (dataLayer, Segment), and Visual Regression snapshots to preview builds.
   - Publish aggregated results as a GitHub Check with inline remediation links.
3. **Wave 2 – Operational Automation**
   - Wire CI outputs into Supabase `qa_runs`, enabling dashboards, release readiness emails, and automated runbook updates.
   - Introduce feature-flagged rollouts with automated rollback if error budgets breach thresholds.

### Risks & Mitigations

- **CI runtime inflation** → parallelize jobs, cache dependencies, and run heavy suites (visual regression) nightly instead of per-commit.
- **False positives blocking releases** → support manual override workflow with annotated reasoning captured in `launch_blockers`.
- **Instrument fatigue** → consolidate dashboards in a single Grafana or Supabase Studio view.

### Success Metrics

- 100% of releases pass automated gates without manual overrides two sprints pre-launch.
- Accessibility regressions detected within the same day via CI alerts.
- Mean time to rollback <10 minutes thanks to feature flag automation.

## Implementation Roadmap

1. Prioritize Supabase schema unification (FAQs, metrics, search documents) so the rest of the features share a coherent data layer.
2. Parallelize UI modernization (FAQ + search) with automated quality gates to keep regression risk low.
3. Tackle deep content migration once the content tooling is operational, using feedback loops from search analytics to guide sequencing.
4. Conduct a readiness fire drill two sprints before launch, using the automated checks to simulate cutover and identify remaining gaps.

This strategy blends bold enhancements with incremental delivery, equipping the team to differentiate the Telcoin Wiki experience while de-risking the React transition.
