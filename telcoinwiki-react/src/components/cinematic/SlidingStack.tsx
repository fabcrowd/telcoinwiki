import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { ColorMorphCard } from './ColorMorphCard'

// Component for card content with image animation support
interface CardContentProps {
  item: SlidingStackItem
  prefersReducedMotion: boolean
}

function CardContent({ item, prefersReducedMotion }: CardContentProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [isImageVisible, setIsImageVisible] = useState(false)

  useEffect(() => {
    const node = imageRef.current
    if (prefersReducedMotion || !item.imageSrc || !node) {
      setIsImageVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsImageVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '-150px 0px',
      }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [prefersReducedMotion, item.imageSrc])

  const bodyContent = (
    <div className="text-xl text-telcoin-ink-muted sm:text-[1.35rem] lg:text-2xl leading-relaxed">
      {item.body}
    </div>
  )

  const imageContent = item.imageSrc ? (
    <div className="sliding-stack__image-wrapper">
      <img
        ref={imageRef}
        src={item.imageSrc}
        alt={item.imageAlt || ''}
        className={cn(
          'sliding-stack__image',
          `sliding-stack__image--${item.imageAnimation || 'fade'}`,
          isImageVisible && 'sliding-stack__image--visible'
        )}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
    </div>
  ) : null

  const textAndImage = (
    <div className="sliding-stack__content-wrapper">
      <div className="sliding-stack__text-content">
        {bodyContent}
      </div>
      {imageContent}
    </div>
  )

  if (!item.href) {
    return (
      <div className="sliding-stack__content">
        {textAndImage}
      </div>
    )
  }

  const ctaLabel = item.ctaLabel ?? 'Learn more'
  const linkChildren = (
    <>
      {ctaLabel}
      <span aria-hidden>→</span>
    </>
  )

  return (
    <div className="sliding-stack__content">
      {textAndImage}
      {isExternalLink(item.href) ? (
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent mt-4"
          href={item.href}
          target="_blank"
          rel="noreferrer"
        >
          {linkChildren}
        </a>
      ) : (
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent mt-4" to={item.href}>
          {linkChildren}
        </Link>
      )}
    </div>
  )
}

export interface SlidingStackItem {
  id: string
  eyebrow?: string
  title: string
  /** Optional short label for the folder tab. Falls back to title. */
  tabLabel?: string
  body: ReactNode
  href?: string
  ctaLabel?: string
  /** Optional image source for the card */
  imageSrc?: string
  /** Optional alt text for the image */
  imageAlt?: string
  /** Optional animation type: 'fade', 'scale', 'slide-left', 'slide-right', 'slide-up', 'slide-down', 'rotate', 'pulse' */
  imageAnimation?: 'fade' | 'scale' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'rotate' | 'pulse'
}

interface SlidingStackProps {
  items: SlidingStackItem[]
  prefersReducedMotion?: boolean
  className?: string
  cardClassName?: string
  style?: CSSProperties
  onProgressChange?: (value: number) => void
  enabled?: boolean
}

const STACK_TOP_EXTRA_PX = 16
const CARD_PALETTES = ['var(--palette-1)', 'var(--palette-6)', 'var(--palette-5)', 'var(--palette-4)'] as const

const isExternalLink = (href: string): boolean => {
  return /^https?:\/\//i.test(href)
}

export function SlidingStack({
  items,
  prefersReducedMotion = false,
  className,
  cardClassName,
  style,
  onProgressChange,
  enabled = true,
}: SlidingStackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  // Enable sticky stacking
  // Always enable sticky stacking for card animations (feature flag can still disable via URL ?story=0)
  const canAnimate = true
  const stackModeClass = 'sliding-stack--interactive'
  const enableStickyStack = enabled // Use enabled prop to control when scrolling starts

  // Card-based progress tracking: detect when each card locks into sticky position
  const [cardBasedProgress, setCardBasedProgress] = useState(0)
  
  // Mobile sticky stacking now uses the same offset calculation as desktop
  // No separate animation logic needed - sticky positioning handles the stacking

  // Track which card is locked at sticky position and calculate progress
  // Optimized: Only runs on scroll/resize events, not continuous RAF loop
  useEffect(() => {
    if (prefersReducedMotion || !enableStickyStack || typeof window === 'undefined') {
      if (onProgressChange) {
        onProgressChange(0)
      }
      return
    }

    const deck = containerRef.current?.querySelector<HTMLElement>('.sliding-stack__deck')
    if (!deck) return

    const cards = Array.from(deck.querySelectorAll<HTMLElement>('.sliding-stack__card, .color-morph-card'))
    if (cards.length === 0) return

    // Read each card's resolved `top` from computed style — this is exactly what the
    // browser uses for sticky positioning, so detection is always in sync with CSS
    // regardless of how --stack-top or --stack-tab-height resolve.
    let cachedThresholds: number[] | null = null

    const getCardThresholds = (): number[] => {
      if (cachedThresholds) return cachedThresholds

      let base = Number.NaN
      const resolved = cards.map((card) => {
        const top = Number.parseFloat(window.getComputedStyle(card).top)
        if (!Number.isNaN(top) && Number.isNaN(base)) base = top
        return top
      })

      if (Number.isNaN(base)) {
        const header = document.querySelector<HTMLElement>('.site-header')
        const headerHeight = header ? header.getBoundingClientRect().height : 100.75
        base = headerHeight + 20 + 95
      }

      cachedThresholds = resolved.map((top) => (Number.isNaN(top) ? base : top))
      return cachedThresholds
    }

    let lastProgress = -1

    const calculateProgress = () => {
      const thresholds = getCardThresholds()
      const stickyTolerance = 10

      const cardRects = cards.map(card => card.getBoundingClientRect())

      let lockedCardIndex = -1
      for (let i = cards.length - 1; i >= 0; i--) {
        if (cardRects[i].top <= thresholds[i] + stickyTolerance) {
          lockedCardIndex = i
          break
        }
      }

      let totalProgress = 0
      if (lockedCardIndex >= 0) {
        totalProgress = lockedCardIndex === 0 ? 0.5 : 1.0
      }

      if (totalProgress !== lastProgress) {
        lastProgress = totalProgress
        setCardBasedProgress(totalProgress)
        if (onProgressChange) onProgressChange(totalProgress)
      }
    }

    // rAF coalescing: caps updates to display refresh rate and guarantees a trailing
    // run after scroll stops, so progress never lags the final position.
    let rafId: number | null = null

    const scheduleCalculation = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        calculateProgress()
      })
    }

    window.addEventListener('scroll', scheduleCalculation, { passive: true })

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    const handleResize = () => {
      cachedThresholds = null
      if (resizeTimeout !== null) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        scheduleCalculation()
        resizeTimeout = null
      }, 150)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    // Initial calculation
    scheduleCalculation()

    return () => {
      window.removeEventListener('scroll', scheduleCalculation)
      window.removeEventListener('resize', handleResize)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout)
      }
    }
  }, [prefersReducedMotion, enableStickyStack, onProgressChange, items.length])

  const initialAnnouncement = items.length ? `Slide 1 of ${items.length}: ${items[0].title}` : ''

  // Measure the header and set --stack-top so sticky cards start below the header
  useLayoutEffect(() => {
    if (!canAnimate) return
    const container = containerRef.current
    if (!container) return

    const header = document.querySelector<HTMLElement>('.site-header')
    if (!header) return

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    
    const apply = () => {
      const rect = header.getBoundingClientRect()
      const topPx = Math.max(0, Math.round(rect.height + STACK_TOP_EXTRA_PX))
      container.style.setProperty('--stack-top', `${topPx}px`)
    }

    apply()

    // Debounce ResizeObserver callback for better performance
    const handleResize = () => {
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout)
      }
      resizeTimeout = setTimeout(() => {
        apply()
        resizeTimeout = null
      }, 100)
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(header)
    
    // Debounce window resize as well
    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout)
      }
    }
  }, [canAnimate])

  const renderCardContent = useCallback((item: SlidingStackItem) => {
    return <CardContent item={item} prefersReducedMotion={prefersReducedMotion} />
  }, [prefersReducedMotion])

  // Container height: exactly 1 viewport per card (dvh respects mobile URL-bar resize).
  // --card-count lets any CSS rule re-derive the height if needed.
  const cssVars = useMemo(() => {
    if (!enableStickyStack) return {} as CSSProperties

    const cardCount = items.length
    const vars: CSSProperties &
      Record<'--sticky-container-height' | '--card-count', string> = {
      '--sticky-container-height': `calc(${cardCount} * 100dvh)`,
      '--card-count': String(cardCount),
    }
    return vars
  }, [items.length, enableStickyStack])

  // Copy CSS variable from SlidingStack container to parent section
  // This allows the section to use --sticky-container-height in its height calculation
  useEffect(() => {
    if (typeof window !== 'undefined' && enableStickyStack && containerRef.current) {
      const containerHeight = (cssVars as Record<string, string>)['--sticky-container-height']
      if (containerHeight) {
        const section = containerRef.current.closest<HTMLElement>('[data-sticky-module]')
        if (section) {
          section.style.setProperty('--sticky-container-height', containerHeight)
        }
      }
    }
  }, [enableStickyStack, cssVars])

  cardRefs.current.length = items.length

  const cards = useMemo(() => items.map((item, index) => {
    const palette = CARD_PALETTES[index % CARD_PALETTES.length]

    const cardStyle: CSSProperties & Record<'--card-bg' | '--card-index', string> = {
      '--card-bg': palette,
      '--card-index': String(index),
    }

    return (
      <ColorMorphCard
        key={item.id}
        id={item.id}
        progress={1}
        className={cn(
          'sliding-stack__card pt-0 pb-10 sm:pb-12 lg:pb-14',
          cardClassName,
        )}
        ref={(node) => {
          cardRefs.current[index] = node
        }}
        style={cardStyle}
      >
        <div className="sliding-stack__tab">
          <span className="sliding-stack__tab-text">
            {item.eyebrow ? (
              <>
                <span className="font-semibold uppercase tracking-[0.2em] mr-4">
                  {item.eyebrow}
                </span>
                <span className="mr-4">-</span>
              </>
            ) : null}
            <span className="text-[0.9375rem]">{item.tabLabel ?? item.title}</span>
          </span>
        </div>
        <div className="sliding-stack__body px-6 sm:px-8 lg:px-10">
          {renderCardContent(item)}
        </div>
      </ColorMorphCard>
    )
  }), [items, cardClassName, renderCardContent])

  return (
    <div
      ref={containerRef}
      className={cn('sliding-stack', stackModeClass, className)}
      data-sliding-stack=""
      data-sticky-stack={enableStickyStack && enabled ? '' : undefined}
      data-prefers-reduced-motion={prefersReducedMotion ? '' : undefined}
      style={{
        ...cssVars,
        '--scroll-progress': cardBasedProgress,
        ...style,
      } as CSSProperties & Record<'--scroll-progress', number>}
    >
      <div className="sr-only" aria-live="polite">
        {initialAnnouncement}
      </div>
      <div className="sliding-stack__viewport">
        <div className="sliding-stack__deck">
          {cards}
        </div>
      </div>
    </div>
  )
}
