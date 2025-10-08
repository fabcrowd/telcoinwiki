import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { ColorMorphCard } from './ColorMorphCard'

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
  progress: number
  prefersReducedMotion?: boolean
  className?: string
  cardClassName?: string
  style?: CSSProperties
}

function isExternalLink(href: string): boolean {
  return /^https?:\/\//.test(href)
}

function formatNumber(value: number): string {
  return Number.isFinite(value) ? value.toFixed(3) : '0'
}

export function SlidingStack({
  items,
  progress,
  prefersReducedMotion = false,
  className,
  cardClassName,
  style,
}: SlidingStackProps) {
  const hasMultiple = items.length > 1
  const steps = hasMultiple ? items.length - 1 : 1
  const normalized = prefersReducedMotion ? 0 : progress * steps
  const baseHeight = 360 + steps * 90

  return (
    <div
      className={cn('sliding-stack', prefersReducedMotion && 'sliding-stack--static', className)}
      data-sliding-stack=""
      style={{
        minHeight: `${baseHeight}px`,
        ...(style ?? {}),
      }}
    >
      {items.map((item, index) => {
        const relative = prefersReducedMotion ? index : index - normalized
        const translateY = prefersReducedMotion ? index * 36 : relative * 76
        const scale = prefersReducedMotion ? 1 : 1 - Math.min(Math.max(relative, 0), 3) * 0.05
        const opacityBase = prefersReducedMotion ? 1 : Math.min(Math.max(1 + Math.min(relative, 0), 0.18), 1)
        const cardProgress = prefersReducedMotion
          ? 1
          : Math.min(Math.max(1 - Math.max(relative, 0) * 0.32, 0.35), 1)

        const style = {
          '--stack-translate': `${formatNumber(translateY)}px`,
          '--stack-scale': formatNumber(scale),
          '--stack-opacity': formatNumber(opacityBase),
          zIndex: items.length - index,
        } as CSSProperties

        const ctaLabel = item.ctaLabel ?? 'Learn more'

        const content = (
          <ColorMorphCard
            key={item.id}
            progress={cardProgress}
            className={cn('sliding-stack__card p-6 sm:p-8', cardClassName)}
            style={style}
          >
            {item.eyebrow ? (
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">
                {item.eyebrow}
              </span>
            ) : null}
            <h3 className="text-xl font-semibold text-telcoin-ink sm:text-2xl">{item.title}</h3>
            <div className="text-base text-telcoin-ink-muted sm:text-lg">{item.body}</div>
            {item.href ? (
              isExternalLink(item.href) ? (
                <a
                  className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
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

        return content
      })}
    </div>
  )
}
