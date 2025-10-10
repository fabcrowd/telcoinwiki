import type { MouseEvent } from 'react'
import { useStatusMetricValue } from '../../hooks/useStatusMetrics'

interface StatusValueProps {
  metricKey: string
  format?: 'number' | 'plus'
  fallbackText?: string
}

export function StatusValue({ metricKey, format = 'number', fallbackText = '—' }: StatusValueProps) {
  const { formatted, isLoading, error, refetch, isFallback } = useStatusMetricValue(metricKey, format)

  const handleRetry = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    void refetch()
  }

  let content: string = fallbackText
  if (isLoading) {
    content = '…'
  } else if (formatted) {
    content = formatted
  }

  return (
    <span
      className={`status-value${isFallback ? ' status-value--fallback' : ''}`}
      aria-live="polite"
      data-status-key={metricKey}
      title={isFallback ? 'Showing cached metrics from the latest build.' : undefined}
    >
      {content}
      {error ? (
        <button type="button" className="status-value__retry" onClick={handleRetry}>
          Retry
        </button>
      ) : null}
    </span>
  )
}
