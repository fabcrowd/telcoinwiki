import type { NavItems } from './types'

export const NAV_ITEMS: NavItems = [
  {
    id: 'governance',
    label: 'Governance',
    href: '/governance',
    menu: [
      { label: 'Structure', href: '/governance#governance-structure' },
      { label: 'Lifecycle', href: '/governance#governance-lifecycle' },
      { label: 'Compliance', href: '/governance#compliance' },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    href: '/network',
    menu: [
      { label: 'Consensus snapshot', href: '/network#network-consensus' },
      { label: 'Interactive topology', href: '/network#network-architecture' },
      { label: 'Security posture', href: '/network#network-security' },
    ],
  },
  {
    id: 'bank',
    label: 'Bank',
    href: '/bank',
    menu: [
      { label: 'Experience pillars', href: '/bank#bank-pillars' },
      { label: 'User journey', href: '/bank#bank-journey' },
      { label: 'Resources', href: '/bank#bank-resources' },
    ],
  },
  {
    id: 'tokenomics',
    label: 'Tokenomics',
    href: '/tokenomics',
    menu: [
      { label: 'Utility', href: '/tokenomics#tokenomics-utility' },
      { label: 'Burn & regen', href: '/tokenomics#tokenomics-cycle' },
      { label: 'Programs', href: '/tokenomics#tokenomics-programs' },
    ],
  },
  {
    id: 'faq',
    label: 'FAQ',
    href: '/faq',
    menu: [
      { label: 'Overview', href: '/faq#faq-hero' },
      { label: 'Questions', href: '/faq#faq-list' },
    ],
  },
]
