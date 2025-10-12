import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { ColorMorphCard } from './ColorMorphCard'
import { SCROLL_STORY_ENABLED } from '../../config/featureFlags'
import { useScrollProgress } from '../../hooks/useScrollProgress'

export interface SlidingStackItem {
  id: string
  eyebrow?: string
  title: string
  /** Optional short label for the folder tab. Falls back to title. */
  tabLabel?: string
  body: ReactNode
  href?: string
  ctaLabel?: string
}

interface SlidingStackProps {
  items: SlidingStackItem[]
  prefersReducedMotion?: boolean
  className?: string
  cardClassName?: string
  style?: CSSProperties
  onProgressChange?: (value: number) => void
}

const CTA_ARROW = '\\u2192'

const isExternalLink = (href: string) => /^https?:\/\//i.test(href)

export function SlidingStack({
  items,
  prefersReducedMotion = false,
  className,
  cardClassName,
  style,
  onProgressChange,
}: SlidingStackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const effectiveDisabled = prefersReducedMotion || !SCROLL_STORY_ENABLED
  const progress = useScrollProgress(containerRef, {
    disabled: effectiveDisabled,
    clamp: true,
  })

  useEffect(() => {
    if (!onProgressChange) return
    if (effectiveDisabled) {
      onProgressChange(1)
      return
    }
    onProgressChange(progress)
  }, [effectiveDisabled, onProgressChange, progress])

  const initialAnnouncement = items.length ? `Slide 1 of ${items.length}: ${items[0].title}` : ''

  const renderCardContent = (item: SlidingStackItem, ctaLabel = 'Learn more') => {
    let cta: ReactNode = null

    if (item.href) {
      const arrow = <span aria-hidden>{CTA_ARROW}</span>
      cta = isExternalLink(item.href) ? (
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent"
          href={item.href}
          target="_blank"
          rel="noreferrer"
        >
          {ctaLabel}
          {arrow}
        </a>
      ) : (
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent" to={item.href}>
          {ctaLabel}
          {arrow}
        </Link>
      )
    } else if (SCROLL_STORY_ENABLED) {
      // Show a non-navigating placeholder CTA while links are being finalized.
      cta = (
        <a
          className="inline-flex cursor-default items-center gap-2 text-sm font-semibold text-telcoin-accent/60"
          href="#"
          onClick={(e) => e.preventDefault()}
          aria-disabled
        >
          {ctaLabel}
          <span aria-hidden>{CTA_ARROW}</span>
        </a>
      )
    }

    return (
      <>
        {item.eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">
            {item.eyebrow}
          </span>
        ) : null}
        <div className="sliding-stack__content">
          <h3 className="mt-0 text-5xl leading-tight font-semibold text-telcoin-ink sm:text-6xl lg:text-[4.8rem]">{item.title}</h3>
          <div className="text-xl text-telcoin-ink-muted sm:text-[1.35rem] lg:text-2xl leading-relaxed">{item.body}</div>
        </div>
        {cta}
      </>
    )
  }

  const cssVars = useMemo(() => {
    const vars: CSSProperties & Record<'--stack-count' | '--stack-duration', string> = {
      '--stack-count': String(items.length || 1),
      // Increase per-card duration so panels hold longer before the next slides
      '--stack-duration': '200vh',
    }
    return vars
  }, [items.length])

  const activeIndex = useMemo(() => {
    if (items.length <= 1) return 0
    if (progress >= 1) return items.length - 1
    return Math.min(items.length - 1, Math.floor(progress * items.length))
  }, [items.length, progress])

  const cardCount = Math.max(items.length, 1)
  const windowSize = 100 / cardCount
  // No overlap: next card begins exactly when the previous finishes
  const overlap = 0
  const lastEndPadPct = 12 // +4% more completion buffer so last card holds longer
  const secondEndPadPct = 8 // move 2nd card faster by shortening its range by 8%
  const thirdEndPadPct = 5  // move 3rd card faster by shortening its range by 5%

  const cards = items.map((item, index) => {
    const ctaLabel = item.ctaLabel ?? 'Learn more'
    // Ensure the first card appears on top initially (higher zIndex).
    const zIndex = undefined
    const start = Math.max(0, index * windowSize)
    const endPad =
      index === cardCount - 1
        ? lastEndPadPct
        : index === 1
          ? secondEndPadPct
          : index === 2
            ? thirdEndPadPct
            : overlap

    const end = Math.min(100, (index + 1) * windowSize - endPad)
    const timingVars: CSSProperties & Record<'--stack-start' | '--stack-end', string> = {
      '--stack-start': `${start}%`,
      '--stack-end': `${end}%`,
    }

    return (
      <ColorMorphCard
        key={item.id}
        progress={1}
        className={cn('sliding-stack__card pt-0 pb-10 sm:pb-12 lg:pb-14', cardClassName)}
        style={{ zIndex, ...timingVars }}
      >
        <div className="sliding-stack__tab">
          <span className="sliding-stack__tab-text">{item.tabLabel ?? item.title}</span>
        </div>
        <div className="sliding-stack__body px-6 sm:px-8 lg:px-10">{renderCardContent(item, ctaLabel)}</div>
      </ColorMorphCard>
    )
  })

  return (
    <div
      ref={containerRef}
      className={cn('sliding-stack sliding-stack--static', className)}
      data-sliding-stack=""
      data-scroll-story={SCROLL_STORY_ENABLED && !prefersReducedMotion ? '' : undefined}
      data-prefers-reduced-motion={prefersReducedMotion ? '' : undefined}
      data-active-index={activeIndex}
      style={{
        // Reduce gutters so cards appear ~20% wider overall.
        ['--stack-gutter' as any]: 'clamp(6px, 0.6vw, 12px)',
        // Make cards ~50% taller by expanding the sticky viewport height.
        // Height = 100vh - top - bottom.
        ['--stack-top' as any]: 'calc(var(--header-height) + 2vh)',
        ['--stack-bottom' as any]: '2vh',
        // Extra tail so the final card reaches the top and holds briefly
        ['--stack-tail' as any]: '72vh',
        // Only one card visible at a time; remove vertical staggering
        ['--stack-step' as any]: '0px',
        ...cssVars,
        ...style,
      }}
    >
      <div className="sr-only" aria-live="polite">
        {initialAnnouncement}
      </div>
      <div className="sliding-stack__viewport">
        <div className="sliding-stack__deck">
          {cards}
        </div>
      </div>
    </div>
  )
}
