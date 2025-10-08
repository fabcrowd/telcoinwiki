import type { TopologyEdgeType } from '../../data/network/topology'

export const EDGE_COLORS: Record<TopologyEdgeType, string> = {
  telFlow: '#2563eb',
  telxFlow: '#9333ea',
  tanTouchpoint: '#f97316',
}

export const EDGE_PATTERNS: Record<TopologyEdgeType, string> = {
  telFlow: '4 3', // dashed
  telxFlow: '1 3', // dotted
  tanTouchpoint: '0', // solid
}

export const FLOW_LABELS: Record<TopologyEdgeType, string> = {
  telFlow: 'TEL issuance & staking flow',
  telxFlow: 'TELx liquidity flow',
  tanTouchpoint: 'TAN compliance touchpoint',
}

