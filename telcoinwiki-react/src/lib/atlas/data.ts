export type Vec3 = readonly [number, number, number]
export type NodeKind = 'cyan' | 'gold' | 'neutral'

export interface EcosystemEntity {
  id: string
  label: string
  kind: NodeKind
  position: Vec3
  size: number
  kicker: string
  body: string
  facts: readonly string[]
  /**
   * Where this entity is covered in depth elsewhere on the wiki. The 3D
   * model is deliberately not the only place this information lives — it
   * is a map, and the inspector should always offer a way to the prose.
   */
  href: string
  hrefLabel: string
}

export interface EcosystemEdge {
  a: string
  b: string
  kind: 'value' | 'money' | 'gov'
  label: string
}

export const ECOSYSTEM: Record<string, EcosystemEntity> = {
  tel: {
    id: 'tel',
    label: 'TEL',
    kind: 'cyan',
    position: [-6.4, 1.4, 0],
    size: 1.55,
    kicker: 'The native token',
    body: 'The fuel and coordination asset of the whole platform. Fixed supply of 100 billion with just 2 decimal places — unusual for an ERC-20, and a reliable source of bugs when reading raw balances.',
    facts: [
      '100,000,000,000 fixed supply · 2 decimals',
      'Gas on Telcoin Network',
      'Staked by validators to secure consensus',
      'LP rewards on TELx + governance weight',
    ],
    href: '/protocol#proto-token',
    hrefLabel: 'Native token & 0x7e1 precompile',
  },
  network: {
    id: 'network',
    label: 'Telcoin Network',
    kind: 'cyan',
    position: [0, 0, 0],
    size: 1.35,
    kicker: 'Settlement · Layer 1',
    body: 'The EVM-compatible Layer 1 where value settles. A DAG consensus layer orders transactions and a Reth-based EVM executes them, giving instant deterministic finality suited to payments.',
    facts: [
      'EVM-compatible — Solidity, Reth execution',
      'Narwhal/Bullshark DAG consensus',
      'Validated by GSMA member mobile operators',
      'Every transaction burns TEL as gas',
    ],
    href: '/protocol#proto-architecture',
    hrefLabel: 'Architecture — the four layers',
  },
  validators: {
    id: 'validators',
    label: 'GSMA Validators',
    kind: 'cyan',
    position: [0, -3.4, 0],
    size: 1.1,
    kicker: 'Security · block production',
    body: 'The block producers, and the decision that most sets Telcoin apart. Validator slots are permissioned to GSMA full-member mobile network operators, approved by the Compliance Council, who stake TEL and run the nodes.',
    facts: [
      'Permissioned to GSMA mobile operators',
      'Stake 1,000,000 TEL for proof-of-stake consensus',
      'Each runs Primary + Worker nodes',
      'Earn TEL gas fees and issuance',
    ],
    href: '/protocol#proto-staking',
    hrefLabel: 'The membership model & staking',
  },
  telx: {
    id: 'telx',
    label: 'TELx',
    kind: 'cyan',
    position: [0, 3.6, 0],
    size: 1.15,
    kicker: 'Liquidity layer',
    body: 'The liquidity engine. TELx layers TEL incentives over established AMMs so there is depth for TEL and Digital Cash — which is what keeps in-wallet swap rates tight.',
    facts: [
      'Liquidity mining paid in TEL',
      'Built on Uniswap + Balancer',
      'Mainly Polygon, also Base',
      'Migrating to Uniswap v4 (Telcoin Hook)',
    ],
    href: '/deep-dive#deep-incentives',
    hrefLabel: 'Incentives & staking deep dive',
  },
  wallet: {
    id: 'wallet',
    label: 'TAN · Wallet',
    kind: 'neutral',
    position: [0, 7.0, 0],
    size: 1.2,
    kicker: 'Application layer',
    body: 'TAN — the Telcoin Application Network — is the third layer of the stack: self-custodial mobile apps built by GSMA telecom members. The Telcoin Wallet is a TAN app, and where the system becomes a product.',
    facts: [
      'App layer atop Network + TELx',
      'Assisted self-custody: 2-of-3 keys',
      'No seed phrase — access tied to your number',
      'Holds Digital Cash + crypto, swaps, staking',
    ],
    href: '/deep-dive#deep-wallet',
    hrefLabel: 'The Telcoin Wallet deep dive',
  },
  digitalcash: {
    id: 'digitalcash',
    label: 'Digital Cash',
    kind: 'gold',
    position: [6.4, 3.0, 2.4],
    size: 1.3,
    kicker: 'Regulated money',
    body: 'Fiat-backed digital currencies — eUSD, eGBP, eJPY and more — issued and redeemed by the Telcoin Digital Asset Bank and settled on Telcoin Network. Multi-currency by design, because a remittance is a currency pair.',
    facts: [
      'Bank-issued and fiat-backed (e.g. eUSD)',
      '~12 live on Polygon; more announced',
      'Redeemable from 100% reserves',
      'Named with an e- prefix (mostly ISO codes)',
    ],
    href: '/deep-dive#deep-digital-cash',
    hrefLabel: 'Digital Cash deep dive',
  },
  bank: {
    id: 'bank',
    label: 'Digital Asset Bank',
    kind: 'gold',
    position: [6.4, 6.6, 2.4],
    size: 1.25,
    kicker: 'The issuer',
    body: 'A distinct regulated entity holding Nebraska’s first Digital Asset Depository Institution charter, finalized 12 November 2025 — the first digital asset bank charter in the United States.',
    facts: [
      'First US digital asset bank charter (Nov 2025)',
      '≥100% USD-denominated reserves',
      'No FDIC insurance (by statute)',
      'Runs KYC/AML; mints and burns Digital Cash',
    ],
    href: '/deep-dive#deep-bank',
    hrefLabel: 'Telcoin Digital Asset Bank deep dive',
  },
  association: {
    id: 'association',
    label: 'Telcoin Association',
    kind: 'neutral',
    position: [-6.4, 6.6, -2.4],
    size: 1.2,
    kicker: 'Governance',
    body: 'A Swiss non-profit Verein domiciled in Lugano that stewards the protocol. Governance is polycentric: elected Miner Councils handle each domain, and the Miner Assembly holds constitutional authority.',
    facts: [
      'Swiss Verein, domiciled in Lugano',
      'Elected Miner Councils per domain',
      'Miner Assembly = constitutional authority',
      'Sets validator policy and TELx emissions',
    ],
    href: '/deep-dive#deep-governance',
    hrefLabel: 'Governance deep dive',
  },
}

