export interface MegaItem {
  label: string
  href: string
  description?: string
}

export interface MegaSection {
  id: string
  label: string
  items: MegaItem[]
}

// Lean, high-signal header menu
export const megaMenuSections: MegaSection[] = [
  {
    id: 'learn',
    label: 'Learn',
    items: [
      { label: 'Deep Dive', href: '/deep-dive', description: 'Long-form references across pillars.' },
      { label: 'FAQ', href: '/faq', description: 'Verified answers with sources.' },
    ],
  },
  {
    id: 'bank',
    label: 'Bank',
    items: [
      { label: 'Telcoin Bank', href: '/bank' },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    items: [
      { label: 'Network Overview', href: '/network' },
      { label: 'Builders', href: '/builders' },
    ],
  },
  {
    id: 'tokenomics',
    label: 'Tokenomics',
    items: [
      { label: 'Tokenomics Overview', href: '/tokenomics' },
      { label: 'TELx Pools', href: '/pools' },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    items: [
      { label: 'Governance Overview', href: '/governance' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    items: [
      { label: 'About this project', href: '/about' },
    ],
  },
]
