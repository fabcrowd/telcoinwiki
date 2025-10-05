begin;

create table if not exists public.faq (
    id text primary key,
    question text not null,
    answer_html text not null,
    display_order integer not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    search_vector tsvector generated always as (
        to_tsvector('english', coalesce(question, '') || ' ' || coalesce(answer_html, ''))
    ) stored
);

create index if not exists idx_faq_display_order on public.faq(display_order);
create index if not exists idx_faq_search_vector on public.faq using gin(search_vector);

create table if not exists public.faq_tag_labels (
    id bigserial primary key,
    slug text not null unique,
    label text not null unique,
    created_at timestamptz not null default now()
);

create table if not exists public.faq_tags (
    faq_id text not null references public.faq(id) on delete cascade,
    tag_id bigint not null references public.faq_tag_labels(id) on delete cascade,
    primary key (faq_id, tag_id)
);

create index if not exists idx_faq_tags_tag_id on public.faq_tags(tag_id);
create index if not exists idx_faq_tags_faq_id on public.faq_tags(faq_id);

create table if not exists public.faq_sources (
    id bigserial primary key,
    faq_id text not null references public.faq(id) on delete cascade,
    label text not null,
    url text not null,
    created_at timestamptz not null default now(),
    unique (faq_id, url)
);

create index if not exists idx_faq_sources_faq_id on public.faq_sources(faq_id);
create index if not exists idx_faq_sources_url on public.faq_sources(url);

create table if not exists public.status_metrics (
    key text primary key,
    label text not null,
    value numeric not null,
    unit text,
    notes text,
    update_strategy text not null default 'manual' check (update_strategy in ('manual', 'automated')),
    updated_at timestamptz not null default now()
);

create index if not exists idx_status_metrics_update_strategy on public.status_metrics(update_strategy);

commit;
