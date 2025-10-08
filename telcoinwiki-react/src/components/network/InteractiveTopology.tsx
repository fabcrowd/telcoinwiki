import { motion } from 'framer-motion'
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'

import { networkTopology } from '../../data/network/topology'
import type { TopologyEdge, TopologyEdgeType, TopologyNode } from '../../data/network/topology'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const EDGE_COLORS: Record<TopologyEdgeType, string> = {
  telFlow: '#2563eb',
  telxFlow: '#9333ea',
  tanTouchpoint: '#f97316',
}

const FLOW_LABELS: Record<TopologyEdgeType, string> = {
  telFlow: 'TEL issuance & staking flow',
  telxFlow: 'TELx liquidity flow',
  tanTouchpoint: 'TAN compliance touchpoint',
}

const NODE_TYPE_STYLES: Record<TopologyNode['type'], string> = {
  association: 'from-sky-500/90 to-sky-600/70',
  validator: 'from-emerald-500/90 to-emerald-600/70',
  liquidity: 'from-violet-500/85 to-violet-600/70',
  endpoint: 'from-amber-500/90 to-amber-600/70',
}

const VIEWBOX = { width: 100, height: 88 }

function buildPath(edge: TopologyEdge, nodeMap: Map<string, TopologyNode>): string {
  const from = nodeMap.get(edge.from)
  const to = nodeMap.get(edge.to)

  if (!from || !to) {
    return ''
  }

  const move = `M ${from.position.x} ${from.position.y}`
  const destination = `${to.position.x} ${to.position.y}`

  if (edge.curve) {
    return `${move} Q ${edge.curve.x} ${edge.curve.y} ${destination}`
  }

  return `${move} L ${destination}`
}

export function InteractiveTopology() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [activeNodeId, setActiveNodeId] = useState<string>(networkTopology.nodes[0]?.id ?? '')
  const instructionsId = useId()
  const descriptionId = useId()
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const nodeMap = useMemo(() => new Map(networkTopology.nodes.map((node) => [node.id, node])), [])
  const activeNode = nodeMap.get(activeNodeId) ?? networkTopology.nodes[0]

  const activeEdgeIds = useMemo(() => {
    return new Set(
      networkTopology.edges
        .filter((edge) => edge.from === activeNodeId || edge.to === activeNodeId)
        .map((edge) => edge.id),
    )
  }, [activeNodeId])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
      event.preventDefault()

      const orderedNodes = networkTopology.nodes
      const currentIndex = orderedNodes.findIndex((node) => node.id === activeNodeId)
      if (currentIndex === -1) {
        return
      }

      const direction = event.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (currentIndex + direction + orderedNodes.length) % orderedNodes.length
      const nextNode = orderedNodes[nextIndex]

      setActiveNodeId(nextNode.id)
      nodeRefs.current[nextNode.id]?.focus()
    }
  }

  return (
    <div
      className="relative flex flex-col gap-6"
      role="group"
      aria-labelledby={descriptionId}
      aria-describedby={instructionsId}
      onKeyDown={handleKeyDown}
    >
      <div className="sr-only" id={instructionsId}>
        Use left and right arrow keys to explore the Telcoin engine topology. Hover or focus a node to reveal additional context.
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-telcoin-ink/10 bg-telcoin-surface/60 p-4 shadow-lg shadow-telcoin-ink/10 backdrop-blur">
        <svg
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          className="h-full w-full"
          role="presentation"
        >
          <defs>
            <radialGradient id="topology-glow" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
              <stop offset="65%" stopColor="#312e81" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100" height="88" fill="url(#topology-glow)" rx="6" ry="6" />

          {networkTopology.edges.map((edge, index) => {
            const path = buildPath(edge, nodeMap)
            const isActive = activeEdgeIds.has(edge.id)
            const motionProps = prefersReducedMotion
              ? { initial: { pathLength: 1 }, animate: { pathLength: 1 } }
              : {
                  initial: { pathLength: 0 },
                  animate: { pathLength: 1 },
                  transition: {
                    duration: 3.6 + index * 0.4,
                    repeat: Infinity,
                    repeatType: 'reverse' as const,
                    ease: 'easeInOut',
                  },
                }

            return (
              <motion.path
                key={edge.id}
                d={path}
                stroke={EDGE_COLORS[edge.type]}
                strokeWidth={isActive ? 2.2 : 1.4}
                strokeOpacity={isActive ? 0.9 : 0.4}
                strokeLinecap="round"
                fill="none"
                strokeDasharray="1 6"
                {...motionProps}
              >
                <title>{edge.label}</title>
              </motion.path>
            )
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0">
          {networkTopology.nodes.map((node) => {
            const isActive = node.id === activeNodeId
            return (
              <div
                key={node.id}
                className="absolute"
                style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
              >
                <button
                  type="button"
                  ref={(element) => {
                    nodeRefs.current[node.id] = element
                  }}
                  className={`pointer-events-auto flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border border-white/30 bg-gradient-to-br px-3 py-2 text-center shadow-lg shadow-telcoin-ink/20 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${NODE_TYPE_STYLES[node.type]} ${
                    isActive ? 'ring-2 ring-offset-2 ring-offset-telcoin-surface/80 ring-white/70' : ''
                  }`}
                  aria-pressed={isActive}
                  aria-describedby={descriptionId}
                  onFocus={() => setActiveNodeId(node.id)}
                  onMouseEnter={() => setActiveNodeId(node.id)}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
                    {node.label}
                  </span>
                  <span className="text-sm font-semibold text-white drop-shadow">{node.title}</span>
                  <span className="text-[11px] text-white/80">{node.summary}</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {activeNode ? (
        <article
          className="rounded-3xl border border-telcoin-ink/10 bg-white/90 p-6 shadow-xl shadow-telcoin-ink/10 backdrop-blur"
          aria-live="polite"
          id={descriptionId}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-telcoin-ink/70">{activeNode.label}</p>
          <h3 className="mt-2 text-2xl font-semibold text-telcoin-ink">{activeNode.title}</h3>
          <p className="mt-3 text-base text-telcoin-ink-muted">{activeNode.details}</p>

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Related flows">
            {activeNode.relatedFlows.map((flow) => (
              <span
                key={`${activeNode.id}-${flow}`}
                className="inline-flex items-center gap-1 rounded-full border border-telcoin-ink/10 bg-telcoin-surface/70 px-3 py-1 text-xs font-medium text-telcoin-ink"
              >
                <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: EDGE_COLORS[flow] }} />
                {FLOW_LABELS[flow]}
              </span>
            ))}
          </div>

          {activeNode.cta ? (
            <a
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-telcoin-ink/10 bg-telcoin-ink text-sm font-semibold text-white shadow-sm shadow-telcoin-ink/20 transition hover:bg-telcoin-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-telcoin-ink"
              href={activeNode.cta.href}
            >
              {activeNode.cta.label}
              <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </article>
      ) : null}
    </div>
  )
}
