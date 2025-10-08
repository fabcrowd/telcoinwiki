import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { ColorMorphCard } from './ColorMorphCard'
import { useMediaQuery } from '../../hooks/useMediaQuery'

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
  const isCompact = useMediaQuery('(max-width: 62rem)')
  const isHandheld = useMediaQuery('(max-width: 40rem)')
  const normalized = prefersReducedMotion ? 0 : progress * steps
  const translateUnit = prefersReducedMotion ? 36 : isHandheld ? 56 : isCompact ? 68 : 76
  const scaleIncrement = prefersReducedMotion ? 0 : isHandheld ? 0.045 : isCompact ? 0.05 : 0.055
  const opacityFloor = prefersReducedMotion ? 1 : isHandheld ? 0.28 : isCompact ? 0.22 : 0.18
  const progressDampener = prefersReducedMotion ? 0 : isHandheld ? 0.26 : 0.32
  const progressFloor = prefersReducedMotion ? 1 : isHandheld ? 0.42 : 0.35
  const minHeight = prefersReducedMotion || isCompact ? undefined : 360 + steps * 96
  const staticLayout = prefersReducedMotion || isHandheld
  const activeIndex = prefersReducedMotion ? 0 : Math.round(normalized)

  const containerStyle: CSSProperties = {
    ...(minHeight ? { minHeight: `${minHeight}px` } : {}),
    ...(style ?? {}),
  }

  return (
    <div
      className={cn('sliding-stack', staticLayout && 'sliding-stack--static', className)}
      data-sliding-stack=""
      style={containerStyle}
    >
      <div className="sr-only" aria-live="polite">
        {`Section card: ${items[Math.min(Math.max(activeIndex, 0), items.length - 1)]?.title ?? ''}`}
      </div>
      {items.map((item, index) => {
        const relative = prefersReducedMotion ? index : index - normalized
        const translateY = relative * translateUnit
        const scale = prefersReducedMotion ? 1 : 1 - Math.min(Math.max(relative, 0), 3) * scaleIncrement
        const opacityBase = prefersReducedMotion ? 1 : Math.min(Math.max(1 + Math.min(relative, 0), opacityFloor), 1)
        const cardProgress = prefersReducedMotion
          ? 1
          : Math.min(Math.max(1 - Math.max(relative, 0) * progressDampener, progressFloor), 1)

        const morphTranslate = prefersReducedMotion ? 0 : (1 - cardProgress) * 24
        const morphScale = prefersReducedMotion ? 1 : 0.96 + cardProgress * 0.04
        const morphOpacity = prefersReducedMotion ? 1 : 0.82 + cardProgress * 0.18

        const finalTranslate = translateY + morphTranslate
        const finalScale = scale * morphScale
        const finalOpacity = opacityBase * morphOpacity

        const style = {
          '--stack-content-translate': `${formatNumber((1 - cardProgress) * 12)}px`,
          '--stack-content-opacity': formatNumber(0.75 + cardProgress * 0.25),
          zIndex: items.length - index,
        } as CSSProperties

        if (!staticLayout) {
          style.transform = `translateY(${formatNumber(finalTranslate)}px) scale(${formatNumber(finalScale)})`
          style.opacity = formatNumber(finalOpacity)
        }

        const ctaLabel = item.ctaLabel ?? 'Learn more'

        return (
          <div key={item.id} className="sliding-stack__card" style={style}>
            <ColorMorphCard progress={cardProgress} className={cn('p-6 sm:p-8', cardClassName)}>
              {item.eyebrow ? (
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">
                  {item.eyebrow}
                </span>
              ) : null}
              <div className="sliding-stack__content">
                <h3 className="text-xl font-semibold text-telcoin-ink sm:text-2xl">{item.title}</h3>
                <div className="text-base text-telcoin-ink-muted sm:text-lg">{item.body}</div>
              </div>
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
          </div>
        )
      })}
    </div>
  )
}
