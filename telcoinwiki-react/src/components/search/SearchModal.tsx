import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { SearchConfig } from '../../config/types'
import { useSearchIndex } from '../../hooks/useSearchIndex'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchConfig: SearchConfig
}

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SearchModal({ isOpen, onClose, searchConfig }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)
  const { search, isLoading, error, isFallback, reload } = useSearchIndex(searchConfig)
  const [query, setQuery] = useState('')
  const trimmedQuery = query.trim()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    if (isOpen) {
      const activeElement = document.activeElement
      if (activeElement instanceof HTMLElement) {
        previousFocusRef.current = activeElement
      }
      wasOpenRef.current = true
      return
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false
      const previous = previousFocusRef.current
      if (previous) {
        previous.focus({ preventScroll: true })
      }
      previousFocusRef.current = null
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
    }, 0)

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => {
      window.clearTimeout(timeout)
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [isOpen, onClose])

  const results = useMemo(() => (trimmedQuery ? search(trimmedQuery) : []), [trimmedQuery, search])
  const totalResults = useMemo(
    () => results.reduce((count, group) => count + group.items.length, 0),
    [results],
  )

  useEffect(() => {
    resultRefs.current = []
  }, [totalResults])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return
      }

      const dialog = panelRef.current
      if (!dialog) {
        return
      }

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      ).filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1)

      if (!focusable.length) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (active === first || !active || !dialog.contains(active)) {
          event.preventDefault()
          last.focus({ preventScroll: true })
        }
        return
      }

      if (active === last) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen, totalResults])

  const focusResult = (index: number) => {
    if (!totalResults) {
      return
    }
    const clamped = Math.max(0, Math.min(totalResults - 1, index))
    const target = resultRefs.current[clamped]
    if (target) {
      target.focus({ preventScroll: true })
    }
  }

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && totalResults) {
      event.preventDefault()
      focusResult(0)
    } else if (event.key === 'ArrowUp' && totalResults) {
      event.preventDefault()
      focusResult(totalResults - 1)
    } else if (event.key === 'Enter') {
      const first = resultRefs.current[0]
      if (first) {
        first.click()
      }
    }
  }

  const handleResultKeyDown = (event: ReactKeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusResult(index + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (index === 0) {
        inputRef.current?.focus({ preventScroll: true })
      } else {
        focusResult(index - 1)
      }
    }
  }

  const showEmptyState = trimmedQuery.length > 0 && !totalResults && !isLoading && !error

  let runningIndex = -1

  return (
    <div className={`search-modal${isOpen ? ' is-open' : ''}`} hidden={!isOpen} role="presentation">
      <div className="search-modal__backdrop" aria-hidden="true" onClick={onClose} />
      <div
        className="search-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-search-label"
        ref={panelRef}
      >
        <div className="search-modal__header">
          <label id="site-search-label" htmlFor="site-search-input" className="search-modal__label">
            Search Telcoin Wiki
          </label>
          <input
            id="site-search-input"
            ref={inputRef}
            className="search-modal__input"
            type="search"
            placeholder="Search Telcoin Wiki"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            autoComplete="off"
          />
          <button
            type="button"
            className="search-modal__close"
            onClick={onClose}
            aria-label="Close search overlay"
          >
            Close
          </button>
        </div>

        <div className="search-modal__body" role="region" aria-live="polite">
          {isLoading ? (
            <p className="search-modal__status search-modal__status--loading" role="status">
              <span className="search-modal__spinner" aria-hidden="true" />
              Loading search index...
            </p>
          ) : null}

          {error ? (
            <div className="search-modal__status search-modal__status--error" role="alert">
              <p>We couldn&apos;t load the search index. Check your connection and try again.</p>
              <button type="button" onClick={reload} className="search-modal__retry">
                Retry
              </button>
            </div>
          ) : null}

          {!isLoading && !error && query && isFallback ? (
            <p className="search-modal__status search-modal__status--notice" role="status">
              Showing cached FAQ data while Supabase is unavailable.
            </p>
          ) : null}

          {showEmptyState ? (
            <p className="search-modal__status search-modal__status--empty" role="status">
              No matches yet. Try another keyword or check the FAQ.
            </p>
          ) : null}

          {totalResults ? (
            <div className="search-modal__results">
              {results.map((group) => (
                <Fragment key={group.id}>
                  {group.items.length ? (
                    <p className="search-modal__group-label">{group.label}</p>
                  ) : null}
                  {group.items.map((item, itemIndex) => {
                    runningIndex += 1
                    const currentIndex = runningIndex
                    return (
                      <Link
                        key={`${group.id}-${item.doc.ref}-${itemIndex}`}
                        to={item.doc.url}
                        className="search-modal__result"
                        ref={(element) => {
                          resultRefs.current[currentIndex] = element
                        }}
                        onKeyDown={(event) => handleResultKeyDown(event, currentIndex)}
                        onClick={onClose}
                      >
                        <strong className="search-modal__result-title">{item.doc.title}</strong>
                        <span
                          className="search-modal__result-snippet"
                          dangerouslySetInnerHTML={{ __html: item.snippet }}
                        />
                      </Link>
                    )
                  })}
                </Fragment>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
