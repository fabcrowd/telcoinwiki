import { EDGE_COLORS, FLOW_LABELS } from './edgeMeta'

interface LegendProps {
  id?: string
  className?: string
}

export function Legend({ id = 'network-legend', className }: LegendProps) {
  const keys = Object.keys(EDGE_COLORS) as Array<keyof typeof EDGE_COLORS>
  return (
    <div id={id} className={className} aria-label="Legend">
      <span className="mr-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">
        Legend
      </span>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        {keys.map((key) => (
          <span
            key={key}
            className="inline-flex items-center gap-2 rounded-full border border-telcoin-ink/10 bg-telcoin-surface/70 px-3 py-1 font-medium text-telcoin-ink"
            title={FLOW_LABELS[key]}
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: EDGE_COLORS[key] }}
            />
            <span aria-hidden="true" className="font-mono tracking-[0.2em] text-telcoin-ink/80">
              {key === 'tanTouchpoint' ? '⎯⎯' : key === 'telFlow' ? '– – –' : '· · ·'}
            </span>
            <span className="sr-only">Pattern:</span>
            {FLOW_LABELS[key]}
          </span>
        ))}
      </div>
    </div>
  )
}

const patternFor = (key: keyof typeof EDGE_COLORS): string =>
  key === 'tanTouchpoint' ? '⎯⎯' : key === 'telFlow' ? '– – –' : '· · ·'

export function Legend() {
  const keys = Object.keys(EDGE_COLORS) as Array<keyof typeof EDGE_COLORS>
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 text-sm" aria-label="Legend">
      {keys.map((key) => (
        <span
          key={key}
          className="inline-flex items-center gap-2 rounded-full border border-telcoin-ink/10 bg-telcoin-surface/70 px-3 py-1 font-medium text-telcoin-ink"
          title={FLOW_LABELS[key]}
        >
          <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: EDGE_COLORS[key] }} />
          <span aria-hidden="true" className="font-mono tracking-[0.2em] text-telcoin-ink/80">{patternFor(key)}</span>
          <span className="sr-only">Pattern:</span>
          {FLOW_LABELS[key]}
        </span>
      ))}
    </div>
  )
}
