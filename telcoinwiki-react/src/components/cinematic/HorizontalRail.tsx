import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useScrollTimeline } from '../../hooks/useScrollTimeline'
import { getStageHostElement } from '../../utils/stageHost'

export interface HorizontalRailItem {
  id: string
  eyebrow?: string
  title: string
  body: ReactNode
  href?: string
  ctaLabel?: string
  /**
   * Optional accent hue (0..360) to tint the slide background.
   */
  accentHue?: number
}

interface HorizontalRailProps {
  id?: string
  items: HorizontalRailItem[]
  className?: string
  /**
   * 0..1 multiplier controlling how quickly the background parallax tracks the foreground.
   * Defaults to 0.25.
   */
  parallaxStrength?: number
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const parseCount = (value: string | null, fallbackMaxIndex: number): number => {
  if (!value) {
    return 0
  }
  const match = /^(\d+)\D+(\d+)/.exec(value)
  if (!match) {
    return 0
  }
  const current = Number.parseInt(match[1], 10)
  const total = Number.parseInt(match[2], 10)
  if (!Number.isFinite(current) || !Number.isFinite(total) || total <= 0) {
    return 0
  }
  return clamp(current - 1, 0, fallbackMaxIndex)
}

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

export function HorizontalRail({ id, items, className, parallaxStrength = 0.25 }: HorizontalRailProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)
  const countRef = useRef<HTMLDivElement | null>(null)
  const statusRef = useRef<HTMLDivElement | null>(null)
  const lastIndexRef = useRef<number>(-1)

  const prefersReducedMotion = usePrefersReducedMotion()
  const isHandheld = useMediaQuery('(max-width: 48rem)')
  const saveData =
    typeof navigator !== 'undefined' &&
    (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData

  const shouldPin = !prefersReducedMotion && !isHandheld && !saveData
  const totalSlides = Math.max(1, items.length)
  const totalPercent = -(totalSlides - 1) * 100
  const parallaxMultiplier = clamp(parallaxStrength, 0, 1) * (saveData ? 0.1 : 1)

  const timelineRef = useScrollTimeline({
    target: shouldPin ? containerRef : null,
    create: (timeline) => {
      if (!trackRef.current) {
        return
      }

      timeline.fromTo(trackRef.current, { xPercent: 0 }, { xPercent: totalPercent }, 0)

      if (bgRef.current) {
        timeline.fromTo(
          bgRef.current,
          { xPercent: 0 },
          { xPercent: totalPercent * parallaxMultiplier },
          0,
        )
      }

      if (progressRef.current) {
        // Avoid static gsap import; set via DOM and animate on the timeline
        progressRef.current.style.transformOrigin = 'left center'
        timeline.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1 }, 0)
      }

      timeline.eventCallback('onUpdate', () => {
        const progress = timeline.progress()
        const maxIndex = totalSlides - 1
        const clampedIndex = clamp(Math.round(progress * maxIndex), 0, maxIndex)
        const humanIndex = clampedIndex + 1

        if (countRef.current) {
          countRef.current.textContent = `${humanIndex} of ${totalSlides}`
        }

        if (statusRef.current && clampedIndex !== lastIndexRef.current) {
          lastIndexRef.current = clampedIndex
          const slide = items[clampedIndex]
          statusRef.current.textContent = slide
            ? `Slide ${humanIndex} of ${totalSlides}: ${slide.title}`
            : `Slide ${humanIndex} of ${totalSlides}`
        }
      })
    },
    scrollTrigger: shouldPin
      ? {
          start: 'top top',
          end: `+=${Math.max(200, totalSlides * 100)}%`,
          pin: true,
          // Pure scrub so movement mirrors wheel input and reverses smoothly
          scrub: true,
        }
      : undefined,
  })

  useEffect(() => {
    lastIndexRef.current = -1
    if (countRef.current) {
      countRef.current.textContent = `1 of ${totalSlides}`
    }
    if (statusRef.current && items.length) {
      statusRef.current.textContent = `Slide 1 of ${totalSlides}: ${items[0]?.title ?? ''}`
    }
  }, [items, totalSlides, shouldPin])

  useEffect(() => {
    if (!shouldPin) {
      return
    }

    const element = containerRef.current
    if (!element) {
      return
    }

    const host = getStageHostElement()
    if (!host) {
      return
    }

    const onEnter = () => host.setAttribute('data-horizontal-stage', '')
    const onLeave = () => host.removeAttribute('data-horizontal-stage')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onEnter()
          } else {
            onLeave()
          }
        })
      },
      { threshold: 0.2 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      onLeave()
    }
  }, [shouldPin])

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

    const link = isExternalLink(item.href) ? (
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
    )

    return (
      <>
        {headingBlock}
        {link}
      </>
    )
  }

  const content = (
    <div ref={trackRef} className="horizontal-rail__track">
      {items.map((item) => (
        <article
          key={item.id}
          className="horizontal-rail__slide color-morph-card p-6"
          style={getAccentStyle(item.accentHue)}
        >
          {renderCardContent(item)}
        </article>
      ))}
    </div>
  )

  if (!shouldPin) {
    return (
      <section id={id} className={cn('horizontal-rail horizontal-rail--fallback', className)}>
        <div className="horizontal-rail__viewport sliding-track">
          {items.map((item) => (
            <article
              key={item.id}
              className="sliding-track__card color-morph-card p-6"
              style={getAccentStyle(item.accentHue)}
            >
              {renderCardContent(item)}
            </article>
          ))}
        </div>
      </section>
    )
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return
    }

    event.preventDefault()

    const maxIndex = Math.max(0, totalSlides - 1)
    if (maxIndex === 0) {
      return
    }

    const currentIndex = parseCount(countRef.current?.textContent ?? null, maxIndex)
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = clamp(currentIndex + direction, 0, maxIndex)
    if (nextIndex === currentIndex) {
      return
    }

    const targetProgress = nextIndex / maxIndex
    const timeline = timelineRef.current
    if (!timeline) {
      return
    }
    const tweenableTimeline = timeline as typeof timeline & {
      tweenTo?: (position: number, vars?: Record<string, unknown>) => unknown
    }
    if (typeof tweenableTimeline.tweenTo === 'function') {
      tweenableTimeline.tweenTo(timeline.duration() * targetProgress, {
        duration: 0.45,
        ease: 'power2.out',
      })
    } else {
      timeline.progress(targetProgress)
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
          <div
            ref={progressRef}
            className="horizontal-rail__progress"
            role="progressbar"
            aria-label="Story progress"
          />
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
