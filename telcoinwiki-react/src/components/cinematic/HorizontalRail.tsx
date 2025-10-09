import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useScrollTimeline } from '../../hooks/useScrollTimeline'
<<<<<<< HEAD
import { gsap } from 'gsap'
=======
>>>>>>> origin/main

export interface HorizontalRailItem {
  id: string
  eyebrow?: string
  title: string
  body: ReactNode
  href?: string
  ctaLabel?: string
<<<<<<< HEAD
  /** Optional accent hue (0..360) to tint the slide */
  accentHue?: number
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
  const statusRef = useRef<HTMLDivElement | null>(null)
  const lastIndexRef = useRef<number>(-1)
=======
>>>>>>> origin/main
  const prefersReducedMotion = usePrefersReducedMotion()
  const isHandheld = useMediaQuery('(max-width: 48rem)')
  const saveData = typeof navigator !== 'undefined' && (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData

  const shouldPin = !prefersReducedMotion && !isHandheld && !saveData
  const slides = items.length
  const totalPercent = -(slides - 1) * 100

  // Drive a pinned horizontal translation as the user scrolls vertically
  useScrollTimeline({
    target: shouldPin ? containerRef : null,
    create: ({ gsap }) => {
      if (!trackRef.current) return gsap.timeline()
      const tl = gsap.timeline({ defaults: { ease: 'none' } })

      // Main horizontal scrub
      tl.fromTo(
        trackRef.current,
        { xPercent: 0 },
        { xPercent: totalPercent },
        0,
      )

      // Parallax background glides at a slower rate
      if (bgRef.current) {
<<<<<<< HEAD
        const parallax = Math.max(0, Math.min(parallaxStrength, 1)) * (saveData ? 0.1 : 1)
        tl.fromTo(
          bgRef.current,
          { xPercent: 0 },
          { xPercent: totalPercent * parallax },
=======
        tl.fromTo(
          bgRef.current,
          { xPercent: 0 },
          { xPercent: totalPercent * Math.max(0, Math.min(parallaxStrength, 1)) },
>>>>>>> origin/main
          0,
        )
      }

      // Progress bar sync (scaleX from left)
      if (progressRef.current) {
        gsap.set(progressRef.current, { transformOrigin: 'left center' })
        tl.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1 }, 0)
      }

<<<<<<< HEAD
      // Update N of M indicator and screen-reader status in lockstep with progress
      tl.eventCallback('onUpdate', () => {
        const p = tl.progress()
        const rawIdx = Math.round(p * (items.length - 1))
        const clampedIdx = Math.max(0, Math.min(items.length - 1, rawIdx))
        const humanIdx = clampedIdx + 1

        if (countRef.current) {
          countRef.current.textContent = `${humanIdx} of ${items.length}`
        }

        if (statusRef.current && clampedIdx !== lastIndexRef.current) {
          lastIndexRef.current = clampedIdx
          const slide = items[clampedIdx]
          statusRef.current.textContent = `Slide ${humanIdx} of ${items.length}: ${slide?.title ?? ''}`
        }
      })
=======
      // Update N of M indicator in lockstep with progress
      if (countRef.current) {
        tl.eventCallback('onUpdate', () => {
          const p = tl.progress()
          const idx = Math.round(p * (items.length - 1)) + 1
          countRef.current!.textContent = `${idx} of ${items.length}`
        })
      }
>>>>>>> origin/main

      return tl
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

  // Toggle a data attribute on <html> to slightly reframe the viewport when active
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

  const content = (
    <div ref={trackRef} className="horizontal-rail__track">
<<<<<<< HEAD
      {items.map((item) => {
        const hue = typeof item.accentHue === 'number' ? Math.max(0, Math.min(360, item.accentHue)) : null
        const style: React.CSSProperties & Record<string, number | string> = hue
          ? {
              ['--tc-stage-hue']: hue,
              ['--tc-stage-accent-hue']: (hue + 24) % 360,
            }
          : undefined
        return (
          <article key={item.id} className="horizontal-rail__slide color-morph-card p-6" style={style}>
=======
      {items.map((item) => (
        <article key={item.id} className="horizontal-rail__slide">
>>>>>>> origin/main
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
                {item.ctaLabel ?? 'Learn more'}
                <span aria-hidden>→</span>
              </a>
            ) : (
              <Link className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent" to={item.href}>
                {item.ctaLabel ?? 'Learn more'}
                <span aria-hidden>→</span>
              </Link>
            )
          ) : null}
<<<<<<< HEAD
          </article>
        )
      })}
=======
        </article>
      ))}
>>>>>>> origin/main
    </div>
  )

