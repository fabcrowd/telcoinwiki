import type { ComponentType } from 'react'
import type { SidebarHeading } from './config/types'
import { PAGE_META } from './config/pageMeta'
import { HomePage } from './pages/HomePage'
import { GovernancePage } from './pages/GovernancePage'
import { NetworkPage } from './pages/NetworkPage'
import { BankPage } from './pages/BankPage'
import { TokenomicsPage } from './pages/TokenomicsPage'
import { FaqPage } from './pages/FaqPage'
import { DeepDivePage } from './pages/DeepDivePage'
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
      { id: 'home-broken-money', text: 'Broken money' },
      { id: 'home-telcoin-model', text: 'Telcoin model' },
      { id: 'home-engine', text: 'Engine' },
      { id: 'home-experience', text: 'Experience' },
      { id: 'home-learn-more', text: 'Learn more' },
    ],
  },
  {
    path: '/governance',
    pageId: 'governance',
    Component: GovernancePage,
    headings: [
      { id: 'governance-overview', text: 'Overview' },
      { id: 'governance-structure', text: 'Structure' },
      { id: 'governance-lifecycle', text: 'Lifecycle' },
      { id: 'compliance', text: 'Compliance' },
    ],
  },
  {
    path: '/network',
    pageId: 'network',
    Component: NetworkPage,
    headings: [
      { id: 'network-overview', text: 'Overview' },
      { id: 'network-consensus', text: 'Consensus' },
      { id: 'network-architecture', text: 'Topology' },
      { id: 'network-layers', text: 'Layers' },
      { id: 'network-security', text: 'Security' },
    ],
  },
  {
    path: '/bank',
    pageId: 'bank',
    Component: BankPage,
    headings: [
      { id: 'bank-overview', text: 'Overview' },
      { id: 'bank-pillars', text: 'Pillars' },
      { id: 'bank-metrics', text: 'Metrics' },
      { id: 'bank-journey', text: 'Journey' },
      { id: 'bank-resources', text: 'Resources' },
    ],
  },
  {
    path: '/tokenomics',
    pageId: 'tokenomics',
    Component: TokenomicsPage,
    headings: [
      { id: 'tokenomics-overview', text: 'Overview' },
      { id: 'tokenomics-utility', text: 'Utility' },
      { id: 'tokenomics-cycle', text: 'Burn & regen' },
      { id: 'tokenomics-treasury', text: 'Treasury' },
      { id: 'tokenomics-programs', text: 'Programs' },
      { id: 'tokenomics-risk', text: 'Risk' },
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
      { id: 'deep-dive-overview', text: 'Overview' },
      { id: 'deep-broken-money', text: 'Broken Money' },
      { id: 'deep-telcoin-model', text: 'Telcoin Model' },
      { id: 'deep-engine', text: 'Engine' },
      { id: 'deep-experience', text: 'Experience' },
      { id: 'deep-learn-more', text: 'Learn More' },
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
