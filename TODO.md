# Worklog TODOs

## Layout responsiveness
- [x] Inspect existing `.site-shell` implementations in `src/styles/critical.css`, `src/styles/brand.css`, and `src/styles/site.css`.
- [x] Redefine the `.site-shell` container in `critical.css` to use a responsive grid with a fluid sidebar column and main content span.
- [x] Update spacing/padding tokens so the shell spans the viewport width with clamped gutters.
- [x] Adjust `brand.css` to redefine `--container` as a clamp and simplify `.container` width rules accordingly.
- [x] Sweep `site.css` for assumptions about the old max width and adjust grid gaps/typography where necessary to support the new layout.

## Sidebar behavior
- [x] Convert `.sidebar` styles in `critical.css` (and overrides in `site.css`) to use `position: sticky`, `top: var(--header-height)`, and a viewport-height calculation for consistent locking.
- [x] Ensure the sidebar maintains independent scrolling with `overflow-y: auto` and appropriate padding adjustments across breakpoints.
- [x] Audit `Sidebar` React component for structural tweaks (e.g., add `role="complementary"`, wrap scrollable area) after CSS changes.

## FAQ consolidation
- [x] Extract Deep Dive FAQ sections into a reusable component under `src/components` (e.g., `deepDive/DeepDiveFaqSections.tsx`).
- [x] Replace the home page `FaqExplorer` usage with the new component while keeping anchors/IDs intact.
- [x] Update the Deep Dive page to consume the shared component and keep current layout.

## Header refinements
- [x] Refactor the desktop header pills into a dropdown trigger in `src/components/layout/Header.tsx`, leaving the mobile drawer untouched.
- [x] Relocate and restyle the search trigger so it sits on the far right of the header.
- [x] Update corresponding styles in `site.css` (and possibly `brand.css`) to support the dropdown and right-aligned search, removing obsolete pill styles.
- [x] Add dropdown menu styles and interactions (focus states, ARIA attributes) to mirror accessibility of existing navigation.

## Enhanced UX suggestions
- [x] Evaluate feasibility of integrating richer loading and hero interactions (documented future enhancements for a follow-up iteration).

## QA
- [x] Run relevant build/test commands (likely `npm run build` or `npm run lint`) once implementation is complete.
- [ ] Manually verify layout adjustments in the development server if time allows (document any limitations).
