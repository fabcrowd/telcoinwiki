import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { NavItem, PageMetaMap, SearchConfig } from '../../config/types'
import { Header } from './Header'
import { MAIN_CONTENT_ID, useHashScroll, useLayoutChrome } from './layoutShared'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

interface CinematicLayoutProps {
  pageId: string
  navItems: NavItem[]
  pageMeta: PageMetaMap
  searchConfig: SearchConfig
  children: ReactNode
}

export function CinematicLayout({
  pageId,
  navItems,
  pageMeta,
  searchConfig,
  children,
}: CinematicLayoutProps) {
  // Enable Lenis+GSAP smooth scrolling on cinematic pages for stable pinned timelines
  useSmoothScroll({ enabled: true, lenis: { smoothWheel: true, smoothTouch: false } })
  const { hash, pathname } = useLocation()
  useHashScroll(hash, pathname)

  const currentMeta = pageMeta[pageId] ?? pageMeta.home
  const activeNavId = currentMeta?.navId ?? pageId ?? null

  const { headerProps, footer, searchModal } = useLayoutChrome({
    navItems,
    searchConfig,
    activeNavId,
  })

  return (
    <>
      <div className="app-layer app-layer--cinematic">
        <a className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
          Skip to content
        </a>
        <Header {...headerProps} />
        <main id={MAIN_CONTENT_ID} className="site-main site-main--cinematic" tabIndex={-1}>
          {children}
        </main>
        {footer}
        {searchModal}
      </div>
    </>
  )
}

export default CinematicLayout
