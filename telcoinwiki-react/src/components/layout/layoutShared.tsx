import type { ComponentProps } from 'react'
import { useLayoutEffect, useMemo, useState } from 'react'
import type { NavItem, SearchConfig } from '../../config/types'
import { Header } from './Header'
import { Footer } from './Footer'
import { SearchModal } from '../search/SearchModal'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { getLenisInstance, scrollTo } from '../../utils/lenisScroll'

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
  const [initialSearchQuery, setInitialSearchQuery] = useState('')

  const openSearch = (prefill = '') => {
    setInitialSearchQuery(prefill)
    setSearchOpen(true)
  }
  const closeSearch = () => {
    setSearchOpen(false)
    setInitialSearchQuery('')
  }

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
    <SearchModal
      isOpen={isSearchOpen}
      onClose={closeSearch}
      searchConfig={searchConfig}
      initialQuery={initialSearchQuery}
    />
  )

  return { headerProps, footer, searchModal }
}

export function useHashScroll(hash: string, pathname: string) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Try to use Lenis if available, otherwise fall back to native scroll
    const lenis = getLenisInstance()

    if (hash) {
      const targetId = hash.slice(1)
      const target = targetId ? document.getElementById(targetId) : null

      if (target) {
        if (lenis) {
          scrollTo(target, { offset: 0 })
        } else {
          const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'
          target.scrollIntoView({ behavior, block: 'start' })
        }
        return
      }
    }

    const atTop = (window.scrollY ?? window.pageYOffset ?? 0) <= 2
    if (lenis) {
      scrollTo(0, { immediate: atTop })
    } else {
      const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'
      window.scrollTo({ top: 0, behavior: atTop ? 'auto' : behavior })
    }
  }, [hash, pathname, prefersReducedMotion])
}
