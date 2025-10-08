import type { CSSProperties, ReactNode } from 'react'
import { useMemo } from 'react'

import { cn } from '../../utils/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export interface MarqueeItem {
  id: string
  label: string
  href?: string
  render?: ReactNode // optional custom logo node
}

interface LogoMarqueeProps {
  items: MarqueeItem[]
  speedSec?: number
  reverse?: boolean
  className?: string
}

export function LogoMarquee({ items, speedSec = 32, reverse = false, className }: LogoMarqueeProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const list = useMemo(() => (items.length < 6 ? [...items, ...items, ...items] : [...items, ...items]), [items])

  const style = {
    '--marquee-duration': `${speedSec}s`,
  } as CSSProperties

  return (
    <div className={cn('logo-marquee', className)}>
      <div
        className={cn('logo-marquee__track', reverse && 'logo-marquee__track--reverse', prefersReducedMotion && 'logo-marquee--static')}
        style={style}
        aria-hidden
      >
        {list.map((item) => (
          <a
            key={item.id + '-a'}
            className="logo-tile"
            href={item.href ?? '#'}
            target={item.href ? '_blank' : undefined}
            rel={item.href ? 'noreferrer noopener' : undefined}
            title={item.label}
          >
            <span className="sr-only">{item.label}</span>
            {item.render ?? <DefaultGlyph label={item.label} />}
          </a>
        ))}
      </div>
    </div>
  )
}

function DefaultGlyph({ label }: { label: string }) {
  return (
    <span className="logo-glyph" aria-hidden>
      <svg width="96" height="48" viewBox="0 0 96 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="94" height="46" rx="10" fill="url(#g)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="24" cy="24" r="8" fill="rgba(255,255,255,0.65)" />
        <rect x="40" y="18" width="38" height="12" rx="6" fill="rgba(255,255,255,0.35)" />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="96" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(255,255,255,0.06)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="logo-glyph__label">{label}</span>
    </span>
  )
}

