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
import { calculateStickyOffsets } from '../../utils/calculateStickyOffsets'
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
    if (prefersReducedMotion || !item.imageSrc || !imageRef.current) {
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
        threshold: 0.5, // Need 50% of image visible
        rootMargin: '-150px 0px', // Negative margin delays trigger - image must be well into viewport
      }
    )

    observer.observe(imageRef.current)

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
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

    // Cache sticky top calculation to avoid repeated getBoundingClientRect calls
    let cachedStickyTop: number | null = null
    let lastHeaderHeight: number | null = null
    // Cache header element reference to avoid repeated querySelector calls
    let cachedHeader: HTMLElement | null = null
    
    const getStickyTop = (): number => {
      // Cache header element reference (only query once)
      if (!cachedHeader) {
        cachedHeader = document.querySelector<HTMLElement>('.site-header')
      }
      
      // Only recalculate if header might have changed (on resize)
      const headerHeight = cachedHeader ? cachedHeader.getBoundingClientRect().height : 100.75
      
      // Cache sticky top if header height hasn't changed
      if (cachedStickyTop !== null && lastHeaderHeight === headerHeight) {
        return cachedStickyTop
      }
      
      const paddingMd = 20 // 1.25rem = 20px
      const offset = 95 // From site.css: top: calc(... + 95px)
      lastHeaderHeight = headerHeight
      cachedStickyTop = headerHeight + paddingMd + offset
      return cachedStickyTop
    }

    // Cache last progress to avoid unnecessary state updates
    let lastProgress = -1

    const calculateProgress = () => {
      const stickyTop = getStickyTop()
      const stickyTolerance = 10 // px tolerance for "locked" detection

      // Batch all getBoundingClientRect calls at once (better performance)
      const cardRects = cards.map(card => card.getBoundingClientRect())

      // Find the most advanced locked card (check from highest index to lowest)
      let lockedCardIndex = -1
      for (let i = cards.length - 1; i >= 0; i--) {
        const cardTop = cardRects[i].top

        // Card is "locked" if its top is within tolerance of sticky position
        if (cardTop <= stickyTop + stickyTolerance) {
          lockedCardIndex = i
          break // Found the most advanced locked card
        }
      }

      // Calculate progress based on locked card index
      // For 3 cards: 0 (no lock) → 0, card 0 locks → 0.5, card 1 or 2 locks → 1.0
      let totalProgress = 0
      if (lockedCardIndex >= 0) {
        if (lockedCardIndex === 0) {
          totalProgress = 0.5 // First card locked = bullet 2
        } else {
          totalProgress = 1.0 // Second or third card locked = bullet 3
        }
      }

      // Only update state if progress actually changed (reduces re-renders)
      if (totalProgress !== lastProgress) {
        lastProgress = totalProgress
        setCardBasedProgress(totalProgress)
        if (onProgressChange) {
          onProgressChange(totalProgress)
        }
      }
    }

    // Aggressively throttled scroll handler - use time-based throttling for better FPS
    let rafId: number | null = null
    let isScheduled = false
    let lastScrollTime = 0
    const SCROLL_THROTTLE_MS = 32 // ~30fps max update rate for better performance
    
    const scheduleCalculation = () => {
      const now = performance.now()
      if (isScheduled || (now - lastScrollTime) < SCROLL_THROTTLE_MS) {
        return
      }
      
      isScheduled = true
      lastScrollTime = now
      rafId = requestAnimationFrame(() => {
        isScheduled = false
        calculateProgress()
        rafId = null
      })
    }

    // Listen to scroll and resize events with passive listeners
    window.addEventListener('scroll', scheduleCalculation, { passive: true })
    
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    // Store resize handler reference for proper cleanup
    const handleResize = () => {
      // Clear cache on resize so header height is recalculated
      cachedStickyTop = null
      lastHeaderHeight = null
      // Clear header cache to re-query if DOM changed
      cachedHeader = null
      
      // Debounce resize calculations
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout)
      }
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

  // Calculate container height and CSS variables for sticky positioning
  // Optimized to match avax.network's approach (100lvh per card)
  const cssVars = useMemo(() => {
    if (!enableStickyStack) {
      return {} as CSSProperties
    }

    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    const cardCount = items.length
    
    // Container height calculation (matches avax.network pattern)
    // avax.network uses 100lvh (large viewport height) per card
    // Cards stack within this space, so we need enough height for all cards
    // Formula: Base offset + (cardCount * viewport height)
    // Base: 0.5 viewport for initial positioning
    // Per card: 0.8 viewport (cards overlap, so less than 1.0)
    const containerHeight = viewportHeight * (0.5 + (cardCount * 0.8))
    
    // Tab height is set via CSS and doesn't need dynamic calculation
    const tabHeight = 88

    const vars: CSSProperties &
      Record<
        '--sticky-container-height' | '--card-count' | '--card-tab-offset',
        string
      > = {
      '--sticky-container-height': `${containerHeight.toFixed(2)}px`,
      '--card-count': String(cardCount),
      '--card-tab-offset': `${tabHeight}px`,
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

  // Calculate dynamic offsets for cards (matches avax.network pattern exactly)
  // Algorithm: For each card, measure distance from card top to reference element,
  // then set that offset on the NEXT card to create cascading stack effect
  // Optimized: Caches DOM queries and batches getBoundingClientRect() calls
  // Only calculate when enabled (for section 2, this waits until main card is pinned)
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !enableStickyStack || !containerRef.current || !enabled) {
      return
    }

    // Cache deck reference to avoid repeated queries
    const deck = containerRef.current.querySelector<HTMLElement>('.sliding-stack__deck')
    if (!deck) return

    const calculateOffsets = () => {
      // Only calculate on desktop (mobile uses static layout)
      if (window.innerWidth <= 768) {
        return
      }

      // Use utility function for offset calculation (matches avax.network pattern)
      calculateStickyOffsets(deck)
    }

    // Calculate offsets after layout is stable
    // Use single RAF (avax.network doesn't use RAF, but we need it for React)
    const rafId = requestAnimationFrame(() => {
      calculateOffsets()
    })

    // Use ResizeObserver for deck changes (more efficient than window resize)
    const resizeObserver = new ResizeObserver(() => {
      calculateOffsets()
    })
    resizeObserver.observe(deck)

    // Recalculate on window resize with debouncing (optimized from avax.network)
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    
    const handleResize = () => {
      // Clear any pending resize calculations
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout)
        resizeTimeout = null
      }
      
      // Debounce resize calculations (150ms delay for better performance)
      resizeTimeout = setTimeout(() => {
        calculateOffsets()
        resizeTimeout = null
      }, 150)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [enableStickyStack, items.length, enabled])


  cardRefs.current.length = items.length

  const cards = useMemo(() => items.map((item, index) => {
    const palette = CARD_PALETTES[index % CARD_PALETTES.length]

    const cardStyle: CSSProperties & Record<'--card-bg', string> = {
      '--card-bg': palette,
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
