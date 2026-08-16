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

// Anchor targets below must stay in step with the section ids in
// `components/deepDive/DeepDiveFaqSections.tsx`. Enforced by
// `src/components/deepDive/__tests__/anchors.test.ts`.
export const megaMenuSections: MegaSection[] = [
  {
    id: 'discover',
    label: 'Discover',
    items: [
      { label: 'Welcome', href: '/#home-hero', description: 'Start at the cinematic hero experience.' },
      { label: 'Story highlights', href: '/#home-story-cards', description: 'Review the condensed Telcoin narrative.' },
      { label: 'FAQ', href: '/#faq-section', description: 'Short answers to the questions newcomers ask most.' },
    ],
  },
  {
    id: 'understand',
    label: 'Understand',
    items: [
      { label: 'About Telcoin', href: '/deep-dive#deep-about', description: 'What the project is building, and for whom.' },
      { label: 'The problem', href: '/deep-dive#deep-problem', description: 'Why moving money is still slow and expensive.' },
      { label: 'Network & technology', href: '/deep-dive#deep-network', description: 'The modular L1 and how it scales.' },
      { label: 'Consensus', href: '/deep-dive#deep-consensus', description: 'Narwhal, Bullshark, and instant finality.' },
    ],
  },
  {
    id: 'money',
    label: 'Money',
    items: [
      { label: 'Digital Cash', href: '/deep-dive#deep-digital-cash', description: 'Regulated, fiat-backed digital currency.' },
      { label: 'Digital Asset Bank', href: '/deep-dive#deep-bank', description: 'The chartered issuer behind Digital Cash.' },
      { label: 'Remittances', href: '/deep-dive#deep-remittances', description: 'Corridors, costs, and the last mile.' },
      { label: 'The wallet', href: '/deep-dive#deep-wallet', description: 'Self-custody without seed phrases.' },
    ],
  },
  {
    id: 'token',
    label: 'TEL & governance',
    items: [
      { label: 'Tokenomics', href: '/deep-dive#deep-tokenomics', description: 'Fixed supply, 2 decimals, and what TEL is for.' },
      { label: 'Incentives & staking', href: '/deep-dive#deep-incentives', description: 'Staking, TELx, and liquidity rewards.' },
      { label: 'Governance', href: '/deep-dive#deep-governance', description: 'The Association, councils, and proposals.' },
    ],
  },
  {
    id: 'protocol',
    label: 'Protocol',
    items: [
      { label: 'Protocol reference', href: '/protocol', description: 'How the chain itself is built and run.' },
      { label: 'Architecture', href: '/protocol#proto-architecture', description: 'The four modular layers.' },
      { label: 'Transaction lifecycle', href: '/protocol#proto-lifecycle', description: 'Signature to finality in under half a second.' },
      { label: 'Staking a validator', href: '/protocol#proto-staking', description: 'The membership model and the three transactions.' },
      { label: 'Fees', href: '/protocol#proto-fees', description: 'Epoch-based base fees and the gas limit penalty.' },
      { label: 'Documentation index', href: '/protocol#proto-sources', description: 'Every primary source, mapped.' },
    ],
  },
  {
    id: 'evaluate',
    label: 'Evaluate',
    items: [
      { label: 'Risks & open questions', href: '/deep-dive#deep-security', description: 'What could go wrong, stated plainly.' },
      { label: 'Glossary & sources', href: '/deep-dive#deep-glossary', description: 'Key terms and how to verify anything here.' },
    ],
  },
]
