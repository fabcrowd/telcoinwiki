export type TopologyNodeType = 'association' | 'validator' | 'liquidity' | 'endpoint'

export type TopologyEdgeType = 'telFlow' | 'telxFlow' | 'tanTouchpoint'

export interface TopologyNode {
  id: string
  title: string
  label: string
  type: TopologyNodeType
  summary: string
  details: string
  position: { x: number; y: number }
  positionTablet?: { x: number; y: number }
  positionMobile?: { x: number; y: number }
  relatedFlows: TopologyEdgeType[]
  cta?: {
    label: string
    href: string
  }
}

export interface TopologyEdge {
  id: string
  from: string
  to: string
  type: TopologyEdgeType
  label: string
  curve?: {
    x: number
    y: number
  }
  curveTablet?: {
    x: number
    y: number
  } | null
  curveMobile?: {
    x: number
    y: number
  } | null
}

export interface NetworkTopology {
  nodes: TopologyNode[]
  edges: TopologyEdge[]
}

export const networkTopology: NetworkTopology = {
  nodes: [
    {
      id: 'association-hub',
      title: 'Telcoin Association',
      label: 'Association',
      type: 'association',
      summary: 'Policy guardians steward validator onboarding and release cadence.',
      details:
        'The Association orchestrates governance, compliance reviews, and validator activation so the network engine stays aligned with regulatory guardrails.',
      position: { x: 50, y: 32 },
      positionTablet: { x: 50, y: 34 },
      positionMobile: { x: 50, y: 28 },
      relatedFlows: ['tanTouchpoint', 'telFlow'],
      cta: {
        label: 'Governance pillars',
        href: '/governance#governance-structure',
      },
    },
    {
      id: 'validator-apac',
      title: 'MNO Validator — APAC',
      label: 'Validator APAC',
      type: 'validator',
      summary: 'Regional telecom secures consensus blocks.',
      details:
        'A GSMA member operator finalizes blocks close to high-volume Asian corridors, feeding TEL issuance rewards and uptime metrics back to the Association.',
      position: { x: 18, y: 18 },
      positionTablet: { x: 28, y: 24 },
      positionMobile: { x: 34, y: 42 },
      relatedFlows: ['telFlow', 'telxFlow'],
      cta: {
        label: 'Validator requirements',
        href: '/network#network-security',
      },
    },
    {
      id: 'validator-na',
      title: 'MNO Validator — North America',
      label: 'Validator NA',
      type: 'validator',
      summary: 'Carrier-grade infrastructure anchors the network core.',
      details:
        'North American carriers pair telecom security practices with EVM tooling, relaying TELx program updates and TAN change controls.',
      position: { x: 82, y: 18 },
      positionTablet: { x: 72, y: 24 },
      positionMobile: { x: 64, y: 50 },
      relatedFlows: ['telFlow', 'tanTouchpoint'],
      cta: {
        label: 'Engine narrative',
        href: '/#home-engine',
      },
    },
    {
      id: 'liquidity-telx',
      title: 'TELx Liquidity Pool',
      label: 'TELx Pool',
      type: 'liquidity',
      summary: 'Automated market makers balance TEL and stable value.',
      details:
        'Liquidity providers keep remittance pairs liquid so value routes instantly between corridors, TEL staking, and Digital Cash conversions.',
      position: { x: 25, y: 58 },
      positionTablet: { x: 30, y: 64 },
      positionMobile: { x: 34, y: 68 },
      relatedFlows: ['telxFlow'],
      cta: {
        label: 'Explore TELx pools',
        href: '/pools#pools-overview',
      },
    },
    {
      id: 'liquidity-remittance',
      title: 'Cross-border Corridor',
      label: 'Remittance Flow',
      type: 'liquidity',
      summary: 'Compliant off-ramps settle customer transfers.',
      details:
        'Licensed partners settle fiat and mobile money payouts, pulling liquidity from TELx pools and reporting status back through TAN touchpoints.',
      position: { x: 75, y: 58 },
      positionTablet: { x: 70, y: 64 },
      positionMobile: { x: 64, y: 76 },
      relatedFlows: ['telxFlow', 'tanTouchpoint'],
      cta: {
        label: 'See remittance playbooks',
        href: '/remittances#remittance-overview',
      },
    },
    {
      id: 'endpoint-wallet',
      title: 'Telcoin Wallet',
      label: 'Wallet',
      type: 'endpoint',
      summary: 'User experience routes TEL and Digital Cash.',
      details:
        'The Telcoin Wallet exposes regulated cash-in and cash-out, anchored to the Association-controlled smart contracts and network validators.',
      position: { x: 50, y: 80 },
      positionTablet: { x: 50, y: 84 },
      positionMobile: { x: 50, y: 86 },
      relatedFlows: ['telFlow', 'telxFlow', 'tanTouchpoint'],
      cta: {
        label: 'Wallet experience',
        href: '/wallet#wallet-overview',
      },
    },
    {
      id: 'endpoint-digital-cash',
      title: 'Digital Cash Reserves',
      label: 'Digital Cash',
      type: 'endpoint',
      summary: 'Fully collateralized e-money issued through TAN.',
      details:
        'Reserve attestations, cash management, and TAN monitoring keep Digital Cash tokens redeemable, feeding compliance signals back to validators.',
      position: { x: 50, y: 8 },
      positionTablet: { x: 50, y: 10 },
      positionMobile: { x: 50, y: 16 },
      relatedFlows: ['tanTouchpoint', 'telxFlow'],
      cta: {
        label: 'Learn about Digital Cash',
        href: '/digital-cash#digital-cash-use',
      },
    },
  ],
  edges: [
    {
      id: 'edge-association-wallet',
      from: 'association-hub',
      to: 'endpoint-wallet',
      type: 'tanTouchpoint',
      label: 'Compliance signals',
      curve: { x: 50, y: 55 },
      curveTablet: { x: 52, y: 58 },
      curveMobile: { x: 50, y: 68 },
    },
    {
      id: 'edge-association-digital-cash',
      from: 'association-hub',
      to: 'endpoint-digital-cash',
      type: 'tanTouchpoint',
      label: 'Reserve oversight',
      curve: { x: 50, y: 18 },
      curveTablet: { x: 50, y: 16 },
      curveMobile: { x: 50, y: 22 },
    },
    {
      id: 'edge-association-validator-apac',
      from: 'association-hub',
      to: 'validator-apac',
      type: 'tanTouchpoint',
      label: 'Validator policy sync',
      curve: { x: 34, y: 26 },
      curveTablet: { x: 36, y: 32 },
      curveMobile: { x: 42, y: 34 },
    },
    {
      id: 'edge-association-validator-na',
      from: 'association-hub',
      to: 'validator-na',
      type: 'tanTouchpoint',
      label: 'Validator policy sync',
      curve: { x: 66, y: 26 },
      curveTablet: { x: 64, y: 32 },
      curveMobile: { x: 58, y: 34 },
    },
    {
      id: 'edge-validator-apac-liquidity',
      from: 'validator-apac',
      to: 'liquidity-telx',
      type: 'telFlow',
      label: 'TEL staking rewards',
      curve: { x: 20, y: 38 },
      curveTablet: { x: 26, y: 44 },
      curveMobile: null,
    },
    {
      id: 'edge-validator-na-liquidity',
      from: 'validator-na',
      to: 'liquidity-remittance',
      type: 'telFlow',
      label: 'TEL staking rewards',
      curve: { x: 80, y: 38 },
      curveTablet: { x: 74, y: 44 },
      curveMobile: null,
    },
    {
      id: 'edge-liquidity-wallet',
      from: 'liquidity-telx',
      to: 'endpoint-wallet',
      type: 'telxFlow',
      label: 'TELx conversions',
      curve: { x: 38, y: 72 },
      curveTablet: { x: 34, y: 76 },
      curveMobile: { x: 40, y: 78 },
    },
    {
      id: 'edge-wallet-remittance',
      from: 'endpoint-wallet',
      to: 'liquidity-remittance',
      type: 'telxFlow',
      label: 'Remittance settlement',
      curve: { x: 62, y: 72 },
      curveTablet: { x: 66, y: 76 },
      curveMobile: { x: 58, y: 78 },
    },
    {
      id: 'edge-digital-cash-wallet',
      from: 'endpoint-digital-cash',
      to: 'endpoint-wallet',
      type: 'telxFlow',
      label: 'Digital Cash mint/burn',
      curve: { x: 50, y: 40 },
      curveTablet: { x: 48, y: 48 },
      curveMobile: { x: 50, y: 48 },
    },
    {
      id: 'edge-remittance-association',
      from: 'liquidity-remittance',
      to: 'association-hub',
      type: 'tanTouchpoint',
      label: 'Reporting & TAN updates',
      curve: { x: 68, y: 44 },
      curveTablet: { x: 66, y: 48 },
      curveMobile: { x: 62, y: 48 },
    },
  ],
}
