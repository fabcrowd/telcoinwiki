import type {
  NavItem,
  PageMetaMap,
  SearchConfig,
  SidebarHeading,
} from '../../config/types'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useLayoutState } from '../../hooks/useLayoutState'
import { useBreadcrumbTrail } from '../../hooks/useBreadcrumbTrail'
import { Breadcrumbs } from './Breadcrumbs'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useLayoutChrome, useHashScroll, MAIN_CONTENT_ID } from './layoutShared'

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
  const { activeNavId, sidebarItems, isSidebarOpen, closeSidebar } = useLayoutState({
    pageId,
    pageMeta,
  })
  const breadcrumbs = useBreadcrumbTrail(pageId, pageMeta)
  const { hash, pathname } = useLocation()

  const currentMeta = pageMeta[pageId] ?? pageMeta.home

  const { headerProps, footer, searchModal } = useLayoutChrome({
    navItems,
    searchConfig,
    activeNavId,
  })

  useHashScroll(hash, pathname)

  return (
    <>
      <div className="app-layer" data-stage-host>
        <a className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
          Skip to content
        </a>
        <Header {...headerProps} />
        <div
          className={`sidebar-overlay${isSidebarOpen ? ' is-active' : ''}`}
          data-sidebar-overlay
          onClick={closeSidebar}
        />
        <div className="site-shell">
          <Sidebar
            items={sidebarItems}
            activeId={currentMeta?.navId ?? pageId}
            headings={headings}
            isOpen={isSidebarOpen}
          />
          <main id={MAIN_CONTENT_ID} className="site-main tc-card" tabIndex={-1}>
            {(pageId !== 'home' || breadcrumbs.length > 1) && <Breadcrumbs trail={breadcrumbs} />}
            {children}
          </main>
        </div>
        {footer}
        {searchModal}
      </div>
    </>
  )
}
