import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'

export interface HorizontalRailItem {
  id: string
  eyebrow?: string
  title: string
  body: ReactNode
  href?: string
  ctaLabel?: string
  /** Optional accent hue (0..360) to tint the slide background. */
  accentHue?: number
}

interface HorizontalRailProps {
  id?: string
  items: HorizontalRailItem[]
  className?: string
  /** 0..1 multiplier retained for API compatibility; no-op without GSAP pinning. */
  parallaxStrength?: number
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const isExternalLink = (href: string) => /^https?:\/\//i.test(href)

const getAccentStyle = (hue?: number): CSSProperties | undefined => {
  if (typeof hue !== 'number' || Number.isNaN(hue)) {
    return undefined
  }
  const normalized = clamp(hue, 0, 360)
  return {
    '--tc-stage-hue': normalized,
    '--tc-stage-accent-hue': (normalized + 24) % 360,
  } as CSSProperties
}

export function HorizontalRail({ id, items, className, parallaxStrength }: HorizontalRailProps) {
  void parallaxStrength
  const renderCardContent = (item: HorizontalRailItem) => {
    const headingBlock = (
      <>
        {item.eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">
            {item.eyebrow}
          </span>
        ) : null}
        <h3 className="text-2xl font-semibold text-telcoin-ink sm:text-3xl">{item.title}</h3>
        <div className="text-base text-telcoin-ink-muted sm:text-lg">{item.body}</div>
      </>
    )

    if (!item.href) {
      return headingBlock
    }

    const ctaLabel = item.ctaLabel ?? 'Learn more'
    const linkChildren = (
      <>
        {ctaLabel}
        <span aria-hidden>→</span>
      </>
    )

    return (
      <>
        {headingBlock}
        {isExternalLink(item.href) ? (
          <a
            className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent"
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            {linkChildren}
          </a>
        ) : (
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent" to={item.href}>
            {linkChildren}
          </Link>
        )}
      </>
    )
  }

  return (
    <section id={id} className={cn('horizontal-rail horizontal-rail--fallback', className)}>
      <div className="horizontal-rail__viewport sliding-track">
        {items.map((item) => (
          <article
            key={item.id}
            className="sliding-track__card color-morph-card p-5 sm:p-6"
            style={getAccentStyle(item.accentHue)}
          >
            {renderCardContent(item)}
          </article>
        ))}
      </div>
    </section>
  )
}
