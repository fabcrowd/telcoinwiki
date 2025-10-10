import { useStatusMetricsData } from './useStatusMetrics'

export const useStatusMetricsRealtime = () => {
  const query = useStatusMetricsData()
  const metrics = query.data?.metrics ?? []
  const highlightedMetrics = metrics.slice(0, 3)
  const hasMetrics = metrics.length > 0

  return {
    metrics,
    highlightedMetrics,
    hasMetrics,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    source: 'fallback' as const,
    isFallback: true,
  }
}
