import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { ColorMorphCard } from './ColorMorphCard'
import { SCROLL_STORY_ENABLED } from '../../config/featureFlags'

export interface SlidingStackItem {
  id: string
  eyebrow?: string
  title: string
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
  useEffect(() => {
    onProgressChange?.(1)
  }, [onProgressChange, items.length])

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
          <h3 className="text-xl font-semibold text-telcoin-ink sm:text-2xl">{item.title}</h3>
          <div className="text-base text-telcoin-ink-muted sm:text-lg">{item.body}</div>
        </div>
        {cta}
      </>
    )
  }

  const cssVars = {} as CSSProperties & Record<'--stack-count' | '--stack-duration', string>
  // Card count and per-card duration for CSS sizing; CSS handles the rest.
  cssVars['--stack-count'] = String(items.length || 1)
  cssVars['--stack-duration'] = '110vh'

  return (
    <div
      className={cn('sliding-stack sliding-stack--static', className)}
      data-sliding-stack=""
      data-scroll-story={SCROLL_STORY_ENABLED && !prefersReducedMotion ? '' : undefined}
      data-prefers-reduced-motion={prefersReducedMotion ? '' : undefined}
      style={{ ...cssVars, ...style }}
    >
      <div className="sr-only" aria-live="polite">
        {initialAnnouncement}
      </div>
      <div className="sliding-stack__viewport">
        <div className="sliding-stack__deck">
          {items.map((item, index) => {
            const ctaLabel = item.ctaLabel ?? 'Learn more'
            // Ensure the first card appears on top initially (higher zIndex).
            const zIndex = (items.length - index) + 10
            return (
              <ColorMorphCard
                key={item.id}
                progress={1}
                className={cn('sliding-stack__card p-5 sm:p-6', cardClassName)}
                style={{ zIndex }}
              >
                <div className="sliding-stack__tab">
                  <span className="sliding-stack__tab-text">{item.title}</span>
                </div>
                {renderCardContent(item, ctaLabel)}
              </ColorMorphCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}
