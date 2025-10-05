# Telcoin Wiki React Migration Plan

This document outlines the recommended steps for migrating the existing static site to a modern React + Supabase stack while maintaining the ability to iterate safely.

## 1. Bootstrap a React Workspace
- Scaffold a new Vite-powered React (SWC + TypeScript) application in a sibling directory (e.g., `npm create vite@latest telcoinwiki-react -- --template react-swc-ts`).
- Align Node tooling with the production environment by using Node 22 locally and in CI/CD.
- Configure linting, formatting, and testing baselines (ESLint, Prettier, Vitest) to match project conventions.

## 2. Port Shared Design Tokens and Global Styles
- Copy `src/styles/tokens.css`, `styles/brand.css`, and other shared CSS into the React app's `src` tree.
- Import a global stylesheet in `main.tsx` to expose CSS variables and normalize base styles.
- Translate page-specific CSS into component-scoped styles via CSS modules or co-located style files.

## 3. Model Navigation, Layout, and Shared Data
- Convert constants in `js/main.js` (navigation structure, page metadata, search settings) into typed configuration modules under `src/config`.
- Build layout primitives (`AppLayout`, `Header`, `Sidebar`, `Breadcrumbs`) that consume these configs to reproduce the current DOM structure.
- Extract reusable UI elements (cards, FAQ accordions, status badges) into dedicated components with clear props.

## 4. Introduce Routing and Page Components
- Add React Router and map each existing HTML page (Home, Start Here, Wallet, FAQ, etc.) to typed route components.
- Migrate static HTML content into JSX while preserving semantics and accessibility attributes.
- Refactor repeated content blocks (FAQ items, card grids) into components fed by structured data.

## 5. Design Supabase Schema and Seed Data
- Translate JSON sources (e.g., `data/faq.json`, search index data) into Supabase tables (`faq`, `faq_tags`, `sources`) or views.
- Store dynamic status metrics currently injected via `window.__STATUS__` in dedicated tables or Postgres functions.
- Use Supabase migrations or SQL snippets to seed initial data matching the existing JSON files before deprecating them.

## 6. Wire Up Supabase in React
- Install `@supabase/supabase-js` and create a `supabaseClient.ts` that reads `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Consider integrating React Query or SWR for caching and background refresh of Supabase data.
- Replace JSON fetches with Supabase queries or RPC calls; ensure search data is sourced from Supabase (via ElasticLunr build step or Postgres full-text search).

## 7. Incrementally Rebuild Features
- Re-implement navigation, search modal, FAQ accordion, and status badges as React components driven by Supabase-backed data.
- Preserve UX behaviors defined in `js/main.js` (keyboard shortcuts, toggle animations) while moving logic into hooks/components.
- Maintain existing helper scripts (`verify:supabase`) for CI preflight checks.

## 8. Refine Build & Deployment
- Update `package.json` scripts to leverage Vite's build pipeline and include any asset optimization steps still required.
- Adjust `netlify.toml` to point `publish` to the React app's `dist/` directory and run `npm run build` from the new workspace.
- Configure Netlify environment variables for Supabase credentials and keep `supabase-test` as a smoke test during the transition.

## 9. Migration Strategy & Documentation
- Run the static site and React build in parallel until feature parity is achieved; deploy the React app under a preview domain for validation.
- Document Supabase schema, data-loading conventions, and contributor workflows to ease onboarding.
- Plan for DNS cutover once the React application reaches parity and passes QA.

