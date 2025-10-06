import { useEffect, useState } from 'react'
import type {
  NavItem,
  PageMetaMap,
  SearchConfig,
  SidebarHeading,
} from '../../config/types'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useLayoutState } from '../../hooks/useLayoutState'
import { useBreadcrumbTrail } from '../../hooks/useBreadcrumbTrail'
import { SearchModal } from '../search/SearchModal'

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
  const [isSearchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const hash = location.hash

  const openSearch = () => setSearchOpen(true)
  const handleCloseSearch = () => setSearchOpen(false)

  const currentMeta = pageMeta[pageId] ?? pageMeta.home

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'
    if (!hash) {
      window.scrollTo({ top: 0, behavior })
      return
    }

    const targetId = hash.slice(1)

    if (!targetId) {
      window.scrollTo({ top: 0, behavior })
      return
    }

    const target = document.getElementById(targetId)

    if (target) {
      target.scrollIntoView({ behavior, block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior })
    }
  }, [hash])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header
        navItems={navItems}
        activeNavId={activeNavId}
        onSearchOpen={openSearch}
        isSearchOpen={isSearchOpen}
      />
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
        <main id="main-content" className="site-main tc-card" tabIndex={-1}>
          <Breadcrumbs trail={breadcrumbs} />
          {children}
        </main>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={handleCloseSearch} searchConfig={searchConfig} />
    </>
  )
}
