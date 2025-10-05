import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'
import { supabaseClient } from './supabaseClient'

type BaseQueryOptions<TData> = Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>

type RawFaqRow = {
  id: string
  question: string
  answer_html: string
  display_order: number
  created_at: string | null
  updated_at: string | null
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

export type FaqEntry = {
  id: string
  question: string
  answerHtml: string
  displayOrder: number
  updatedAt: string | null
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

const mapFaqRow = (row: RawFaqRow): FaqEntry => ({
  id: row.id,
  question: row.question,
  answerHtml: row.answer_html,
  displayOrder: row.display_order,
  updatedAt: row.updated_at ?? row.created_at,
})

const mapStatusMetricRow = (row: RawStatusMetricRow): StatusMetric => ({
  key: row.key,
  label: row.label,
  value: row.value,
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

const fetchFaqList = async (): Promise<FaqEntry[]> => {
  const { data, error } = await supabaseClient
    .from('faq')
    .select('id, question, answer_html, display_order, created_at, updated_at')
    .order('display_order', { ascending: true })

  if (error) {
    throw new Error(`Failed to load FAQs: ${error.message}`)
  }

  return (data ?? []).map(mapFaqRow)
}

const fetchFaqSearch = async (term: string): Promise<FaqEntry[]> => {
  const query = term.trim()
  if (!query) return []

  const { data, error } = await supabaseClient
    .from('faq')
    .select('id, question, answer_html, display_order, created_at, updated_at')
    .textSearch('search_vector', query, { type: 'websearch' })
    .order('display_order', { ascending: true })
    .limit(20)

  if (error) {
    throw new Error(`Failed to search FAQs: ${error.message}`)
  }

  return (data ?? []).map(mapFaqRow)
}

const fetchStatusMetrics = async (): Promise<StatusMetric[]> => {
  const { data, error } = await supabaseClient
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
}
