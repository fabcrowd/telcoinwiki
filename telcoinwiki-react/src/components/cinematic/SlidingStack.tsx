import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { ColorMorphCard } from './ColorMorphCard'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useScrollTimeline } from '../../hooks/useScrollTimeline'

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

const isExternalLink = (href: string) => /^https?:\/\//i.test(href)

const SNAP_EPSILON = 0.0001
const CTA_ARROW = '\u2192'

export function SlidingStack({
  items,
  prefersReducedMotion = false,
  className,
  cardClassName,
  style,
  onProgressChange,
}: SlidingStackProps) {
  const isCompact = useMediaQuery('(max-width: 62rem)')
  const isHandheld = useMediaQuery('(max-width: 40rem)')
  const interactive = !prefersReducedMotion && !isHandheld

  const containerRef = useRef<HTMLDivElement | null>(null)
  const liveRegionRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const tabRefs = useRef<Array<HTMLElement | null>>([])
  const contentRefs = useRef<Array<HTMLElement | null>>([])
  const progressCallbackRef = useRef(onProgressChange)
  const [moduleElement, setModuleElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    progressCallbackRef.current = onProgressChange
  }, [onProgressChange])

  useLayoutEffect(() => {
    if (!interactive) {
      setModuleElement(null)
      return
    }

    if (containerRef.current) {
      const module = containerRef.current.closest('[data-sticky-module]')
      setModuleElement((module as HTMLElement | null) ?? null)
    }
  }, [interactive, items.length])

  useEffect(() => {
    if (!interactive) {
      progressCallbackRef.current?.(1)
    }
  }, [interactive, items.length])

  const setCardRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      cardRefs.current[index] = element
    },
    [],
  )

  const setTabRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      tabRefs.current[index] = element
    },
    [],
  )

  const setContentRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      contentRefs.current[index] = element
    },
    [],
  )

  const minHeight = useMemo(() => {
    if (!interactive) {
      return undefined
    }
    const base = (isCompact ? 260 : 320) + items.length * 28
    return Math.max(420, base)
  }, [interactive, isCompact, items.length])

  const containerStyle: CSSProperties = {
    ...(minHeight ? { minHeight: `${minHeight}px` } : {}),
    ...style,
  }

  useEffect(() => {
    if (!interactive) {
      onProgressChange?.(1)
    }
  }, [interactive, items.length, onProgressChange])

  const stackTimelineRef = useScrollTimeline({
    target: interactive ? moduleElement : null,
    timeline: { defaults: { ease: 'none' } },
    scrollTrigger: interactive
      ? {
          start: 'top top',
          // Spread scroll distance to ~100% per card (min 80%) to reduce overlapping animations.
          end: `+=${Math.max(80, items.length * 100)}%`,
          scrub: true,
          pin: true,
          // Helps avoid layout jumps when pinning on fast scrolls
          anticipatePin: 1,
        }
      : undefined,
    create: (timeline) => {
      if (!interactive) {
        return
      }

      const cards = cardRefs.current.filter((card): card is HTMLElement => Boolean(card))
      if (!cards.length) {
        progressCallbackRef.current?.(1)
        return
      }

      const stackYOffset = 4
      const segmentDuration = 1
      const revealOffsetVw = isCompact ? 14 : 12
      const spacingVw = isCompact ? 16 : 14
      const inactiveScale = 0.94

      // Phase mapping: lead hold (drag intro to center) -> accordion fan-out -> per-card exits -> tail hold (drag out)
      // Keep the horizontal phases confined to the middle 64% so the intro can "drag" to center first, then resume after.
      const HOLD_IN_FRAC = 0.18
      const HOLD_OUT_FRAC = 0.18
      const BODY_FRAC = 1 - HOLD_IN_FRAC - HOLD_OUT_FRAC // 0.64

      const exitDuration = cards.length * segmentDuration
      const fanDuration = Math.max(0.5, Math.min(cards.length * 0.35, 1.2))
      const bodyDuration = fanDuration + exitDuration
      const leadHold = bodyDuration * (HOLD_IN_FRAC / BODY_FRAC)
      const tailHold = bodyDuration * (HOLD_OUT_FRAC / BODY_FRAC)

      // Initial state: all sub-cards stacked under the main workspace, slight Y offset for depth
      cards.forEach((card, index) => {
        timeline.set(
          card,
          {
            x: `-${revealOffsetVw}vw`,
            xPercent: 0,
            yPercent: index * stackYOffset,
            rotation: index === 0 ? 0 : -index * 0.6,
            opacity: 1,
            zIndex: cards.length - index,
            pointerEvents: 'none',
            scale: inactiveScale,
          },
          0,
        )
      })

      // Tabs: single element peeks from right when stacked, slides into locked top-left on fan-out
      const tabs = tabRefs.current.filter((t): t is HTMLElement => Boolean(t))
      const TAB_SPACING = 28 // px vertical spacing so all titles are readable
      tabs.forEach((tab, index) => {
        // Start peeking from the right edge, stacked downward like file-folder tabs (no fading)
        timeline.set(tab, { x: 'calc(100% + 2.2rem)', y: index * TAB_SPACING }, 0)
      })

      // Sliding content: start offset to the right; slides in during fan-out (no fading)
      const contents = contentRefs.current.filter((c): c is HTMLElement => Boolean(c))
      contents.forEach((content) => {
        timeline.set(content, { x: '12vw' }, 0)
      })

      let currentActiveIndex = 0

      const updateLiveRegion = (activeIndex: number) => {
        if (!liveRegionRef.current) {
          return
        }
        const item = items[activeIndex]
        if (!item) {
          return
        }
        liveRegionRef.current.textContent = `Slide ${activeIndex + 1} of ${items.length}: ${item.title}`
      }

      const setActiveCard = (activeIndex: number, force = false) => {
        const clamped = Math.min(cards.length - 1, Math.max(0, activeIndex))

        if (!force && clamped === currentActiveIndex) {
          return
        }

        currentActiveIndex = clamped

        cards.forEach((card, idx) => {
          const isActive = idx === currentActiveIndex
          card.classList.toggle('is-active', isActive)
          card.style.pointerEvents = isActive ? 'auto' : 'none'
        })

        updateLiveRegion(currentActiveIndex)
      }

      // Accordion fan-out: reveal the smaller sub-cards left→right beneath the main workspace card, then pause
      const fanStep = fanDuration / Math.max(1, cards.length)
      cards.forEach((card, index) => {
        const stageX = `${revealOffsetVw + index * spacingVw}vw`
        const stageScale = index === 0 ? 1 : Math.max(0.88, 1 - index * 0.04)
        const when = leadHold + index * fanStep
        timeline.to(
          card,
          {
            x: stageX,
            rotation: 0,
            scale: stageScale,
            duration: fanStep,
            ease: 'power3.out',
          },
          when,
        )

        const tab = tabs[index]
        if (tab) {
          timeline.to(tab, { x: 0, y: 0, duration: fanStep, ease: 'power3.out' }, when)
        }

        const content = contents[index]
        if (content) {
          timeline.to(content, { x: 0, duration: fanStep, ease: 'power3.out' }, when)
        }
      })

      // Per-card exits: one-by-one, each staged card slides smoothly off-screen to the right
      cards.forEach((card, index) => {
        timeline.to(
          card,
          {
            xPercent: 220,
            rotation: 0,
            pointerEvents: 'none',
            duration: segmentDuration,
            ease: 'power2.inOut',
          },
          leadHold + fanDuration + index * segmentDuration,
        )
      })

      // Trailing hold to keep the intro pinned while the last card settles out
      // and allow the "drag out" phase to feel deliberate.
      if (tailHold > 0) {
        // Use a dummy tween to extend the timeline
        timeline.to({}, { duration: tailHold }, leadHold + fanDuration + cards.length * segmentDuration)
      }

      timeline.eventCallback('onUpdate', () => {
        const total = timeline.totalProgress()
        progressCallbackRef.current?.(total)

        // Compute active index based only on the horizontal slide body range
        const time = timeline.time()
        const tBody = Math.max(0, Math.min(bodyDuration, time - leadHold))
        const tAfterFan = Math.max(0, tBody - fanDuration)
        const nextIndex = Math.min(
          cards.length - 1,
          Math.max(0, Math.floor(tAfterFan / segmentDuration + SNAP_EPSILON)),
        )
        setActiveCard(nextIndex)
      })

      timeline.eventCallback('onComplete', () => {
        progressCallbackRef.current?.(1)
        setActiveCard(cards.length - 1, true)
      })

      timeline.eventCallback('onReverseComplete', () => {
        progressCallbackRef.current?.(0)
        setActiveCard(0, true)
      })

      progressCallbackRef.current?.(0)
      setActiveCard(0, true)
    },
  })

  useEffect(() => {
    return () => {
      const timeline = stackTimelineRef.current
      if (!timeline) {
        return
      }

      timeline.eventCallback('onUpdate', null)
      timeline.eventCallback('onComplete', null)
      timeline.eventCallback('onReverseComplete', null)

      const scrollTrigger = timeline.scrollTrigger
      if (scrollTrigger?.eventCallback) {
        scrollTrigger.eventCallback('onUpdate', null)
        scrollTrigger.eventCallback('onScrubComplete', null)
      }
    }
  }, [stackTimelineRef])

  const renderCardContent = useCallback(
    (item: SlidingStackItem, ctaLabel = 'Learn more') => {
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
    },
    [],
  )

  if (!interactive) {
    return (
      <div
        ref={containerRef}
        className={cn('sliding-stack sliding-stack--static', className)}
        data-sliding-stack=""
        style={containerStyle}
      >
        <div className="sr-only" aria-live="polite" ref={liveRegionRef}>
          {items.length ? `Slide 1 of ${items.length}: ${items[0].title}` : ''}
        </div>
        {items.map((item) => {
          const ctaLabel = item.ctaLabel ?? 'Learn more'
          return (
            <ColorMorphCard
              key={item.id}
              progress={1}
              className={cn('sliding-stack__card p-5 sm:p-6', cardClassName)}
            >
              <div className="sliding-stack__tab">
                <span className="sliding-stack__tab-text">{item.title}</span>
              </div>
              {renderCardContent(item, ctaLabel)}
            </ColorMorphCard>
          )
        })}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('sliding-stack sliding-stack--interactive', className)}
      data-sliding-stack=""
      style={containerStyle}
    >
      <div className="sr-only" aria-live="polite" ref={liveRegionRef}>
        {items.length ? `Slide 1 of ${items.length}: ${items[0].title}` : ''}
      </div>
      {items.map((item, index) => {
        const ctaLabel = item.ctaLabel ?? 'Learn more'
        return (
          <ColorMorphCard
            key={item.id}
            ref={setCardRef(index)}
            progress={1}
            className={cn('sliding-stack__card p-5 sm:p-6', cardClassName)}
          >
            {/* Filing-cabinet tab: peeks from right when stacked; slides into top-left when staged */}
            <div ref={setTabRef(index)} className="sliding-stack__tab" aria-hidden>
              <span className="sliding-stack__tab-text">{item.title}</span>
            </div>
            {/* Content wrapper that slides horizontally into place (no fading) */}
            <div ref={setContentRef(index)}>
              {renderCardContent(item, ctaLabel)}
            </div>
          </ColorMorphCard>
        )
      })}
    </div>
  )
}
