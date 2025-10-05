# Layout configuration guide

The React layout consumes a trio of typed configuration modules. Editors can update site
structure by editing these data exports instead of touching component code.

- `navigation.ts` exports `NAV_ITEMS`, mirroring the legacy `js/main.js` array. Each item keeps the
  same `id`, `label`, `href`, and optional `menu` shape so existing docs map 1:1.
- `pageMeta.ts` exports `PAGE_META`, the breadcrumb tree used across the wiki. Entries now accept an
  optional `sidebar: true` flag that replaces the hard-coded sidebar list from the static HTML.
  Add/remove this flag to control the “Knowledge base” links.
- `search.ts` exports `SEARCH_CONFIG`, preserving the `dataUrl`, `faqUrl`, and `maxResultsPerGroup`
  keys from the static bundle.

Component props (`NavItem`, `PageMeta`, `SearchConfig`, etc.) are defined in `types.ts`. Update these
types if a field name changes so TypeScript guides you to adjust dependent components.
