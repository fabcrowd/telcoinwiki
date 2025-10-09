import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useScrollTimeline, type ScrollTimelineTarget } from '../../hooks/useScrollTimeline'
import { gsap } from 'gsap'

export interface HorizontalRailItem {
  id: string
  eyebrow?: string
  title: string
  body: ReactNode
  href?: string
  ctaLabel?: string
  /** Optional accent hue (0..360) to tint the slide */
  accentHue?: number
}

interface HorizontalRailProps {
  id?: string
  items: HorizontalRailItem[]
  className?: string
  parallaxStrength?: number // 0..1, default 0.25
}

export function HorizontalRail({ id, items, className, parallaxStrength = 0.25 }: HorizontalRailProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)
  const countRef = useRef<HTMLDivElement | null>(null)
  const statusRef = useRef<HTMLDivElement | null>(null)
  const lastIndexRef = useRef(-1)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isHandheld = useMediaQuery('(max-width: 48rem)')
  const saveData = typeof navigator !== 'undefined' && (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData

  const shouldPin = !prefersReducedMotion && !isHandheld && !saveData
  const slides = items.length
  const totalPercent = -(slides - 1) * 100

  const timelineTarget = shouldPin ? (containerRef as ScrollTimelineTarget) : null

  useScrollTimeline({
    target: timelineTarget,
    timeline: { defaults: { ease: 'none' } },
    create: (timeline) => {
      if (!trackRef.current) {
        return
      }

      timeline.fromTo(trackRef.current, { xPercent: 0 }, { xPercent: totalPercent }, 0)

      if (bgRef.current) {
        const parallax = Math.max(0, Math.min(parallaxStrength, 1)) * (saveData ? 0.1 : 1)
        timeline.fromTo(bgRef.current, { xPercent: 0 }, { xPercent: totalPercent * parallax }, 0)
      }

      if (progressRef.current) {
        gsap.set(progressRef.current, { transformOrigin: 'left center' })
        timeline.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1 }, 0)
      }

      timeline.eventCallback('onUpdate', () => {
        const progress = timeline.progress()
        const rawIndex = Math.round(progress * (items.length - 1))
        const clampedIndex = Math.max(0, Math.min(items.length - 1, rawIndex))
        const humanIndex = clampedIndex + 1

        if (countRef.current) {
          countRef.current.textContent = `${humanIndex} of ${items.length}`
        }

        if (statusRef.current && clampedIndex !== lastIndexRef.current) {
          lastIndexRef.current = clampedIndex
          const slide = items[clampedIndex]
          statusRef.current.textContent = `Slide ${humanIndex} of ${items.length}: ${slide?.title ?? ''}`
        }
      })

    },
    scrollTrigger: shouldPin
      ? {
          start: 'top top',
          end: `+=${Math.max(200, slides * 100)}%`,
          pin: true,
          scrub: 1,
        }
      : undefined,
  })

  useEffect(() => {
    if (!countRef.current) return
    countRef.current.textContent = `1 of ${items.length || 1}`
    if (statusRef.current) {
      statusRef.current.textContent = items.length
        ? `Slide 1 of ${items.length}: ${items[0]?.title ?? ''}`
        : ''
    }
  }, [items])

  useEffect(() => {
    const root = document.documentElement
    if (!shouldPin) return
    const el = containerRef.current
    if (!el) return
    const onEnter = () => root.setAttribute('data-horizontal-stage', '')
    const onLeave = () => root.removeAttribute('data-horizontal-stage')

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onEnter()
          else onLeave()
        })
      },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      onLeave()
    }
  }, [shouldPin])

  const renderSlide = (
    item: HorizontalRailItem,
    className: string,
  ) => {
    const hue = typeof item.accentHue === 'number' ? Math.max(0, Math.min(360, item.accentHue)) : null
    const style: (CSSProperties & Record<string, number | string>) | undefined = hue
      ? {
          ['--tc-stage-hue']: hue,
          ['--tc-stage-accent-hue']: (hue + 24) % 360,
        }
      : undefined

    const ctaLabel = item.ctaLabel ?? 'Learn more'

    return (
      <article key={item.id} className={className} style={style}>
        {item.eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">
            {item.eyebrow}
          </span>
        ) : null}
        <h3 className="text-2xl font-semibold text-telcoin-ink sm:text-3xl">{item.title}</h3>
        <div className="text-base text-telcoin-ink-muted sm:text-lg">{item.body}</div>
        {item.href ? (
          item.href.startsWith('http') ? (
            <a className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent" href={item.href} target="_blank" rel="noreferrer">
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
      </article>
    )
  }

  const content = (
    <div ref={trackRef} className="horizontal-rail__track">
      {items.map((item) => renderSlide(item, 'horizontal-rail__slide color-morph-card p-6'))}
    </div>
  )

  if (!shouldPin) {
    return (
      <section id={id} className={cn('horizontal-rail horizontal-rail--fallback', className)}>
        <div className="horizontal-rail__viewport sliding-track">
          {items.map((item) => renderSlide(item, 'sliding-track__card color-morph-card p-6'))}
        </div>
      </section>
    )
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()

    const maxIndex = Math.max(0, items.length - 1)
    let currentIndex = 0
    if (countRef.current?.textContent) {
      const match = /(\d+) of (\d+)/.exec(countRef.current.textContent)
      if (match) {
        currentIndex = Math.max(0, Math.min(maxIndex, parseInt(match[1], 10) - 1))
      }
    }

    const delta = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = Math.max(0, Math.min(maxIndex, currentIndex + delta))
    const targetProgress = maxIndex === 0 ? 0 : nextIndex / maxIndex

    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: targetProgress,
        duration: 0.6,
        ease: 'power3.out',
        onUpdate: () => {
          const human = Math.round(targetProgress * maxIndex) + 1
          if (countRef.current) countRef.current.textContent = `${human} of ${items.length}`
          if (statusRef.current) {
            statusRef.current.textContent = `Slide ${human} of ${items.length}: ${items[human - 1]?.title ?? ''}`
          }
          const total = -(items.length - 1) * 100
          if (trackRef.current) {
            trackRef.current.style.transform = `translateX(${(total * targetProgress).toFixed(2)}%)`
          }
          if (bgRef.current) {
            const parallax = Math.max(0, Math.min(parallaxStrength, 1)) * (saveData ? 0.1 : 1)
            bgRef.current.style.transform = `translateX(${(total * parallax * targetProgress).toFixed(2)}%)`
          }
        },
      })
    }
  }

  return (
    <section
      id={id}
      ref={containerRef}
      className={cn('horizontal-rail', className)}
      aria-label="Horizontal storyline"
      role="group"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div ref={bgRef} className="horizontal-rail__bg" aria-hidden />
      <div className="horizontal-rail__frame" aria-hidden>
        <div className="horizontal-rail__vignette horizontal-rail__vignette--left" />
        <div className="horizontal-rail__vignette horizontal-rail__vignette--right" />
        <div className="horizontal-rail__progress-wrap">
          <div ref={progressRef} className="horizontal-rail__progress" role="progressbar" aria-label="Story progress" />
          <div ref={countRef} className="horizontal-rail__count" aria-hidden />
          <div ref={statusRef} className="sr-only" aria-live="polite" />
        </div>
      </div>
      <div className="horizontal-rail__viewport">{content}</div>
      <div className="sr-only" aria-live="polite">
        Horizontal section active
      </div>
    </section>
  )
}
