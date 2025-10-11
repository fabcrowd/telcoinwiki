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

// Initial content mapping (no icons, light descriptions). URLs can be updated later.
export const megaMenuSections: MegaSection[] = [
  {
    id: 'learn',
    label: 'Learn',
    items: [
      { label: 'Start Here', href: '/start-here', description: 'New to Telcoin? Begin with the basics.' },
      { label: 'FAQs', href: '/faq', description: 'Verified answers with links to sources.' },
      { label: 'Deep Dives', href: '/deep-dives', description: 'Long-form topics and research.' },
      { label: 'Guides', href: '/guides', description: 'Step-by-step onboarding and how-tos.' },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    items: [
      { label: 'Telcoin App', href: '/bank', description: 'Wallet, swaps, remittances — mobile-first.' },
      { label: 'Digital Cash', href: '/digital-cash', description: 'Programmable money for global rails.' },
      { label: 'Remittances', href: '/remittances', description: 'Fast, low-cost corridors worldwide.' },
      { label: 'On/Off-Ramps', href: '/partners', description: 'Where to fund and cash out.' },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    items: [
      { label: 'Telcoin Network (L1)', href: '/network', description: 'Purpose-built chain secured by carriers.' },
      { label: 'Validators & Security', href: '/network#validators', description: 'Carrier-grade finality and ops.' },
      { label: 'Protocol Overview', href: '/network#protocol', description: 'DAG + BFT and transaction flow.' },
      { label: 'Tokenomics ($TEL)', href: '/tokenomics', description: 'Burn & regen, fees, rewards.' },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    items: [
      { label: 'Councils & Process', href: '/governance', description: 'Accuracy-first oversight and upgrades.' },
      { label: 'Treasury', href: '/governance#treasury', description: 'Stewardship and allocations.' },
      { label: 'Policy & Compliance', href: '/governance#policy', description: 'Regulatory posture and controls.' },
      { label: 'Roadmap', href: '/roadmap', description: 'What the community is building next.' },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    items: [
      { label: "What’s New", href: '/news', description: 'Recent highlights and updates.' },
      { label: 'Channels', href: '/community', description: 'Join the conversation.' },
      { label: 'Grants', href: '/grants', description: 'Funding for ecosystem projects.' },
      { label: 'Contribute to the Wiki', href: '/contribute', description: 'Help curate knowledge.' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    items: [
      { label: 'Association', href: '/about/association', description: 'Mission and structure.' },
      { label: 'Company', href: '/about/company', description: 'Team and operations.' },
      { label: 'Legal & Disclosures', href: '/legal', description: 'Terms and transparency.' },
      { label: 'Contact', href: '/contact', description: 'Get in touch.' },
    ],
  },
]

