import type { NavItems } from './types'

export const NAV_ITEMS: NavItems = [
  { id: 'start-here', label: 'Start Here', href: '/start-here.html', menu: null },
  {
    id: 'faq',
    label: 'FAQ',
    href: '/#faq',
    menu: [
      { label: 'Basics', href: '/#faq-basics' },
      { label: 'Network & MNOs', href: '/#faq-network' },
      { label: 'Bank & eUSD', href: '/#faq-bank' },
      { label: 'Using TEL & App', href: '/#faq-app' },
    ],
  },
  {
    id: 'deep-dive',
    label: 'Deep-Dive',
    href: '/deep-dive.html',
    menu: [
      { label: 'Telcoin Network', href: '/deep-dive.html#deep-network' },
      { label: '$TEL Token', href: '/deep-dive.html#deep-token' },
      { label: 'TELx Liquidity Engine', href: '/deep-dive.html#deep-telx' },
      { label: 'Association & Governance', href: '/deep-dive.html#deep-governance' },
      { label: 'Telcoin Holdings', href: '/deep-dive.html#deep-holdings' },
    ],
  },
]
