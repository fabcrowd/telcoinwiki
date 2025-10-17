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

const baseStackStyle = {
  '--stack-gutter': 'clamp(6px, 0.6vw, 12px)',
  '--stack-top': 'calc(var(--header-height) + 2vh)',
  '--stack-bottom': '0vh',
  '--stack-translate-start': 'calc(100vh - var(--stack-top) - var(--stack-bottom))',
  '--stack-tail': '320vh',
  '--last-card-translate-end': '12vh',
  '--stack-step': '0px',
} satisfies CSSProperties

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
          <h3 className="sliding-stack__title -mt-4 sm:-mt-4 lg:-mt-5 mb-3 sm:mb-4 lg:mb-6 text-5xl leading-tight font-semibold text-telcoin-ink sm:text-6xl lg:text-[4.8rem]">{item.title}</h3>
          <div className="text-xl text-telcoin-ink-muted sm:text-[1.35rem] lg:text-2xl leading-relaxed">{item.body}</div>
        </div>
        {cta}
      </>
    )
  }

  const cssVars = useMemo(() => {
    // The first card is static (pinned immediately), so exclude it from the
    // timeline height to avoid a blank scroll segment.
    const animatedCount = Math.max((items.length || 1) - 1, 1)
    const vars: CSSProperties & Record<'--stack-count' | '--stack-duration', string> = {
      '--stack-count': String(animatedCount),
      // Per-card travel: 64vh to run 25% faster (80vh × 0.8)
      '--stack-duration': '64vh',
    }
    return vars
  }, [items.length])

  const activeIndex = useMemo(() => {
    if (items.length <= 1) return 0
    if (progress >= 1) return items.length - 1
    return Math.min(items.length - 1, Math.floor(progress * items.length))
  }, [items.length, progress])

  const cardCount = Math.max(items.length, 1)
  // Exclude the first (static) card from the timeline windows.
  const animatedCount = Math.max(cardCount - 1, 1)
  const windowSize = 100 / animatedCount
  // No overlap: next card begins exactly when the previous finishes
  const overlap = 0
  // No end hold for first three cards
  const firstEndPadPct = 0
  const secondEndPadPct = 0
  const thirdEndPadPct = 0
  // Finish the last card a bit earlier so it pins before the section unpins
  const lastEndPadPct = 10
  // Per-card start delays after the previous ends
  const secondStartDelayPct = 5
  const thirdStartDelayPct = 0
  const fourthStartDelayPct = 0
  const secondStartAdvancePct = 0
  // Start card 3 and 4 earlier so they don't feel late
  const thirdStartAdvancePct = 10
  const lastStartAdvancePct = 15

  const cards = items.map((item, index) => {
    const ctaLabel = item.ctaLabel ?? 'Learn more'
    // Ensure later cards can layer above earlier ones so headers aren't hidden.
    const zIndex = index + 1
    const startBase = index === 0 ? 0 : (index - 1) * windowSize
    const start = Math.max(
      0,
      startBase - (
        index === 1
          ? secondStartAdvancePct
          : index === 2
            ? thirdStartAdvancePct
            : index === cardCount - 1
              ? lastStartAdvancePct
              : 0
      ) + (
        index === 1
          ? secondStartDelayPct
          : index === 2
            ? thirdStartDelayPct
            : index === cardCount - 1
              ? fourthStartDelayPct
              : 0
      ),
    )
    const endPad =
      index === 0
        ? firstEndPadPct
        : index === cardCount - 1
          ? lastEndPadPct
          : index === 1
            ? secondEndPadPct
            : index === 2
              ? thirdEndPadPct
              : overlap

    // For the first card, give it a zero-length range;
    // for others, allocate windows across the full 0..100%.
    const end = index === 0
      ? 0
      : Math.min(100, index * windowSize - endPad)
    const range = Math.max(end - start, 0)
    const speedMultiplier = index === 1
      ? 0.85 // card 2 → 15% faster
      : index === 2 || index === 3
        ? 0.75 // cards 3 & 4 → 25% faster
        : 1
    const adjustedEnd = range > 0 && speedMultiplier < 1
      ? Math.min(100, start + range * speedMultiplier)
      : end
    const timingVars: CSSProperties & Record<'--stack-start' | '--stack-end', string> = {
      '--stack-start': `${start}%`,
      '--stack-end': `${adjustedEnd}%`,
    }

    return (
      <ColorMorphCard
        key={item.id}
        id={item.id}
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
        ...baseStackStyle,
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
