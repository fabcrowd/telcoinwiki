import { useEffect, useMemo, useRef, useState } from 'react'
import type { NavItem, SearchConfig } from '../../config/types'

interface HeaderProps {
  navItems: NavItem[]
  activeNavId?: string | null
  searchConfig: SearchConfig
}

export function Header({ navItems, activeNavId, searchConfig }: HeaderProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const navListRef = useRef<HTMLUListElement>(null)
  const { dataUrl, faqUrl, maxResultsPerGroup } = searchConfig

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!openMenuId) return
      if (!(event.target instanceof Node)) return
      if (navListRef.current && !navListRef.current.contains(event.target)) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [openMenuId])

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenMenuId(null)
      }
    }

    if (openMenuId) {
      document.addEventListener('keydown', handleKeydown)
      return () => document.removeEventListener('keydown', handleKeydown)
    }

    return undefined
  }, [openMenuId])

  const mobileItems = useMemo(() => navItems, [navItems])

  function toggleMenu(itemId: string) {
    setOpenMenuId((current) => (current === itemId ? null : itemId))
  }

  function closeMenus() {
    setOpenMenuId(null)
  }

  function toggleMobileNav() {
    setMobileNavOpen((current) => !current)
  }

  function handleMobileLinkClick() {
    setMobileNavOpen(false)
  }

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <a className="site-brand" href="/">
          <img
            className="site-logo"
            src="/logo.svg"
            alt="Telcoin Wiki logo"
            loading="eager"
            decoding="async"
          />
        </a>

        <nav className="top-nav" aria-label="Primary">
          <ul className="pill-nav top-nav__list" ref={navListRef}>
            {navItems.map((item) => {
              const isActive = item.id === activeNavId
              const isOpen = openMenuId === item.id
              if (!item.menu || item.menu.length === 0) {
                return (
                  <li key={item.id} className="nav-item">
                    <a
                      className={`top-nav__link${isActive ? ' is-active' : ''}`}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={closeMenus}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              }

              return (
                <li
                  key={item.id}
                  className="nav-item"
                  data-open={isOpen ? 'true' : undefined}
                >
                  <button
                    type="button"
                    className={`nav-button${isActive ? ' is-active' : ''}`}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => toggleMenu(item.id)}
                  >
                    {item.label} <span className="nav-caret">▾</span>
                  </button>
                  <div className="nav-menu" role="menu">
                    {item.menu.map((entry) => (
                      <a
                        key={entry.href}
                        href={entry.href}
                        role="menuitem"
                        onClick={closeMenus}
                      >
                        {entry.label}
                      </a>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="menu-btn"
          data-sidebar-toggle
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-drawer"
          onClick={toggleMobileNav}
        >
          Menu
        </button>

        <div
          className="header-search"
          role="search"
          data-search-index-url={dataUrl}
          data-search-faq-url={faqUrl}
          data-search-max-results={String(maxResultsPerGroup)}
        >
          <label className="sr-only" htmlFor="site-search">
            Search Telcoin Wiki
          </label>
          <input
            id="site-search"
            className="search-input"
            type="search"
            name="q"
            placeholder="Search Telcoin Wiki"
            autoComplete="off"
          />
        </div>
      </div>

      <div
        id="mobile-drawer"
        className={`drawer container${mobileNavOpen ? ' is-open' : ''}`}
        hidden={!mobileNavOpen}
      >
        <nav aria-label="Mobile">
          <ul>
            {mobileItems.map((item) => (
              <li key={`mobile-${item.id}`} className="nav-item">
                <a href={item.href} onClick={handleMobileLinkClick}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
