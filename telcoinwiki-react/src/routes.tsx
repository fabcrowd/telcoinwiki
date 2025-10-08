import type { ComponentType } from 'react'
import type { SidebarHeading } from './config/types'
import { PAGE_META } from './config/pageMeta'
import { HomePage } from './pages/HomePage'
import { ProblemPage } from './pages/ProblemPage'
import { ModelPage } from './pages/ModelPage'
import { EnginePage } from './pages/EnginePage'
import { ExperiencePage } from './pages/ExperiencePage'
import { LearnPage } from './pages/LearnPage'
import { DeepDivePage } from './pages/DeepDivePage'
import { FaqPage } from './pages/FaqPage'
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
    path: '/problem',
    pageId: 'problem',
    Component: ProblemPage,
    headings: [
      { id: 'problem-hero', text: 'Overview' },
      { id: 'problem-fees', text: 'Fees & delays' },
      { id: 'problem-access', text: 'Access gaps' },
      { id: 'problem-stability', text: 'Stable value' },
    ],
  },
  {
    path: '/model',
    pageId: 'model',
    Component: ModelPage,
    headings: [
      { id: 'model-hero', text: 'Overview' },
      { id: 'model-structure', text: 'Operating structure' },
      { id: 'model-incentives', text: 'TEL incentives' },
      { id: 'model-guardrails', text: 'Guardrails & policy' },
    ],
  },
  {
    path: '/engine',
    pageId: 'engine',
    Component: EnginePage,
    headings: [
      { id: 'engine-hero', text: 'Overview' },
      { id: 'engine-network', text: 'Network' },
      { id: 'engine-ramps', text: 'On / off ramps' },
      { id: 'engine-liquidity', text: 'Liquidity' },
    ],
  },
  {
    path: '/experience',
    pageId: 'experience',
    Component: ExperiencePage,
    headings: [
      { id: 'experience-hero', text: 'Overview' },
      { id: 'experience-onboarding', text: 'Onboarding' },
      { id: 'experience-transfers', text: 'Transfers' },
      { id: 'experience-security', text: 'Safety' },
    ],
  },
  {
    path: '/learn',
    pageId: 'learn',
    Component: LearnPage,
    headings: [
      { id: 'learn-hero', text: 'Overview' },
      { id: 'learn-start', text: 'Research path' },
      { id: 'learn-faq', text: 'FAQ' },
      { id: 'learn-deep-dive', text: 'Deep dives' },
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
