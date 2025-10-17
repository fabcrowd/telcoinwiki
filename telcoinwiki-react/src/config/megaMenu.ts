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

// Single-page mega menu sections map directly to anchor targets.
export const megaMenuSections: MegaSection[] = [
  {
    id: 'discover',
    label: 'Discover',
    items: [
      { label: 'Welcome', href: '/#home-hero', description: 'Start at the cinematic hero experience.' },
      { label: 'Story highlights', href: '/#home-story-cards', description: 'Review the condensed Telcoin narrative.' },
    ],
  },
]
