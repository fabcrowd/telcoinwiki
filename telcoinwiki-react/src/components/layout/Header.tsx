import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { NavItem } from '../../config/types';

interface HeaderProps {
  navItems: NavItem[];
  activeNavId?: string | null;
  onSearchOpen: () => void;
  isSearchOpen?: boolean;
}

export function Header({
  navItems,
  activeNavId,
  onSearchOpen,
  isSearchOpen = false,
}: HeaderProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!openMenuId) return;
      if (!(event.target instanceof Node)) return;
      if (navListRef.current && !navListRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [openMenuId]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenMenuId(null);
      }
    }

    if (openMenuId) {
      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }

    return undefined;
  }, [openMenuId]);

  const mobileItems = useMemo(() => navItems, [navItems]);

  function toggleMenu(itemId: string) {
    setOpenMenuId((current) => (current === itemId ? null : itemId));
  }

  function closeMenus() {
    setOpenMenuId(null);
  }

  function toggleMobileNav() {
    setMobileNavOpen((current) => !current);
  }

  function handleMobileLinkClick() {
    setMobileNavOpen(false);
  }

  const logoSrc = '/logo.svg';

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link className="site-brand" to="/">
          <img
            className="site-logo"
            src={logoSrc}
            alt="Telcoin Wiki logo"
            loading="eager"
            decoding="async"
          />
        </Link>

        <nav className="top-nav" aria-label="Primary">
          <ul className="pill-nav top-nav__list" ref={navListRef}>
            {navItems.map((item) => {
              const isMenuActive = item.id === activeNavId;
              const isOpen = openMenuId === item.id;
              if (!item.menu || item.menu.length === 0) {
                return (
                  <li key={item.id} className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `top-nav__link${isActive ? ' is-active' : ''}`
                      }
                      to={item.href}
                      onClick={closeMenus}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                );
              }

              return (
                <li
                  key={item.id}
                  className="nav-item"
                  data-open={isOpen ? 'true' : undefined}
                >
                  <button
                    type="button"
                    className={`nav-button${isMenuActive ? ' is-active' : ''}`}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => toggleMenu(item.id)}
                  >
                    {item.label} <span className="nav-caret">▾</span>
                  </button>
                  <div className="nav-menu" role="menu">
                    {item.menu.map((entry) => (
                      <Link
                        key={entry.href}
                        to={entry.href}
                        role="menuitem"
                        onClick={closeMenus}
                      >
                        {entry.label}
                      </Link>
                    ))}
                  </div>
                </li>
              );
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

        <div className="header-search">
          <button
            type="button"
            className="search-trigger"
            onClick={onSearchOpen}
            aria-haspopup="dialog"
            aria-expanded={isSearchOpen}
          >
            Search
          </button>
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
                <NavLink to={item.href} onClick={handleMobileLinkClick}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