  // Reduced motion / small screens: fall back to scroll-snap horizontal list
  if (!shouldPin) {
    return (
      <section id={id} className={cn('horizontal-rail horizontal-rail--fallback', className)}>
        <div className="horizontal-rail__viewport sliding-track">
<<<<<<< HEAD
          {items.map((item) => {
            const hue = typeof item.accentHue === 'number' ? Math.max(0, Math.min(360, item.accentHue)) : null
            const style: React.CSSProperties & Record<string, number | string> = hue
              ? {
                  ['--tc-stage-hue']: hue,
                  ['--tc-stage-accent-hue']: (hue + 24) % 360,
                }
              : undefined
            return (
              <article key={item.id} className="sliding-track__card color-morph-card p-6" style={style}>
=======
          {items.map((item) => (
            <article key={item.id} className="sliding-track__card color-morph-card p-6">
>>>>>>> origin/main
              {item.eyebrow ? (
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">
                  {item.eyebrow}
                </span>
              ) : null}
              <h3 className="text-xl font-semibold text-telcoin-ink sm:text-2xl">{item.title}</h3>
              <div className="text-base text-telcoin-ink-muted sm:text-lg">{item.body}</div>
<<<<<<< HEAD
              </article>
            )
          })}
=======
            </article>
          ))}
>>>>>>> origin/main
        </div>
      </section>
    )
  }

  return (
<<<<<<< HEAD
    <section
      id={id}
      ref={containerRef}
      className={cn('horizontal-rail', className)}
      aria-label="Horizontal storyline"
      role="group"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
        e.preventDefault()
        // Find current transform by reading progress from the progress bar scaleX
        const maxIndex = Math.max(0, items.length - 1)
        // Estimate progress using countRef when available
        let current = 0
        if (countRef.current?.textContent) {
          const m = /(\d+) of (\d+)/.exec(countRef.current.textContent)
          if (m) {
            current = Math.max(0, Math.min(maxIndex, parseInt(m[1], 10) - 1))
          }
        }
        const next = Math.max(0, Math.min(maxIndex, current + (e.key === 'ArrowRight' ? 1 : -1)))
        const target = maxIndex === 0 ? 0 : next / maxIndex
        // Smoothly tween the pinned timeline's progress via progress bar scaleX
        if (progressRef.current) {
          gsap.to(progressRef.current, {
            scaleX: target,
            duration: 0.6,
            ease: 'power3.out',
            onUpdate: () => {
              // mirror count/status updates for SR users
              const humanIdx = Math.round(target * maxIndex) + 1
              if (countRef.current) countRef.current.textContent = `${humanIdx} of ${items.length}`
              if (statusRef.current) statusRef.current.textContent = `Slide ${humanIdx} of ${items.length}: ${items[humanIdx - 1]?.title ?? ''}`
              if (trackRef.current) {
                const totalPercent = -(items.length - 1) * 100
                trackRef.current.style.transform = `translateX(${(totalPercent * target).toFixed(2)}%)`
              }
              if (bgRef.current) {
                const parallax = Math.max(0, Math.min(parallaxStrength, 1)) * (saveData ? 0.1 : 1)
                const totalPercent = -(items.length - 1) * 100
                bgRef.current.style.transform = `translateX(${(totalPercent * parallax * target).toFixed(2)}%)`
              }
            },
          })
        }
      }}
    >
=======
    <section id={id} ref={containerRef} className={cn('horizontal-rail', className)} aria-label="Horizontal storyline">
>>>>>>> origin/main
      {/* Subtle parallax background */}
      <div ref={bgRef} className="horizontal-rail__bg" aria-hidden />
      {/* Framing overlays to emphasize sideways motion */}
      <div className="horizontal-rail__frame" aria-hidden>
        <div className="horizontal-rail__vignette horizontal-rail__vignette--left" />
        <div className="horizontal-rail__vignette horizontal-rail__vignette--right" />
        <div className="horizontal-rail__progress-wrap">
          <div ref={progressRef} className="horizontal-rail__progress" role="progressbar" aria-label="Story progress" />
<<<<<<< HEAD
          <div ref={countRef} className="horizontal-rail__count" aria-hidden />
          <div ref={statusRef} className="sr-only" aria-live="polite" />
=======
          <div ref={countRef} className="horizontal-rail__count" />
>>>>>>> origin/main
        </div>
      </div>
      <div className="horizontal-rail__viewport">
        {content}
      </div>
      <div className="sr-only" aria-live="polite">
        Horizontal section active
      </div>
    </section>
  )
}
