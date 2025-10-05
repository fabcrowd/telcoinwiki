import { useMemo } from 'react'
import type {
  NavItem,
  PageMetaMap,
  SearchConfig,
  SidebarHeading,
} from '../../config/types'
import type { ReactNode } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  pageId: string
  navItems: NavItem[]
  pageMeta: PageMetaMap
  searchConfig: SearchConfig
  headings?: SidebarHeading[]
  children: ReactNode
}

export function AppLayout({
  pageId,
  navItems,
  pageMeta,
  searchConfig,
  headings = [],
  children,
}: AppLayoutProps) {
  const currentMeta = pageMeta[pageId] ?? pageMeta.home
  const activeNavId = currentMeta?.navId ?? pageId

  const sidebarItems = useMemo(
    () =>
      Object.entries(pageMeta)
        .filter(([, meta]) => meta.sidebar)
        .map(([id, meta]) => ({ id, label: meta.label, href: meta.url })),
    [pageMeta],
  )

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header navItems={navItems} activeNavId={activeNavId} searchConfig={searchConfig} />
      <div className="sidebar-overlay" data-sidebar-overlay />
      <div className="site-shell">
        <Sidebar items={sidebarItems} activeId={currentMeta?.navId ?? pageId} headings={headings} />
        <main id="main-content" className="site-main tc-card" tabIndex={-1}>
          <Breadcrumbs pageId={pageId} pageMeta={pageMeta} />
          {children}
        </main>
      </div>
    </>
  )
}
