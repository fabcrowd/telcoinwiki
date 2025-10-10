import type { ComponentProps } from 'react'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import type { NavItem, SearchConfig } from '../../config/types'
import { Header } from './Header'
import { Footer } from './Footer'
import { SearchModal } from '../search/SearchModal'
import type Lenis from 'lenis'
import { getActiveLenis, subscribeToLenis } from '../../hooks/useSmoothScroll'

export const MAIN_CONTENT_ID = 'main-content'

interface UseLayoutChromeOptions {
  navItems: NavItem[]
  searchConfig: SearchConfig
  activeNavId?: string | null
}

interface LayoutChrome {
  headerProps: ComponentProps<typeof Header>
  footer: JSX.Element
  searchModal: JSX.Element
}

export function useLayoutChrome({
  navItems,
  searchConfig,
  activeNavId = null,
}: UseLayoutChromeOptions): LayoutChrome {
  const [isSearchOpen, setSearchOpen] = useState(false)

  const openSearch = () => setSearchOpen(true)
  const closeSearch = () => setSearchOpen(false)

  const headerProps = useMemo<ComponentProps<typeof Header>>(
    () => ({
      navItems,
      activeNavId,
      onSearchOpen: openSearch,
      isSearchOpen,
    }),
    [navItems, activeNavId, isSearchOpen],
  )

  const footer = useMemo(() => <Footer />, [])

  const searchModal = (
    <SearchModal isOpen={isSearchOpen} onClose={closeSearch} searchConfig={searchConfig} />
  )

  return { headerProps, footer, searchModal }
}

export function useHashScroll(hash: string, pathname: string) {
  // Track Lenis for feature detection, but do not re-run the scroll effect when it changes.
  // Re-running on Lenis init could yank the page back to the top mid-gesture.
  const [, setLenis] = useState<Lenis | null>(() => getActiveLenis())

  useEffect(() => subscribeToLenis(setLenis), [])

  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'

    // Resolve Lenis at the moment we perform the scroll, but don't include it
    // in the dependency list so we don't fight with user input on init.
    const activeLenis = getActiveLenis()

    const attemptLenisScroll = (target: HTMLElement | number) => {
      if (!activeLenis || prefersReducedMotion) return false
      activeLenis.scrollTo(target, { lock: false })
      return true
    }

    if (hash) {
      const targetId = hash.slice(1)
      const target = targetId ? document.getElementById(targetId) : null

      if (target) {
        if (!attemptLenisScroll(target)) {
          target.scrollIntoView({ behavior, block: 'start' })
        }
        return
      }
    }

    if (!attemptLenisScroll(0)) {
      // Avoid smooth-scrolling to 0 on mount, which can feel like a bounce.
      const atTop = (window.scrollY ?? window.pageYOffset ?? 0) <= 2
      window.scrollTo({ top: 0, behavior: atTop ? 'auto' : 'auto' })
    }
  }, [hash, pathname])
}
