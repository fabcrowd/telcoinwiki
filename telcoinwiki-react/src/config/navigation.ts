import type { NavItems } from './types'

export const NAV_ITEMS: NavItems = [
  {
    id: 'problem',
    label: 'Problem',
    href: '/problem',
    menu: [
      { label: 'Fees & delays', href: '/problem#problem-fees' },
      { label: 'Access gaps', href: '/problem#problem-access' },
      { label: 'Stable value', href: '/problem#problem-stability' },
    ],
  },
  {
    id: 'model',
    label: 'Model',
    href: '/model',
    menu: [
      { label: 'Operating structure', href: '/model#model-structure' },
      { label: 'TEL incentives', href: '/model#model-incentives' },
      { label: 'Guardrails & policy', href: '/model#model-guardrails' },
    ],
  },
  {
    id: 'engine',
    label: 'Engine',
    href: '/engine',
    menu: [
      { label: 'Network', href: '/engine#engine-network' },
      { label: 'On / off ramps', href: '/engine#engine-ramps' },
      { label: 'Liquidity', href: '/engine#engine-liquidity' },
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    href: '/experience',
    menu: [
      { label: 'Onboarding', href: '/experience#experience-onboarding' },
      { label: 'Transfers', href: '/experience#experience-transfers' },
      { label: 'Safety', href: '/experience#experience-security' },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    href: '/learn',
    menu: [
      { label: 'Research path', href: '/learn#learn-start' },
      { label: 'FAQ', href: '/learn#learn-faq' },
      { label: 'Deep dives', href: '/learn#learn-deep-dive' },
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
