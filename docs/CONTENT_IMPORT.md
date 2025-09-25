# Content Import Workflow

The status landing page is wired to `src/data/referenceContent.ts`. The values currently ship with placeholder copy so the UI renders without the original HTML. Once the canonical document is available, use the importer flow below to map each section without adding new dependencies.

## Prerequisites

- Keep the raw HTML untouched. No styles or assets are required—only the markup.
- Use the provided IDs when wrapping content so the importer can find the right blocks.

## Steps

1. Create `reference/original-index.html` (if it does not already exist) and paste the full HTML source from the reference status page.
2. Within that HTML file, add lightweight wrappers for each section you want to import. Plain text is fine, but for structured data (cards, tables, accordion entries) prefer embedding a small JSON payload inside a `<script type="application/json">` block so the importer can consume it without a heavy parser.

   ```html
   <div id="hero-title">The Status Hero Title</div>
   <div id="hero-description">Hero lead paragraph…</div>
   <script type="application/json" id="current-phase-cards">
     {"cards": ["..."]}
   </script>
   ```

   > **TODO:** When pasting the official HTML, wrap every target block with the following IDs so the importer can read them:
   > - `hero-title` and `hero-description`
   > - `current-phase-progress`
   > - `current-phase-cards`
   > - `security-bullets`, `security-stats`, and `security-table`
   > - `roadmap-items`
   > - `learn-accordion` and `learn-links`

3. Update `scripts/import-content.js` to ensure the selectors match the IDs in your HTML snippet if you introduce additional fields.
4. Run `npm run import:content` to overwrite `src/data/referenceContent.ts` with the extracted content.
5. Commit the regenerated file. The page will now render the imported copy.

If anything goes wrong, rerun `npm run validate:content` to confirm that the data module still exists, or restore the file from Git.
