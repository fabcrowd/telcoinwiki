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
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export function HeroTicker() {
  const { highlightedMetrics, isLoading, error, metrics } = useStatusMetricsRealtime()

  const visibleMetrics = useMemo(() => {
    if (highlightedMetrics.length > 0) return highlightedMetrics
    if (metrics.length > 0) return metrics.slice(0, 3)
    return []
  }, [highlightedMetrics, metrics])

  return (
    <div className="flex w-full flex-wrap items-center gap-4 rounded-full border border-telcoin-border bg-telcoin-surface px-4 py-2 text-sm text-telcoin-ink">
      <span className="relative inline-flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-telcoin-accent blur-[2px]" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-telcoin-accent" />
      </span>
      <span className="font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">Live</span>
      <div className="flex min-h-[1.5rem] flex-1 items-center gap-6 overflow-hidden">
        {isLoading ? <span className="text-telcoin-ink-muted">Syncing Telcoin metrics…</span> : null}
        {error ? <span className="text-red-300">{error.message}</span> : null}
        {!isLoading && !error ? (
          <AnimatePresence initial={false}>
            {visibleMetrics.map((metric) => (
              <motion.span
                key={metric.key}
                variants={tickerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-telcoin-ink"
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
