import { useEffect, useMemo, useState } from 'react'
import { mapStatusMetricRow, supabaseQueries, type StatusMetric } from '../lib/queries'
import { tryGetSupabaseClient } from '../lib/supabaseClient'

interface StatusMetricState {
  metrics: StatusMetric[]
  isLoading: boolean
  error: Error | null
}

const mergeMetric = (metrics: StatusMetric[], updated: StatusMetric) => {
  const next = metrics.some((metric) => metric.key === updated.key)
    ? metrics.map((metric) => (metric.key === updated.key ? updated : metric))
    : [...metrics, updated]
  return next.sort((a, b) => a.label.localeCompare(b.label))
}

export const useStatusMetricsRealtime = () => {
  const [state, setState] = useState<StatusMetricState>({
    metrics: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let isActive = true

    const load = async () => {
      setState((current) => ({ ...current, isLoading: true, error: null }))

      try {
        const data = await supabaseQueries.fetchStatusMetrics()
        if (!isActive) return
        setState({ metrics: data, isLoading: false, error: null })
      } catch (error) {
        if (!isActive) return
        setState({ metrics: [], isLoading: false, error: error as Error })
      }
    }

    void load()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    const client = tryGetSupabaseClient()
    if (!client) return

    const channel = client
      .channel('status-metrics-stream')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'status_metrics' },
        (payload) => {
          if (!payload.new) return

          const next = mapStatusMetricRow(payload.new as {
            key: string
            label: string
            value: number
            unit: string | null
            notes: string | null
            update_strategy: 'manual' | 'automated'
            updated_at: string | null
          })

          setState((current) => ({
            ...current,
            metrics: mergeMetric(current.metrics, next),
          }))
        },
      )
      .subscribe()

    return () => {
      void client.removeChannel(channel)
    }
  }, [])

  const hasMetrics = state.metrics.length > 0

  const highlightedMetrics = useMemo(() => state.metrics.slice(0, 3), [state.metrics])

  return {
    ...state,
    hasMetrics,
    highlightedMetrics,
  }
}
