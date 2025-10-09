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

  const minHeight = useMemo(() => {
    if (!interactive) {
      return undefined
    }
    const base = (isCompact ? 260 : 320) + items.length * 28
    return Math.max(420, base)
  }, [interactive, items.length])

  const containerStyle: CSSProperties = {
    ...(minHeight ? { minHeight: `${minHeight}px` } : {}),
    ...style,
  }

  useEffect(() => {
    if (!interactive) {
      onProgressChange?.(1)
    }
  }, [interactive, items.length, onProgressChange])

  useScrollTimeline({
    target: interactive ? moduleElement : null,
    timeline: { defaults: { ease: 'power1.inOut' } },
    scrollTrigger: interactive
      ? {
          start: 'top top',
          end: `+=${Math.max(120, items.length * 120)}%`,
          scrub: true,
          pin: true,
          anticipatePin: 0.6,
          snap: items.length
            ? {
                snapTo: (value) => {
                  const segments = items.length
                  if (segments <= 0) {
                    return value
                  }
                  const snapped = Math.round(value * segments) / segments
                  return Math.max(0, Math.min(1, snapped))
                },
                duration: 0.2,
                ease: 'power1.out',
              }
            : undefined,
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

      const stackOffset = 4
      const segmentDuration = 1

      cards.forEach((card, index) => {
        timeline.set(
          card,
          {
            xPercent: 0,
            yPercent: index * stackOffset,
            rotation: index === 0 ? 0 : -index * 0.6,
            opacity: 1,
            zIndex: cards.length - index,
            pointerEvents: index === 0 ? 'auto' : 'none',
          },
          0,
        )
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

      cards.forEach((card, index) => {
        timeline.to(
          card,
          {
            xPercent: 160,
            rotation: 6,
            opacity: 0,
            pointerEvents: 'none',
            duration: segmentDuration,
          },
          index * segmentDuration,
        )
      })

      timeline.eventCallback('onUpdate', () => {
        const total = timeline.totalProgress()
        progressCallbackRef.current?.(total)

        const time = timeline.time()
        const nextIndex = Math.min(cards.length - 1, Math.max(0, Math.floor(time + SNAP_EPSILON)))
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
            <ColorMorphCard key={item.id} progress={1} className={cn('p-6 sm:p-8', cardClassName)}>
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
            className={cn('sliding-stack__card p-6 sm:p-8', cardClassName)}
          >
            {renderCardContent(item, ctaLabel)}
          </ColorMorphCard>
        )
      })}
    </div>
  )
}

