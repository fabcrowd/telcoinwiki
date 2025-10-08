import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '../../utils/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { loadCinematicConfig } from '../../lib/cinematicConfig'

export interface MarqueeItem {
  id: string
  label: string
  href?: string
  render?: ReactNode // optional custom logo node
  logoSrc?: string
  alt?: string
}

interface LogoMarqueeProps {
  items?: MarqueeItem[]
  speedSec?: number
  reverse?: boolean
  pauseOnHover?: boolean
  className?: string
}

export function LogoMarquee({ items: propItems, speedSec, reverse, pauseOnHover, className }: LogoMarqueeProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [hovering, setHovering] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [items, setItems] = useState<MarqueeItem[]>(propItems ?? [])
  const [cfg, setCfg] = useState<{ speedSec: number; reverse: boolean; pauseOnHover: boolean }>(
    {
      speedSec: speedSec ?? 32,
      reverse: reverse ?? false,
      pauseOnHover: pauseOnHover ?? true,
    },
  )

  useEffect(() => {
    if (propItems) return
    let m = true
    ;(async () => {
      const conf = await loadCinematicConfig()
      if (!m) return
      setItems(conf.marquee.items as unknown as MarqueeItem[])
      setCfg({
        speedSec: speedSec ?? conf.marquee.speedSec ?? 32,
        reverse: reverse ?? conf.marquee.reverse ?? false,
        pauseOnHover: pauseOnHover ?? conf.marquee.pauseOnHover ?? true,
      })
    })()
    return () => { m = false }
  }, [propItems, speedSec, reverse, pauseOnHover])

  const list = useMemo(() => (items.length < 6 ? [...items, ...items, ...items] : [...items, ...items]), [items])

  const style = {
    '--marquee-duration': `${cfg.speedSec}s`,
  } as CSSProperties

  const paused = prefersReducedMotion || userPaused || (cfg.pauseOnHover && hovering)

  useEffect(() => {
    if (!trackRef.current) return
    trackRef.current.style.animationPlayState = paused ? 'paused' : 'running'
  }, [paused])

  return (
    <div
      className={cn('logo-marquee', className)}
      onMouseEnter={() => cfg.pauseOnHover && setHovering(true)}
      onMouseLeave={() => cfg.pauseOnHover && setHovering(false)}
      role="region"
      aria-label="Trusted ecosystem logos"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault()
          setUserPaused((p) => !p)
        }
      }}
    >
      <div
        ref={trackRef}
        className={cn('logo-marquee__track', (reverse ?? cfg.reverse) && 'logo-marquee__track--reverse', prefersReducedMotion && 'logo-marquee--static')}
        style={style}
        aria-hidden
        onMouseMove={(e) => {
          // move hover glow
          const target = e.target as HTMLElement
          if (target && target.classList.contains('logo-tile')) {
            const rect = target.getBoundingClientRect()
            const mx = ((e.clientX - rect.left) / rect.width) * 100
            target.style.setProperty('--mx', `${mx}%`)
          }
        }}
      >
        {list.map((item) => (
          <a
            key={`${item.id}-${item.label}`}
            className="logo-tile"
            href={item.href ?? '#'}
            target={item.href ? '_blank' : undefined}
            rel={item.href ? 'noreferrer noopener' : undefined}
            aria-label={item.alt ?? item.label}
          >
            <span className="sr-only">{item.label}</span>
            {item.render
              ? item.render
              : item.logoSrc
                ? <img src={item.logoSrc} height={24} width={24} className="opacity-90" alt={item.alt ?? item.label} />
                : <DefaultGlyph label={item.label} />}
          </a>
        ))}
      </div>
      <div className="sr-only" aria-live="polite">{paused ? 'Logos paused' : 'Logos animating'}</div>
      {!prefersReducedMotion ? (
        <div className="mt-2 flex items-center justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-telcoin-ink/10 bg-telcoin-surface/70 px-3 py-1 text-xs font-semibold text-telcoin-ink"
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
          >
            {userPaused ? 'Play' : 'Pause'} marquee
          </button>
          {cfg.pauseOnHover ? (
            <span className="ml-3 text-[11px] text-telcoin-ink-subtle" aria-hidden>
              Hint: hover to pause • press space to toggle
            </span>
          ) : null}
        </div>
      ) : null}
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
