import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { useStatusMetricsRealtime } from '../../hooks/useStatusMetricsRealtime'

const formatValue = (value: number, unit: string | null) => {
  if (Number.isNaN(value)) return '—'

  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B${unit ? ` ${unit}` : ''}`
  }

  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M${unit ? ` ${unit}` : ''}`
  }

  if (Math.abs(value) >= 10_000) {
    return `${(value / 1_000).toFixed(1)}K${unit ? ` ${unit}` : ''}`
  }

  return `${value.toLocaleString(undefined, { maximumFractionDigits: 4 })}${unit ? ` ${unit}` : ''}`
}

const tickerVariants = {
  // No fade: y-only motion for consistency
  initial: { y: 12 },
  animate: { y: 0 },
  exit: { y: -12 },
}

export function HeroTicker() {
  const { highlightedMetrics, isLoading, error, metrics, isFallback } = useStatusMetricsRealtime()

  const visibleMetrics = useMemo(() => {
    if (highlightedMetrics.length > 0) return highlightedMetrics
    if (metrics.length > 0) return metrics.slice(0, 3)
    return []
  }, [highlightedMetrics, metrics])

  return (
    <div className="flex w-full flex-wrap items-start gap-4 rounded-full border border-telcoin-border bg-telcoin-surface px-4 py-2 text-sm text-telcoin-ink sm:items-center">
      <span className="relative inline-flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-telcoin-accent blur-[2px]" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-telcoin-accent" />
      </span>
      <span className="font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">Live</span>
      <div className="flex min-h-[1.5rem] w-full flex-1 flex-col gap-3 overflow-visible sm:flex-row sm:items-center sm:gap-6 sm:overflow-hidden">
        {isLoading ? <span className="text-telcoin-ink-muted">Syncing Telcoin metrics…</span> : null}
        {!isLoading && isFallback ? (
          <span className="text-telcoin-ink-muted">
            Realtime updates unavailable; showing cached metrics.
          </span>
        ) : null}
        {!isLoading && error && visibleMetrics.length === 0 ? (
          <span className="text-red-300">Unable to load Telcoin metrics right now.</span>
        ) : null}
        {!isLoading && visibleMetrics.length > 0 ? (
          <AnimatePresence initial={false}>
            {visibleMetrics.map((metric) => (
              <motion.span
                key={metric.key}
                variants={tickerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex w-full items-center justify-between gap-2 text-sm text-telcoin-ink sm:inline-flex sm:w-auto sm:justify-start sm:whitespace-nowrap"
              >
                <span className="font-semibold text-telcoin-ink">
                  {metric.label}
                </span>
                <span className="text-telcoin-ink-muted">
                  {formatValue(metric.value, metric.unit)}
                </span>
              </motion.span>
            ))}
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  )
}
