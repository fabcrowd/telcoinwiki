import type { ComponentType } from 'react'
import type { SidebarHeading } from './config/types'
import { PAGE_META } from './config/pageMeta'
import { HomePage } from './pages/HomePage'
import { StartHerePage } from './pages/StartHerePage'
import { WalletPage } from './pages/WalletPage'
import { DeepDivePage } from './pages/DeepDivePage'

export type PageId = keyof typeof PAGE_META

export interface AppRoute {
  path: string
  pageId: PageId
  Component: ComponentType
  headings?: SidebarHeading[]
}

export const APP_ROUTES: AppRoute[] = [
  {
    path: '/',
    pageId: 'home',
    Component: HomePage,
    headings: [
      { id: 'home-hero', text: 'Welcome' },
      { id: 'learning-pathways', text: 'Learning pathways' },
      { id: 'faq', text: 'FAQs' },
    ],
  },
  {
    path: '/start-here',
    pageId: 'start-here',
    Component: StartHerePage,
    headings: [
      { id: 'start-intro', text: 'Overview' },
      { id: 'quick-actions', text: 'Essential steps' },
      { id: 'support-links', text: 'Support' },
    ],
  },
  {
    path: '/wallet',
    pageId: 'wallet',
    Component: WalletPage,
    headings: [
      { id: 'wallet-overview', text: 'Overview' },
      { id: 'wallet-capabilities', text: 'Capabilities' },
      { id: 'wallet-safety', text: 'Safety checklist' },
      { id: 'wallet-resources', text: 'Resources' },
    ],
  },
  {
    path: '/deep-dive',
    pageId: 'deep-dive',
    Component: DeepDivePage,
    headings: [
      { id: 'deep-network', text: 'Network' },
      { id: 'deep-token', text: '$TEL Token' },
      { id: 'deep-telx', text: 'TELx' },
      { id: 'deep-governance', text: 'Governance' },
      { id: 'deep-holdings', text: 'Holdings' },
    ],
  },
]
