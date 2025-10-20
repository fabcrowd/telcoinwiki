import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { NavItem, PageMetaMap, SearchConfig } from '../../config/types'
import { Header } from './Header'
import { MAIN_CONTENT_ID, useHashScroll, useLayoutChrome } from './layoutShared'
import { IntroReveal } from '../intro/IntroReveal'

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
  const { hash, pathname } = useLocation()
  useHashScroll(hash, pathname)

  const currentMeta = pageMeta[pageId] ?? pageMeta.home
  const activeNavId = currentMeta?.navId ?? pageId ?? null

  const { headerProps, footer, searchModal } = useLayoutChrome({
    navItems,
    searchConfig,
    activeNavId,
  })

  // Hero entrance orchestration
  const layerRef = useRef<HTMLDivElement | null>(null)
  const [heroIntroActive, setHeroIntroActive] = useState(false)
  const [heroGateActive, setHeroGateActive] = useState(false)

  useEffect(() => {
    const onIntroComplete = () => {
      setHeroIntroActive(true)
      setHeroGateActive(true)
    }
    // Only once per page load
    window.addEventListener('intro:complete', onIntroComplete, { once: true })
    return () => window.removeEventListener('intro:complete', onIntroComplete)
  }, [])

  // Remove page gating on first scroll intent
  useEffect(() => {
    if (!heroGateActive) return
    const unlock = () => setHeroGateActive(false)
    // consider wheel/touch/keyboard scroll intents
    const onKey = (e: KeyboardEvent) => {
      const keys = ['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'End', 'Home', ' '] as const
      if ((keys as readonly string[]).includes(e.key)) unlock()
    }
    window.addEventListener('scroll', unlock, { once: true, passive: true })
    window.addEventListener('wheel', unlock, { once: true, passive: true })
    window.addEventListener('touchstart', unlock, { once: true, passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', unlock)
      window.removeEventListener('wheel', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', onKey)
    }
  }, [heroGateActive])

  return (
    <>
      <div
        ref={layerRef}
        className="app-layer app-layer--cinematic"
        data-stage-host
        data-hero-intro={heroIntroActive ? '' : undefined}
        data-hero-gate={heroGateActive ? '' : undefined}
      >
        {/* First-load intro overlay (session-scoped) */}
        <IntroReveal />
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
