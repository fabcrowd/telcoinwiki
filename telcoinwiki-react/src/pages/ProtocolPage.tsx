import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PROTOCOL_SECTIONS } from '../components/protocol/sections'
import type { ProtocolSection } from '../components/protocol/sections'

interface PanelProps {
  section: ProtocolSection
  open: boolean
  onToggle: () => void
}

function Panel({ section, open, onToggle }: PanelProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!bodyRef.current) return
    setHeight(open ? bodyRef.current.scrollHeight : 0)
  }, [open, section.content])

  // Tables and long lists can reflow after fonts settle; keep the panel sized to
  // its content while it is open rather than trusting one measurement.
  useEffect(() => {
    if (!open || !bodyRef.current || typeof ResizeObserver === 'undefined') return
    const el = bodyRef.current
    const ro = new ResizeObserver(() => setHeight(el.scrollHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [open])

  return (
    <section id={section.id} className="deep-dive-section anchor-offset">
      <h2 className="deep-dive-section-header">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${section.id}-panel`}
          onClick={onToggle}
          className="deep-dive-section-button"
        >
          <span>{section.title}</span>
          <svg
            className={`deep-dive-section-icon ${open ? 'open' : ''}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h2>
      <div
        id={`${section.id}-panel`}
        role="region"
        aria-labelledby={section.id}
        className="deep-dive-content-wrapper"
        style={{ overflow: 'hidden', maxHeight: open ? height : 0, transition: 'max-height 300ms ease' }}
        ref={bodyRef}
      >
        <div className="deep-dive-content proto-content">{section.content}</div>
      </div>
    </section>
  )
}

const IDS = PROTOCOL_SECTIONS.map((s) => s.id)

export function ProtocolPage() {
  const location = useLocation()
  const [open, setOpen] = useState<Set<string>>(() => new Set([PROTOCOL_SECTIONS[0].id]))

  const toggle = useCallback((id: string) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  /**
   * Deep links land on a collapsed accordion otherwise: opening the targeted
   * section (and scrolling to it) is what makes an anchor into this page useful
   * from search results and from the rest of the wiki.
   */
  useEffect(() => {
    const id = location.hash.replace(/^#/, '')
    if (!id || !IDS.includes(id)) return
    setOpen((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
    const node = document.getElementById(id)
    if (!node) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    })
  }, [location.hash])

  const expandAll = () => setOpen(new Set(IDS))
  const collapseAll = () => setOpen(new Set())
  const allOpen = open.size === IDS.length

  return (
    <>
      <section id="protocol-hero" aria-labelledby="protocol-hero-heading" className="anchor-offset">
        <div className="mx-auto w-full max-w-[min(1600px,95vw)] px-4 sm:px-8 lg:px-12 xl:px-16 pt-[calc(var(--header-height)+4rem)] pb-8 sm:pb-10 lg:pb-12">
          <div className="tc-card-glass p-10 sm:p-12 lg:p-16 text-center">
            <div className="flex flex-col items-center gap-4 mb-6 sm:mb-8 pt-4 sm:pt-6 lg:pt-8">
              <p className="proto-eyebrow">Protocol reference</p>
              <h1
                id="protocol-hero-heading"
                className="font-semibold text-telcoin-ink text-4xl sm:text-5xl lg:text-6xl"
              >
                Telcoin Network
              </h1>
              <p className="w-full max-w-4xl text-telcoin-ink-muted mt-2 mx-auto text-center text-base sm:text-lg">
                A working reference for the chain itself — how it is built, how consensus reaches
                finality, what it costs, and what it takes to run a validator. Compiled from Telcoin&rsquo;s
                own published documentation, with an index of every source at the end.
              </p>
            </div>

            <nav className="toc-chips flex flex-wrap justify-center gap-2" aria-label="Protocol reference sections">
              {PROTOCOL_SECTIONS.map((s) => (
                <a className="toc-chip" key={s.id} href={`#${s.id}`}>
                  {s.chip}
                </a>
              ))}
            </nav>

            <div className="atlas-callout">
              <p>Prefer to see it move? Consensus and the ecosystem, as a live 3D model.</p>
              <Link to="/atlas">Open the Network Atlas →</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[min(1600px,95vw)] px-4 sm:px-8 lg:px-12 xl:px-16 flex justify-end">
        <button type="button" className="proto-toggle-all" onClick={allOpen ? collapseAll : expandAll}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="deep-dive-grid">
        {PROTOCOL_SECTIONS.map((section) => (
          <Panel
            key={section.id}
            section={section}
            open={open.has(section.id)}
            onToggle={() => toggle(section.id)}
          />
        ))}
      </div>
    </>
  )
}
