import type { FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
// MegaMenu removed - not used on homepage
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  function toggleMobileNav() {
    setMobileNavOpen((current) => !current);
  }

  function handleSearchIconClick() {
    setIsSearchExpanded(true);
  }

  // Focus input when search expands
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      // Small delay to allow expansion animation
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchExpanded]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = searchValue.trim();
    if (trimmedQuery) {
      onSearchOpen(trimmedQuery);
      setSearchValue('');
    }
    setIsSearchExpanded(false);
  }

  function handleSearchBlur() {
    // Only collapse if input is empty
    if (!searchValue.trim()) {
      setIsSearchExpanded(false);
    }
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

        <div className="site-header__actions">
          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link to="/deep-dive" className="header-nav-link">
              Deep Dive
            </Link>
            <Link to="/#faq-section" className="header-nav-link">
              FAQ
            </Link>
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

        <div className={`header-search${isSearchExpanded ? ' is-expanded' : ''}`}>
            {!isSearchExpanded ? (
              <button
                type="button"
                className="search-icon-btn"
                onClick={handleSearchIconClick}
                aria-label="Open search"
              >
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
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
            ) : (
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
                  ref={searchInputRef}
                  id="site-header-search"
                  className="search-input"
                  type="search"
                  placeholder="Search Telcoin Wiki"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  onBlur={handleSearchBlur}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="search-submit"
                  aria-label="Search"
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
            )}
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
            <li className="nav-item">
              <Link to="/" onClick={handleMobileLinkClick}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/deep-dive" onClick={handleMobileLinkClick}>Deep Dive</Link>
            </li>
            <li className="nav-item">
              <Link to="/#faq-section" onClick={handleMobileLinkClick}>FAQ</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
