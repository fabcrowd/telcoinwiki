import { useMemo } from 'react'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { StatusMetric } from '../lib/queries'
import { supabaseQueries } from '../lib/queries'

interface StatusMetricsResult {
  metrics: StatusMetric[]
  source: 'supabase' | 'fallback'
}

type StatusJson = Record<string, number>

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }
  return (await response.json()) as T
}

const fallbackToStatusJson = async (): Promise<StatusMetricsResult> => {
  const data = await fetchJson<StatusJson>('/status.json')
  const metrics: StatusMetric[] = Object.entries(data).map(([key, value]) => ({
    key,
    label: key,
    value,
    unit: null,
    notes: null,
    updateStrategy: 'manual',
    updatedAt: null,
  }))

  return { metrics, source: 'fallback' }
}

const fetchStatusMetricsWithFallback = async (): Promise<StatusMetricsResult> => {
  try {
    const metrics = await supabaseQueries.fetchStatusMetrics()
    return { metrics, source: 'supabase' }
  } catch (error) {
    console.warn('Falling back to cached status metrics', error)
    return fallbackToStatusJson()
  }
}

export const useStatusMetricsData = (): UseQueryResult<StatusMetricsResult, Error> =>
  useQuery({
    queryKey: ['status', 'metrics', 'with-fallback'],
    queryFn: fetchStatusMetricsWithFallback,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  })

export const useStatusMetricValue = (
  key: string,
  format: 'number' | 'plus' = 'number',
) => {
  const query = useStatusMetricsData()
  const { data, isLoading, error, isFetching, refetch } = query
  const metric = data?.metrics.find((item) => item.key === key)
  const formatter = useMemo(() => new Intl.NumberFormat('en-US'), [])

  const formatted = useMemo(() => {
    if (!metric) return null
    const value = Number(metric.value)
    if (!Number.isFinite(value)) {
      return null
    }
    const base = formatter.format(value)
    return format === 'plus' ? `${base}+` : base
  }, [metric, formatter, format])

  return {
    formatted,
    value: metric?.value ?? null,
    isLoading,
    isFetching,
    error,
    refetch,
    isFallback: data?.source === 'fallback',
  }
}
