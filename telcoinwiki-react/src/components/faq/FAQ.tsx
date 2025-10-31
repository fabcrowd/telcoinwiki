import { useEffect, useMemo, useState, useRef } from 'react'

export interface FAQItemData {
  id?: string
  question: string
  answer: React.ReactNode
}

export interface FAQGroup {
  title: string
  items: FAQItemData[]
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

interface AccordionItemProps {
  item: FAQItemData
  open: boolean
  onToggle: () => void
}

function AccordionItem({ item, open, onToggle }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const id = useMemo(() => item.id ?? slugify(item.question), [item.id, item.question])
  const panelId = `${id}-panel`
  const buttonId = `${id}-button`

  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (!contentRef.current) return
    setHeight(open ? contentRef.current.scrollHeight : 0)
  }, [open, item.answer])

  return (
    <article id={`faq-${id}`} className="tc-card-glass overflow-hidden">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-controls={panelId}
          aria-expanded={open}
          onClick={onToggle}
          className="glass-header w-full text-left px-6 py-4 sm:px-8 flex items-center justify-between"
        >
          <span className="font-semibold text-telcoin-ink">{item.question}</span>
          <svg
            className={`ml-4 transition-transform ${open ? 'rotate-180' : ''}`}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="px-6 sm:px-8 text-telcoin-ink-muted"
        style={{
          overflow: 'hidden',
          maxHeight: height,
          transition: 'max-height 260ms ease',
        }}
        ref={contentRef}
      >
        <div className="pb-6 pt-3 leading-relaxed">{item.answer}</div>
      </div>
    </article>
  )
}

interface FAQSectionProps {
  title?: string
  items?: FAQItemData[]
  groups?: FAQGroup[]
  singleOpen?: boolean
  trackHash?: boolean
}

export function FAQSection({ title = 'Frequently Asked Questions', items, groups, singleOpen = false, trackHash = true }: FAQSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null)

  const normalizedGroups: FAQGroup[] = useMemo(() => {
    if (groups && groups.length) return groups
    return [{ title, items: items ?? [] }]
  }, [groups, items, title])

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})
  const [groupOpenMap, setGroupOpenMap] = useState<Record<string, boolean>>({})

  // Parse open state from hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    const next: Record<string, boolean> = {}
    const nextGroup: Record<string, boolean> = {}
    if (hash === 'faq') {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (hash.startsWith('faq-open=')) {
      const ids = hash.slice('faq-open='.length).split(',').filter(Boolean)
      ids.forEach((id) => (next[id] = true))
      // open the groups containing these items
      ids.forEach((id) => {
        normalizedGroups.forEach((g) => {
          if (g.items.some((it) => (it.id ?? slugify(it.question)) === id)) {
            const gid = slugify(g.title)
            nextGroup[gid] = true
          }
        })
      })
      setOpenMap(next)
      setGroupOpenMap(nextGroup)
      if (ids[0]) document.getElementById(`faq-${ids[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (hash.startsWith('faq-')) {
      const id = hash.replace(/^faq-/, '')
      next[id] = true
      // open the group containing this item
      normalizedGroups.forEach((g) => {
        if (g.items.some((it) => (it.id ?? slugify(it.question)) === id)) {
          nextGroup[slugify(g.title)] = true
        }
      })
      setOpenMap(next)
      setGroupOpenMap(nextGroup)
      document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [normalizedGroups])

  // Sync hash when openMap changes
  useEffect(() => {
    if (!trackHash) return
    const openIds = Object.entries(openMap).filter(([, v]) => v).map(([k]) => k)
    if (openIds.length) {
      window.history.replaceState(null, '', `#faq-open=${openIds.join(',')}`)
    } else {
      window.history.replaceState(null, '', '#faq')
    }
  }, [openMap, trackHash])

  const onToggleId = (id: string) => () => {
    setOpenMap((cur) => {
      const next = { ...cur }
      const willOpen = !next[id]
      if (singleOpen) {
        Object.keys(next).forEach((k) => (next[k] = false))
      }
      next[id] = willOpen
      return next
    })
  }

  const onToggleGroup = (gid: string) => () => {
    setGroupOpenMap((cur) => ({ ...cur, [gid]: !cur[gid] }))
  }

  return (
    <section
      id="home-faq"
      ref={containerRef}
      className="anchor-offset"
      style={{ marginTop: 'calc(100vh - var(--header-height) + 2rem)' }}
    >
      <div className="mx-auto w-full max-w-[min(1440px,90vw)] px-4 sm:px-8 lg:px-12 xl:px-16 mt-8 sm:mt-10 lg:mt-12">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-telcoin-ink">{title}</h2>
          <p className="text-telcoin-ink-muted">Answers for newcomers and power users alike.</p>
        </div>
        {normalizedGroups.map((group) => {
          const gid = slugify(group.title)
          const gOpen = !!groupOpenMap[gid]
          // compute panel height for simple animation
          return (
            <article key={group.title} className="tc-card-glass overflow-hidden mb-6">
              <h3 className="m-0">
                <button
                  type="button"
                  className="glass-header w-full text-left px-6 py-4 sm:px-8 flex items-center justify-between"
                  aria-expanded={gOpen}
                  aria-controls={`faq-group-${gid}`}
                  onClick={onToggleGroup(gid)}
                >
                  <span className="font-semibold text-telcoin-ink text-lg">{group.title}</span>
                  <svg className={`ml-4 transition-transform ${gOpen ? 'rotate-180' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </h3>
              <div
                id={`faq-group-${gid}`}
                role="region"
                aria-label={`${group.title} FAQs`}
                style={{ overflow: 'hidden', maxHeight: gOpen ? undefined : 0, transition: 'max-height 260ms ease' }}
                className="px-2 sm:px-3"
              >
                <div className="grid gap-4 sm:gap-5 px-2 sm:px-3 pb-4 pt-2">
                  {group.items.map((item) => {
                    const id = item.id ?? slugify(item.question)
                    const isOpen = !!openMap[id]
                    return (
                      <AccordionItem key={id} item={item} open={isOpen} onToggle={onToggleId(id)} />
                    )
                  })}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
