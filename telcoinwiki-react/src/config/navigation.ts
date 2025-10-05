import type { NavItems } from './types'

export const NAV_ITEMS: NavItems = [
  { id: 'start-here', label: 'Start Here', href: '/start-here', menu: null },
  {
    id: 'faq',
    label: 'FAQ',
    href: '/faq',
    menu: null,
  },
  {
    id: 'deep-dive',
    label: 'Deep-Dive',
    href: '/deep-dive',
    menu: [
      { label: 'Telcoin Network', href: '/deep-dive#deep-network' },
      { label: '$TEL Token', href: '/deep-dive#deep-token' },
      { label: 'TELx Liquidity Engine', href: '/deep-dive#deep-telx' },
      { label: 'Association & Governance', href: '/deep-dive#deep-governance' },
      { label: 'Telcoin Holdings', href: '/deep-dive#deep-holdings' },
    ],
  },
]
