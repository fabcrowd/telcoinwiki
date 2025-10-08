import { motion } from 'framer-motion'
import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'

import { networkTopology } from '../../data/network/topology'
import type { TopologyEdge, TopologyEdgeType, TopologyNode } from '../../data/network/topology'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const EDGE_COLORS: Record<TopologyEdgeType, string> = {
  telFlow: '#2563eb',
  telxFlow: '#9333ea',
  tanTouchpoint: '#f97316',
}

const EDGE_PATTERNS: Record<TopologyEdgeType, string> = {
  telFlow: '4 3', // dashed
  telxFlow: '1 3', // dotted
  tanTouchpoint: '0', // solid
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

type PositionedNode = TopologyNode & {
  computedPosition: { x: number; y: number }
}

type PositionedEdge = TopologyEdge & {
  selectedCurve?: { x: number; y: number }
}

function resolveCurve(
  edge: TopologyEdge,
  isTablet: boolean,
  isMobile: boolean,
): PositionedEdge['selectedCurve'] {
  if (isMobile) {
    if (edge.curveMobile === null) {
      return undefined
    }
    return edge.curveMobile ?? edge.curve
  }

  if (isTablet) {
    if (edge.curveTablet === null) {
      return undefined
    }
    return edge.curveTablet ?? edge.curve
  }

  return edge.curve
}

function buildPath(
  edge: PositionedEdge,
  nodeMap: Map<string, PositionedNode>,
): string {
  const from = nodeMap.get(edge.from)
  const to = nodeMap.get(edge.to)

  if (!from || !to) {
    return ''
  }

  const move = `M ${from.computedPosition.x} ${from.computedPosition.y}`
  const destination = `${to.computedPosition.x} ${to.computedPosition.y}`

  if (edge.selectedCurve) {
    return `${move} Q ${edge.selectedCurve.x} ${edge.selectedCurve.y} ${destination}`
  }

  return `${move} L ${destination}`
}

export function InteractiveTopology() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const saveData = typeof navigator !== 'undefined' && (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 640px)')
  const [activeNodeId, setActiveNodeId] = useState<string>(networkTopology.nodes[0]?.id ?? '')
  const instructionsId = useId()
  const descriptionId = useId()
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const positionedNodes = useMemo<PositionedNode[]>(() => {
    return networkTopology.nodes.map((node) => {
      const computedPosition = isMobile && node.positionMobile
        ? node.positionMobile
        : isTablet && node.positionTablet
          ? node.positionTablet
          : node.position

      return { ...node, computedPosition }
    })
  }, [isMobile, isTablet])

  const positionedEdges = useMemo<PositionedEdge[]>(() => {
    return networkTopology.edges.map((edge) => ({
      ...edge,
      selectedCurve: resolveCurve(edge, isTablet, isMobile),
    }))
  }, [isMobile, isTablet])

  const nodeMap = useMemo(() => new Map(positionedNodes.map((node) => [node.id, node])), [positionedNodes])
  const activeNode = nodeMap.get(activeNodeId) ?? positionedNodes[0]

  const activeEdgeIds = useMemo(() => {
    return new Set(
      positionedEdges
        .filter((edge) => edge.from === activeNodeId || edge.to === activeNodeId)
        .map((edge) => edge.id),
    )
  }, [activeNodeId, positionedEdges])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
      event.preventDefault()

      const orderedNodes = positionedNodes
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

  const nodeWidthStyle: CSSProperties = useMemo(() => {
    if (isMobile) {
      return { width: 'min(64vw, 13.5rem)' }
    }

    if (isTablet) {
      return { width: 'min(32vw, 14.5rem)' }
    }

    return { width: '15rem' }
  }, [isMobile, isTablet])

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

          {positionedEdges.map((edge, index) => {
            const path = buildPath(edge, nodeMap)
            const isActive = activeEdgeIds.has(edge.id)
            const strokeWidth = isMobile
              ? isActive
                ? 1.8
                : 1.1
              : isTablet
                ? isActive
                  ? 2
                  : 1.2
                : isActive
                  ? 2.2
                  : 1.4
            const motionProps = prefersReducedMotion || saveData
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
                strokeWidth={strokeWidth}
                strokeOpacity={isActive ? 0.9 : 0.4}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={EDGE_PATTERNS[edge.type]}
                {...motionProps}
              >
                <title>{edge.label}</title>
              </motion.path>
            )
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0">
          {positionedNodes.map((node) => {
            const isActive = node.id === activeNodeId
            return (
              <div
                key={node.id}
                className="absolute"
                style={{ left: `${node.computedPosition.x}%`, top: `${node.computedPosition.y}%` }}
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
                  style={nodeWidthStyle}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
                    {node.label}
                  </span>
                  <span className="text-sm font-semibold text-white drop-shadow sm:text-base">{node.title}</span>
                  <span className="text-[11px] leading-snug text-white/80 sm:text-xs">{node.summary}</span>
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
                className="inline-flex items-center gap-2 rounded-full border border-telcoin-ink/10 bg-telcoin-surface/70 px-3 py-1 text-xs font-medium text-telcoin-ink"
                title={FLOW_LABELS[flow]}
              >
                <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: EDGE_COLORS[flow] }} />
                <span aria-hidden="true" className="font-mono tracking-[0.2em] text-telcoin-ink/80">
                  {flow === 'tanTouchpoint' ? '⎯⎯' : flow === 'telFlow' ? '– – –' : '· · ·'}
                </span>
                <span className="sr-only">Pattern:</span>
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
