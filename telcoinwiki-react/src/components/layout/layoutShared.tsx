import type { ComponentProps } from 'react'
import { useLayoutEffect, useMemo, useState } from 'react'
import type { NavItem, SearchConfig } from '../../config/types'
import { Header } from './Header'
import { Footer } from './Footer'
import { SearchModal } from '../search/SearchModal'

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
  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'

    if (hash) {
      const targetId = hash.slice(1)
      const target = targetId ? document.getElementById(targetId) : null

      if (target) {
        target.scrollIntoView({ behavior, block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, behavior })
  }, [hash, pathname])
}
