# Supabase Schema & Data Loading

This directory captures the Postgres schema that powers the Telcoin Wiki FAQ and status surfaces. Contributors can run the SQL migrations and seeds directly via `psql`, the Supabase SQL editor, or the Supabase CLI.

## Structure

- `migrations/20240611120000_create_faq_and_status_schema.sql` – creates the FAQ, tag, source, and status metric tables along with supporting indexes and search configuration.
- `seeds/20240611121000_seed_faq_and_status.sql` – idempotently loads FAQ content, tag mappings, source links, and the initial status metric from the existing JSON assets.

## Applying the schema

```bash
# Using the Supabase CLI
supabase db reset           # Drops and recreates the local database, then runs migrations + seeds
# or, to apply to an existing database
supabase db push            # Applies the SQL in migrations/ to your linked project
psql "$SUPABASE_DB_URL" -f supabase/seeds/20240611121000_seed_faq_and_status.sql
```

The seed script is safe to rerun; it performs UPSERT operations so repeated executions keep the database in sync with the JSON source files.

## Status metrics lifecycle

The `status_metrics` table mirrors keys from `telcoinwiki-react/public/status.json` (for example, `remittanceCorridors`). Each row records:

- `value` – stored as a numeric type so both integers and decimals are supported.
- `unit` – optional human-readable unit (e.g., `countries`).
- `update_strategy` – constrained to `manual` or `automated`. For now, metrics are maintained manually by updating rows through Supabase or a SQL client. When an automated feed becomes available, switch the column to `automated` and point a cron job or background worker at the table.
- `notes` – provenance for the seeded values.

Consumers can query `status_metrics` directly or create lightweight views/materialized views if additional formatting is required for the React application.

## Full-text search

FAQ rows maintain a generated `search_vector` that indexes both the question and HTML answer. The migration adds a GIN index over this vector so Supabase can satisfy typeahead or keyword search workloads without additional configuration.

## Referential integrity

Tags are normalized in `faq_tag_labels` (unique slug + label) and joined to FAQ entries via the `faq_tags` bridge table. Source links live in `faq_sources` with a `UNIQUE (faq_id, url)` constraint to prevent accidental duplication.