export const ECOSYSTEM_EDGES: readonly EcosystemEdge[] = [
  { a: 'validators', b: 'network', kind: 'value', label: 'secure · validate' },
  { a: 'network', b: 'telx', kind: 'value', label: 'settles trades' },
  { a: 'telx', b: 'wallet', kind: 'value', label: 'swap liquidity' },
  { a: 'tel', b: 'network', kind: 'value', label: 'gas + issuance' },
  { a: 'tel', b: 'validators', kind: 'value', label: 'staked by' },
  { a: 'tel', b: 'telx', kind: 'value', label: 'LP rewards' },
  { a: 'bank', b: 'digitalcash', kind: 'money', label: 'issues · redeems' },
  { a: 'digitalcash', b: 'telx', kind: 'money', label: 'traded on' },
  { a: 'digitalcash', b: 'wallet', kind: 'money', label: 'held in' },
  { a: 'association', b: 'network', kind: 'gov', label: 'validator policy' },
  { a: 'association', b: 'telx', kind: 'gov', label: 'sets emissions' },
]

export const ECOSYSTEM_IDS = Object.keys(ECOSYSTEM)

/** Type guard used to validate a `?node=` query param before trusting it as an entity id. */
export function isEcosystemId(id: string | null | undefined): id is string {
  return typeof id === 'string' && ECOSYSTEM_IDS.includes(id)
}

/** Consensus simulation constants (Narwhal/Bullshark DAG). */
export const CONSENSUS = {
  validators: ['alpha', 'bravo', 'charlie', 'delta'] as const,
  /** 2f+1 with n=4, f=1. */
  quorum: 3,
  roundSpacing: 2.75,
  laneSpacing: 2.5,
  /** Garbage-collection window, mirroring Narwhal's own pruning. */
  keepRounds: 6,
  stepMs: 1650,
}

/** RGB triples in 0..1, matched to `NodeKind` plus a couple of scene-only accents. */
export const PALETTE = {
  slate: [0.36, 0.46, 0.55] as Vec3,
  cyan: [0.23, 0.82, 0.85] as Vec3,
  gold: [0.94, 0.75, 0.39] as Vec3,
  hot: [1.0, 0.93, 0.74] as Vec3,
  grid: [0.3, 0.42, 0.52] as Vec3,
}
