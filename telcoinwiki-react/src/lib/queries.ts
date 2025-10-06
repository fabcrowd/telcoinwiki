import type { SupabaseClient } from '@supabase/supabase-js'
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'
import { tryGetSupabaseClient } from './supabaseClient'

type BaseQueryOptions<TData> = Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>

type RawFaqTag = {
  tag: {
    slug: string
    label: string
  } | null
}

type RawFaqSource = {
  label: string
  url: string
}

type RawFaqRow = {
  id: string
  question: string
  answer_html: string
  display_order: number
  created_at: string | null
  updated_at: string | null
  tags?: RawFaqTag[] | null
  sources?: RawFaqSource[] | null
}

type RawStatusMetricRow = {
  key: string
  label: string
  value: number
  unit: string | null
  notes: string | null
  update_strategy: 'manual' | 'automated'
  updated_at: string | null
}

export type FaqTag = {
  slug: string
  label: string
}

export type FaqSource = {
  label: string
  url: string
}

export type FaqEntry = {
  id: string
  question: string
  answerHtml: string
  displayOrder: number
  updatedAt: string | null
  tags: FaqTag[]
  sources: FaqSource[]
}

export type StatusMetric = {
  key: string
  label: string
  value: number
  unit: string | null
  notes: string | null
  updateStrategy: 'manual' | 'automated'
  updatedAt: string | null
}

const faqSelect = `
  id,
  question,
  answer_html,
  display_order,
  created_at,
  updated_at,
  tags:faq_tags(
    tag:faq_tag_labels(
      slug,
      label
    )
  ),
  sources:faq_sources(
    label,
    url
  )
`
  .replace(/\s+/g, ' ')
  .trim()

const mapFaqRow = (row: RawFaqRow): FaqEntry => ({
  id: row.id,
  question: row.question,
  answerHtml: row.answer_html,
  displayOrder: row.display_order,
  updatedAt: row.updated_at ?? row.created_at,
  tags: (row.tags ?? [])
    .map((item) => {
      const tag = item?.tag
      return tag ? { slug: tag.slug, label: tag.label } : null
    })
    .filter((tag): tag is FaqTag => Boolean(tag)),
  sources: (row.sources ?? []).map((source) => ({ label: source.label, url: source.url })),
})

export const mapStatusMetricRow = (row: RawStatusMetricRow): StatusMetric => ({
  key: row.key,
  label: row.label,
  value: Number(row.value),
  unit: row.unit,
  notes: row.notes,
  updateStrategy: row.update_strategy,
  updatedAt: row.updated_at,
})

export const queryKeys = {
  faqList: ['faq', 'list'] as const,
  faqSearch: (term: string) => ['faq', 'search', term] as const,
  statusMetrics: ['status', 'metrics'] as const,
}

const requireClient = (): SupabaseClient => {
  const client = tryGetSupabaseClient()
  if (!client) {
    throw new Error('Supabase client is not available')
  }
  return client
}

const fetchFaqList = async (): Promise<FaqEntry[]> => {
  const client = requireClient()
  const { data, error } = await client
    .from('faq')
    .select(faqSelect)
    .order('display_order', { ascending: true })

  if (error) {
    throw new Error(`Failed to load FAQs: ${error.message}`)
  }

  const rows = Array.isArray(data) ? (data as unknown as RawFaqRow[]) : []
  return rows.map(mapFaqRow)
}

const fetchFaqSearch = async (term: string): Promise<FaqEntry[]> => {
  const query = term.trim()
  if (!query) return []

  const client = requireClient()
  const { data, error } = await client
    .from('faq')
    .select(faqSelect)
    .textSearch('search_vector', query, { type: 'websearch' })
    .order('display_order', { ascending: true })
    .limit(20)

  if (error) {
    throw new Error(`Failed to search FAQs: ${error.message}`)
  }

  const rows = Array.isArray(data) ? (data as unknown as RawFaqRow[]) : []
  return rows.map(mapFaqRow)
}

const fetchStatusMetrics = async (): Promise<StatusMetric[]> => {
  const client = requireClient()
  const { data, error } = await client
    .from('status_metrics')
    .select('key, label, value, unit, notes, update_strategy, updated_at')
    .order('label', { ascending: true })

  if (error) {
    throw new Error(`Failed to load status metrics: ${error.message}`)
  }

  return (data ?? []).map(mapStatusMetricRow)
}

export const useFaqListQuery = (
  options?: BaseQueryOptions<FaqEntry[]>,
): UseQueryResult<FaqEntry[], Error> =>
  useQuery({
    queryKey: queryKeys.faqList,
    queryFn: fetchFaqList,
    ...options,
  })

export const useFaqSearchQuery = (
  term: string,
  options?: BaseQueryOptions<FaqEntry[]>,
): UseQueryResult<FaqEntry[], Error> =>
  useQuery({
    queryKey: queryKeys.faqSearch(term),
    queryFn: () => fetchFaqSearch(term),
    enabled: term.trim().length > 0,
    ...options,
  })

export const useStatusMetricsQuery = (
  options?: BaseQueryOptions<StatusMetric[]>,
): UseQueryResult<StatusMetric[], Error> =>
  useQuery({
    queryKey: queryKeys.statusMetrics,
    queryFn: fetchStatusMetrics,
    ...options,
  })

export const supabaseQueries = {
  fetchFaqList,
  fetchFaqSearch,
  fetchStatusMetrics,
  mapStatusMetricRow,
}
