import type { ComponentType } from 'react'
import type { SidebarHeading } from './config/types'
import { PAGE_META } from './config/pageMeta'
import { HomePage } from './pages/HomePage'
import { StartHerePage } from './pages/StartHerePage'
import { WalletPage } from './pages/WalletPage'
import { DeepDivePage } from './pages/DeepDivePage'
import { FaqPage } from './pages/FaqPage'
import { DigitalCashPage } from './pages/DigitalCashPage'
import { RemittancesPage } from './pages/RemittancesPage'
import { TelTokenPage } from './pages/TelTokenPage'
import { NetworkPage } from './pages/NetworkPage'
import { TelxPage } from './pages/TelxPage'
import { GovernancePage } from './pages/GovernancePage'
import { BuildersPage } from './pages/BuildersPage'
import { LinksPage } from './pages/LinksPage'
import { PoolsPage } from './pages/PoolsPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { AboutPage } from './pages/AboutPage'

export type PageId = keyof typeof PAGE_META

export interface AppRoute {
  path: string
  pageId: PageId
  Component: ComponentType
  headings?: SidebarHeading[]
  layout?: 'app' | 'cinematic'
}

export const APP_ROUTES: AppRoute[] = [
  {
    path: '/',
    pageId: 'home',
    Component: HomePage,
    layout: 'cinematic',
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
    path: '/faq',
    pageId: 'faq',
    Component: FaqPage,
    headings: [
      { id: 'faq-hero', text: 'Overview' },
      { id: 'faq-list', text: 'Questions' },
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
    path: '/digital-cash',
    pageId: 'digital-cash',
    Component: DigitalCashPage,
    headings: [
      { id: 'digital-cash-overview', text: 'Overview' },
      { id: 'digital-cash-lineup', text: 'Currency lineup' },
      { id: 'digital-cash-use', text: 'Usage' },
      { id: 'digital-cash-compliance', text: 'Compliance' },
    ],
  },
  {
    path: '/remittances',
    pageId: 'remittances',
    Component: RemittancesPage,
    headings: [
      { id: 'remittance-overview', text: 'Overview' },
      { id: 'remittance-coverage', text: 'Coverage' },
      { id: 'remittance-steps', text: 'How to send' },
      { id: 'remittance-safety', text: 'Safety' },
    ],
  },
  {
    path: '/tel-token',
    pageId: 'tel-token',
    Component: TelTokenPage,
    headings: [
      { id: 'tel-overview', text: 'Overview' },
      { id: 'tel-utility', text: 'Utility' },
      { id: 'tel-rewards', text: 'Rewards' },
      { id: 'tel-risk', text: 'Risk awareness' },
    ],
  },
  {
    path: '/network',
    pageId: 'network',
    Component: NetworkPage,
    headings: [
      { id: 'network-overview', text: 'Overview' },
      { id: 'network-architecture', text: 'Architecture' },
      { id: 'network-governance', text: 'Governance' },
      { id: 'network-security', text: 'Security' },
    ],
  },
  {
    path: '/telx',
    pageId: 'telx',
    Component: TelxPage,
    headings: [
      { id: 'telx-overview', text: 'Overview' },
      { id: 'telx-pillars', text: 'How it works' },
      { id: 'telx-differentiators', text: 'Why it matters' },
      { id: 'telx-builder-links', text: 'Builder resources' },
    ],
  },
  {
    path: '/governance',
    pageId: 'governance',
    Component: GovernancePage,
    headings: [
      { id: 'governance-overview', text: 'Overview' },
      { id: 'governance-structure', text: 'Structure' },
      { id: 'proposal-flow', text: 'Proposal flow' },
      { id: 'compliance', text: 'Compliance' },
    ],
  },
  {
    path: '/builders',
    pageId: 'builders',
    Component: BuildersPage,
    headings: [
      { id: 'builders-overview', text: 'Overview' },
      { id: 'builders-tools', text: 'Dashboards' },
      { id: 'builders-context', text: 'Context' },
      { id: 'builders-contribute', text: 'Contribute' },
    ],
  },
  {
    path: '/links',
    pageId: 'links',
    Component: LinksPage,
    headings: [
      { id: 'links-overview', text: 'Overview' },
      { id: 'links-grid', text: 'Products & services' },
      { id: 'links-governance', text: 'Governance' },
      { id: 'links-compliance', text: 'Compliance' },
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
  {
    path: '/pools',
    pageId: 'pools',
    Component: PoolsPage,
    headings: [
      { id: 'pools-overview', text: 'Overview' },
      { id: 'pools-context', text: 'Context' },
      { id: 'pools-table', text: 'Pool metrics' },
    ],
  },
  {
    path: '/portfolio',
    pageId: 'portfolio',
    Component: PortfolioPage,
    headings: [
      { id: 'portfolio-overview', text: 'Overview' },
      { id: 'portfolio-context', text: 'Context' },
      { id: 'portfolio-claimable', text: 'Claimable rewards' },
      { id: 'portfolio-stakes', text: 'LPT stakes' },
    ],
  },
  {
    path: '/about',
    pageId: 'about',
    Component: AboutPage,
    headings: [
      { id: 'about-mission', text: 'Overview' },
      { id: 'about-disclaimer', text: 'Unofficial status' },
      { id: 'about-contribute', text: 'Contribute' },
      { id: 'about-roadmap', text: 'Roadmap' },
    ],
  },
]
