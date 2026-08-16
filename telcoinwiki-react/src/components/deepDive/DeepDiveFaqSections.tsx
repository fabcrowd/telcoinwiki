import { useState, useRef, useEffect } from 'react'
import type { DeepDiveSection } from './sections'
import { SECTIONS } from './sections'

interface ExpandableSectionProps {
  section: DeepDiveSection
  open: boolean
  onToggle: () => void
}

function ExpandableSection({ section, open, onToggle }: ExpandableSectionProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (!contentRef.current) return
    setHeight(open ? contentRef.current.scrollHeight : 0)
  }, [open, section.content])

  return (
    <section id={section.id} className="deep-dive-section anchor-offset">
      <h2 className="deep-dive-section-header">
        <button
          type="button"
          aria-expanded={open}
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
        className="deep-dive-content-wrapper"
        style={{
          overflow: 'hidden',
          maxHeight: height,
          transition: 'max-height 300ms ease',
        }}
        ref={contentRef}
      >
        <div className="deep-dive-content">
          {section.content}
        </div>
      </div>
    </section>
  )
}

export function DeepDiveFaqSections() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="deep-dive-grid">
      {SECTIONS.map((section) => (
        <ExpandableSection
          key={section.id}
          section={section}
          open={openSections.has(section.id)}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  )
}
