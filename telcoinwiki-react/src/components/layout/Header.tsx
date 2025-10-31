import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MEGA_MENU_ENABLED } from '../../config/featureFlags';
import { megaMenuSections } from '../../config/megaMenu';
import { MegaMenu } from './MegaMenu';
import type { NavItem } from '../../config/types';

interface HeaderProps {
  navItems: NavItem[];
  activeNavId?: string | null;
  onSearchOpen: (prefill?: string) => void;
  isSearchOpen?: boolean;
}

export function Header({
  navItems,
  activeNavId,
  onSearchOpen,
  isSearchOpen = false,
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!isDropdownOpen) return;
      if (!(event.target instanceof Node)) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [isDropdownOpen]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }

    return undefined;
  }, [isDropdownOpen]);

  function toggleMobileNav() {
    setMobileNavOpen((current) => !current);
    setIsDropdownOpen(false);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = searchValue.trim();
    onSearchOpen(trimmedQuery);
    setSearchValue('');
  }

  function handleMobileLinkClick() {
    setMobileNavOpen(false);
  }

  function toggleDropdown() {
    setIsDropdownOpen((current) => !current);
  }

  function closeDropdown() {
    setIsDropdownOpen(false);
  }

  const dropdownId = 'header-nav-dropdown';

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

        <div className="site-header__actions">
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

          <div className="desktop-nav" ref={dropdownRef}>
            {MEGA_MENU_ENABLED ? (
              <MegaMenu sections={megaMenuSections} />
            ) : (
              <>
                <div id={dropdownId} className={`nav-dropdown${isDropdownOpen ? ' is-open' : ''}`} role="menu">
                  <nav aria-label="Primary navigation">
                    <ul className="nav-dropdown__list">
                      {navItems.map((item) => {
                        const itemIsActive = item.id === activeNavId;
                        return (
                          <li key={item.id} className={`nav-dropdown__item${itemIsActive ? ' is-active' : ''}`}>
                            <NavLink
                              to={item.href}
                              className={({ isActive }) => `nav-dropdown__link${isActive ? ' is-current' : ''}`}
                              onClick={closeDropdown}
                            >
                              {item.label}
                            </NavLink>
                            {item.menu && item.menu.length > 0 ? (
                              <ul className="nav-dropdown__submenu">
                                {item.menu.map((entry) => (
                                  <li key={entry.href} className="nav-dropdown__submenuItem">
                                    <Link to={entry.href} className="nav-dropdown__submenuLink" onClick={closeDropdown}>
                                      {entry.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </>
            )}
          </div>

        <div className="header-search">
            <form
              className="header-search__form"
              role="search"
              aria-label="Search Telcoin Wiki"
              onSubmit={handleSearchSubmit}
            >
              <label htmlFor="site-header-search" className="visually-hidden">
                Search Telcoin Wiki
              </label>
              <input
                id="site-header-search"
                className="search-input"
                type="search"
                placeholder="Search Telcoin Wiki"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                autoComplete="off"
              />
              <button
                type="submit"
                className="search-submit"
                aria-label="Open search dialog"
                aria-haspopup="dialog"
                aria-expanded={isSearchOpen}
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0-2C6.582 2 3 5.582 3 10s3.582 8 8 8a7.95 7.95 0 0 0 4.9-1.635l4.368 4.367a1 1 0 0 0 1.414-1.414l-4.367-4.368A7.95 7.95 0 0 0 19 10c0-4.418-3.582-8-8-8z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div
        id="mobile-drawer"
        className={`drawer container${mobileNavOpen ? ' is-open' : ''}`}
        hidden={!mobileNavOpen}
      >
        <nav aria-label="Mobile">
          <ul>
            {navItems.map((item) => (
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
