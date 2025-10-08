import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { ColorMorphCard } from './ColorMorphCard'

export interface SlidingTrackItem {
  id: string
  eyebrow?: string
  title: string
  body: ReactNode
  href?: string
  ctaLabel?: string
}

interface SlidingTrackProps {
  items: SlidingTrackItem[]
  className?: string
  cardClassName?: string
  style?: CSSProperties
}

function isExternalLink(href: string): boolean {
  return /^https?:\/\//.test(href)
}

export function SlidingTrack({ items, className, cardClassName, style }: SlidingTrackProps) {
  return (
    <div className={cn('relative', className)} style={style}>
      <div className="sliding-track" role="list">
        {items.map((item) => {
          const ctaLabel = item.ctaLabel ?? 'Learn more'
          return (
            <ColorMorphCard key={item.id} as="article" progress={1} className={cn('sliding-track__card p-6', cardClassName)}>
              {item.eyebrow ? (
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">
                  {item.eyebrow}
                </span>
              ) : null}
              <h3 className="text-xl font-semibold text-telcoin-ink sm:text-2xl">{item.title}</h3>
              <div className="text-base text-telcoin-ink-muted sm:text-lg">{item.body}</div>
              {item.href ? (
                isExternalLink(item.href) ? (
                  <a className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent" href={item.href} target="_blank" rel="noreferrer noopener">
                    {ctaLabel}
                    <span aria-hidden>→</span>
                  </a>
                ) : (
                  <Link className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent" to={item.href}>
                    {ctaLabel}
                    <span aria-hidden>→</span>
                  </Link>
                )
              ) : null}
            </ColorMorphCard>
          )
        })}
      </div>
    </div>
  )
}

