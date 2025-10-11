import { useEffect, useMemo, useRef, useState, type FocusEvent } from 'react'
import { Link } from 'react-router-dom'
import type { MegaSection } from '../../config/megaMenu'

interface MegaMenuProps {
  sections: MegaSection[]
}

const MOBILE_BREAKPOINT = 768 // px
const CLOSE_DELAY_MS = 180

export function MegaMenu({ sections }: MegaMenuProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const openTimeoutRef = useRef<number | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    if ('addEventListener' in mq) mq.addEventListener('change', update)
    else mq.addListener(update)
    return () => {
      if ('removeEventListener' in mq) mq.removeEventListener('change', update)
      else mq.removeListener(update)
    }
  }, [])

  useEffect(() => {
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null)
    }
    document.addEventListener('keydown', onDocKey)
    return () => document.removeEventListener('keydown', onDocKey)
  }, [])

  const { topItems, sectionMap } = useMemo(() => {
    const items = sections.map((s) => ({ id: s.id, label: s.label }))
    const map = new Map(sections.map((s) => [s.id, s]))
    return { topItems: items, sectionMap: map }
  }, [sections])

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current !== null) window.clearTimeout(openTimeoutRef.current)
      if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  const clearOpenTimeout = () => {
    if (openTimeoutRef.current !== null) {
      window.clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
  }

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const handleEnter = (id: string) => {
    if (isMobile) return
    clearCloseTimeout()
    if (activeId === id) return
    clearOpenTimeout()
    openTimeoutRef.current = window.setTimeout(() => {
      setActiveId(id)
      openTimeoutRef.current = null
    }, 0)
  }
  const handleLeave = () => {
    if (isMobile) return
    clearOpenTimeout()
    clearCloseTimeout()
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveId(null)
      closeTimeoutRef.current = null
    }, CLOSE_DELAY_MS)
  }
  const handleFocusOut = (e: FocusEvent) => {
    if (!containerRef.current) return
    if (containerRef.current.contains(e.relatedTarget as Node)) return
    clearOpenTimeout()
    clearCloseTimeout()
    setActiveId(null)
  }

  const toggleMobile = (id: string) => setActiveId((current) => (current === id ? null : id))

  return (
    <div className="mega" ref={containerRef} onBlur={handleFocusOut}>
      <nav className="mega__bar" role="menubar" aria-label="Primary">
        {topItems.map((item) => (
          <div
            key={item.id}
            className={`mega__tab${activeId === item.id ? ' is-active' : ''}`}
            onMouseEnter={() => handleEnter(item.id)}
            onMouseLeave={handleLeave}
          >
            <button
              type="button"
              className="mega__trigger"
              aria-haspopup="true"
              aria-expanded={activeId === item.id}
              onClick={() => (isMobile ? toggleMobile(item.id) : setActiveId(item.id))}
            >
              {item.label}
            </button>
            <div
              role="menu"
              className={`mega__panel${activeId === item.id ? ' is-open' : ''}`}
              aria-hidden={activeId !== item.id}
              onMouseEnter={() => handleEnter(item.id)}
              onMouseLeave={handleLeave}
            >
              <ul className="mega__grid">
                {sectionMap
                  .get(item.id)!
                  .items.map((entry) => (
                    <li key={entry.href} className="mega__cell">
                      <Link to={entry.href} className="mega__link" onFocus={() => handleEnter(item.id)}>
                        <span className="mega__label">{entry.label}</span>
                        {entry.description ? (
                          <span className="mega__desc">{entry.description}</span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
