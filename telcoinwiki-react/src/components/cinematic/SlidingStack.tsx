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
import { SCROLL_STORY_ENABLED } from '../../config/featureFlags'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { parseUnit, parsePx, clampPercent, approx } from '../../utils/cssUtils'
import {
  detectScrollTimelineSupport,
  detectCompactViewport as detectCompactViewportUtil,
  createMediaQueryListener,
} from '../../utils/browserSupport'
import {
  calculateTimelineWindows,
  calculateFallbackWindow,
  calculateActiveIndex,
  calculateCardProgress,
  type TimelineWindow,
} from '../../utils/timelineCalculations'

export interface SlidingStackItem {
  id: string
  eyebrow?: string
  title: string
  /** Optional short label for the folder tab. Falls back to title. */
  tabLabel?: string
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

const CTA_ARROW = '\\u2192'

const isExternalLink = (href: string) => /^https?:\/\//i.test(href)

const baseStackStyle: CSSProperties &
  Record<
    | '--stack-gutter'
    | '--stack-top'
    | '--stack-bottom'
    | '--stack-translate-start'
    | '--stack-tail'
    | '--last-card-translate-end'
    | '--stack-step',
    string
  > = {
  '--stack-gutter': 'clamp(6px, 0.6vw, 12px)',
  // This value will be measured and overridden at runtime; keep a safe fallback.
  '--stack-top': 'calc(var(--header-height, 72px) + 16px)',
  '--stack-bottom': '-7rem',
  '--stack-translate-start': 'calc(100vh - var(--stack-top) - var(--stack-bottom))',
  '--stack-tail': '420vh',
  '--last-card-translate-end': '12vh',
  '--stack-step': '0px',
}

// Tunables (desktop defaults); JS fallback and CSS-driven timeline should feel identical.
const DEFAULT_STACK_DURATION = '80vh'
const DEFAULT_STACK_TAIL = baseStackStyle['--stack-tail'] as string
const DEFAULT_STACK_STEP = '60px'
const DEFAULT_TAB_CLEARANCE = '72px'
const MIN_WINDOW_SPAN = 10
const SAFE_PADDING_PX = 32
const LAST_CARD_HOLD_PCT = 40
const TARGET_WINDOW_PCT = 22
const INITIAL_DELAY_PCT = 18
const WINDOW_GAP_PCT = 2 // Reduced from 5 to tighten spacing between cards
const CARD_DWELL_PCT = 1
const CARD_PALETTES = ['var(--palette-1)', 'var(--palette-6)', 'var(--palette-5)', 'var(--palette-4)'] as const
const COMPACT_VIEWPORT_QUERY = '(max-width: 48rem)'
const MOBILE_FALLBACK_SLOWDOWN = 1.7
const STACK_TOP_EXTRA_PX = 16 // space between header bottom and pinned viewport
const DURATION_MIN_VH_DESKTOP = 16
const DURATION_MAX_VH_DESKTOP = 28
const DURATION_MIN_VH_MOBILE = 24
const DURATION_MAX_VH_MOBILE = 36
const TAIL_MULTIPLIER_DESKTOP = 4.0
const TAIL_MULTIPLIER_MOBILE = 5.0
// Extra delay to guarantee the first (static) card has locked before card 2 begins
// Reduced from 30 to 15 to free up timeline space for card 4
const PIN_LOCK_DELAY_PCT = 15

interface TimelineState {
  windows: TimelineWindow[]
  duration: string
  tail: string
  step: string
  tabOffsets: number[]
  tabClearance: string
  scales: number[]
  translateStart: number
  targetHeight: number
}

const timelineStatesEqual = (a: TimelineState, b: TimelineState) => {
  if (a.windows.length !== b.windows.length) return false
  if (!approx(parseUnit(a.duration), parseUnit(b.duration))) return false
  if (!approx(parseUnit(a.tail), parseUnit(b.tail))) return false
  if (!approx(parseUnit(a.step), parseUnit(b.step))) return false
  if (!approx(parseUnit(a.tabClearance), parseUnit(b.tabClearance))) return false
  if (a.tabOffsets.length !== b.tabOffsets.length) return false
  if (a.scales.length !== b.scales.length) return false
  for (let i = 0; i < a.windows.length; i += 1) {
    if (!approx(a.windows[i]?.start ?? 0, b.windows[i]?.start ?? 0)) return false
    if (!approx(a.windows[i]?.end ?? 0, b.windows[i]?.end ?? 0)) return false
  }
  for (let i = 0; i < a.tabOffsets.length; i += 1) {
    if (!approx(a.tabOffsets[i] ?? 0, b.tabOffsets[i] ?? 0)) return false
  }
  for (let i = 0; i < a.scales.length; i += 1) {
    if (!approx(a.scales[i] ?? 1, b.scales[i] ?? 1)) return false
  }
  if (!approx(a.translateStart, b.translateStart)) return false
  return true
}

const detectCompactViewport = () => detectCompactViewportUtil(COMPACT_VIEWPORT_QUERY)

export function SlidingStack({
  items,
  prefersReducedMotion = false,
  className,
  cardClassName,
  style,
  onProgressChange,
}: SlidingStackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const effectiveDisabled = prefersReducedMotion || !SCROLL_STORY_ENABLED
  const progress = useScrollProgress(containerRef, {
    disabled: effectiveDisabled,
    clamp: true,
    smoothing: 0.14,
  })

  useEffect(() => {
    if (!onProgressChange) return
    if (effectiveDisabled) {
      onProgressChange(1)
      return
    }
    onProgressChange(progress)
  }, [effectiveDisabled, onProgressChange, progress])

  const [supportsScrollTimeline, setSupportsScrollTimeline] = useState(() => detectScrollTimelineSupport())

  useEffect(() => {
    setSupportsScrollTimeline(detectScrollTimelineSupport())
  }, [])

  const [isCompactViewport, setIsCompactViewport] = useState(() => detectCompactViewport())

  useEffect(() => {
    return createMediaQueryListener(COMPACT_VIEWPORT_QUERY, setIsCompactViewport)
  }, [])

  const canAnimate = !effectiveDisabled
  const useJsFallback = canAnimate && !supportsScrollTimeline && isCompactViewport
  const stackModeClass = canAnimate ? 'sliding-stack--interactive' : 'sliding-stack--static'

  const initialAnnouncement = items.length ? `Slide 1 of ${items.length}: ${items[0].title}` : ''

  const [timelineState, setTimelineState] = useState<TimelineState>({
    windows: [],
    duration: DEFAULT_STACK_DURATION,
    tail: DEFAULT_STACK_TAIL,
    step: DEFAULT_STACK_STEP,
    tabOffsets: [],
    tabClearance: DEFAULT_TAB_CLEARANCE,
    scales: [],
    translateStart: 0,
    targetHeight: 0,
  })

  // Measure the header and set --stack-top so pinning starts exactly under the header
  useLayoutEffect(() => {
    if (!canAnimate) return
    const container = containerRef.current
    if (!container) return

    const header = document.querySelector<HTMLElement>('.site-header')
    if (!header) return

    const apply = () => {
      const rect = header.getBoundingClientRect()
      const topPx = Math.max(0, Math.round(rect.height + STACK_TOP_EXTRA_PX))
      container.style.setProperty('--stack-top', `${topPx}px`)
    }

    apply()

    const ro = new ResizeObserver(() => apply())
    ro.observe(header)
    window.addEventListener('resize', apply)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', apply)
    }
  }, [canAnimate])

  const renderCardContent = (item: SlidingStackItem, ctaLabel = 'Learn more') => {
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
    } else if (SCROLL_STORY_ENABLED) {
      // Show a non-navigating placeholder CTA while links are being finalized.
      cta = (
        <a
          className="inline-flex cursor-default items-center gap-2 text-sm font-semibold text-telcoin-accent/60"
          href="#"
          onClick={(e) => e.preventDefault()}
          aria-disabled
        >
          {ctaLabel}
          <span aria-hidden>{CTA_ARROW}</span>
        </a>
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
          <h3 className="sliding-stack__title -mt-4 sm:-mt-4 lg:-mt-5 mb-3 sm:mb-4 lg:mb-6 text-5xl leading-tight font-semibold text-telcoin-ink sm:text-6xl lg:text-[4.8rem]">
            {item.title}
          </h3>
          <div className="text-xl text-telcoin-ink-muted sm:text-[1.35rem] lg:text-2xl leading-relaxed">{item.body}</div>
        </div>
      </>
    )
  }

  const cssVars = useMemo(() => {
    // Container height calculation:
    // - Use animated card count (3) as base multiplier for natural scroll feel
    // - Card 4 spans 73.5% → 100% (26.5% of timeline) and needs extra distance
    // - Add tail for final card lock time AFTER card 4 completes
    const parsedDuration = parseFloat(timelineState.duration) || 36
    const parsedTail = parseFloat(timelineState.tail) || 220
    const animatedCards = Math.max(items.length - 1, 1) // Cards 2, 3, 4 = 3
    // Increase multiplier further to ensure card 4 fully locks before viewport moves
    // animatedCards × 7 = 21× multiplier (up from 18×)
    const calculatedHeight = parsedDuration * (animatedCards * 7) + parsedTail
    
    // Express as count × duration + tail for CSS formula
    const effectiveCount = (calculatedHeight - parsedTail) / parsedDuration
    
    const vars: CSSProperties &
      Record<
        '--stack-count' | '--stack-duration' | '--stack-tail' | '--stack-step' | '--stack-tab-clearance' | '--stack-translate-start',
        string
      > = {
      '--stack-count': String(effectiveCount.toFixed(2)),
      '--stack-duration': timelineState.duration,
      '--stack-tail': timelineState.tail,
      '--stack-step': timelineState.step,
      '--stack-tab-clearance': timelineState.tabClearance,
      '--stack-translate-start': `${timelineState.translateStart.toFixed(2)}px`,
    }
    return vars
  }, [
    items.length,
    timelineState.duration,
    timelineState.step,
    timelineState.tail,
    timelineState.tabClearance,
    timelineState.translateStart,
  ])

  const activeIndex = useMemo(
    () => calculateActiveIndex(progress, timelineState.windows, items.length),
    [items.length, progress, timelineState.windows]
  )

  const cardCount = Math.max(items.length, 1)
  const animatedCount = Math.max(cardCount - 1, 1)
  const windowSize = 100 / animatedCount

  const computeTimeline = useCallback(() => {
    if (typeof window === 'undefined') return
    const cards = cardRefs.current.slice(0, items.length).filter(Boolean) as HTMLElement[]
    if (!cards.length) return

    const container = containerRef.current
    const viewportHeight = window.innerHeight || document.documentElement?.clientHeight || 1

    const tabHeights = cards.map((card) => {
      const tab = card.querySelector<HTMLElement>('.sliding-stack__tab')
      return tab ? tab.offsetHeight : 0
    })
    const animatedTabHeights = tabHeights.slice(1)
    const nonZeroTabs = animatedTabHeights.filter((value) => value > 0)
    const maxTabHeight = nonZeroTabs.length ? Math.max(...nonZeroTabs) : 0
    const avgTabHeight = animatedTabHeights.length
      ? animatedTabHeights.reduce((sum, value) => sum + value, 0) / animatedTabHeights.length
      : 0
    const baseTabHeight = maxTabHeight || avgTabHeight || 70
    const desiredStep = Math.min(96, Math.max(48, baseTabHeight * 0.9))

    const computedStyles = container ? window.getComputedStyle(container) : null
    const stackTopPx = parsePx(computedStyles?.getPropertyValue('--stack-top'))
    const stackBottomPx = parsePx(computedStyles?.getPropertyValue('--stack-bottom'))
    const availableHeight = Math.max(320, viewportHeight - stackTopPx - stackBottomPx)
    const targetHeight = Math.max(availableHeight - SAFE_PADDING_PX, availableHeight * 0.92)
    const translateStartPx = Math.max(0, viewportHeight - stackTopPx - stackBottomPx)


    // CRITICAL FIX: Card 1 is static and doesn't animate. Only calculate windows for
    // the ANIMATED cards (2, 3, 4). This gives them more timeline space.
    const animatedCardCount = Math.max(items.length - 1, 1)
    let windows = calculateTimelineWindows({
      itemCount: animatedCardCount,
      minWindowSpan: MIN_WINDOW_SPAN,
      initialDelayPct: INITIAL_DELAY_PCT,
      windowGapPct: WINDOW_GAP_PCT,
      lastCardHoldPct: LAST_CARD_HOLD_PCT,
      targetWindowPct: TARGET_WINDOW_PCT,
    })
    
    // Prepend a dummy window for card 1 (static, no animation)
    windows = [{ start: 0, end: 0 }, ...windows]

    // Shift windows for animated cards (index >= 1) by an additional delay so
    // the second card waits until the first is fully pinned under the header.
    windows = windows.map((w, i) => {
      if (i === 0) return w
      const start = Math.min(100, w.start + PIN_LOCK_DELAY_PCT)
      const end = Math.min(100, Math.max(start + MIN_WINDOW_SPAN, w.end + PIN_LOCK_DELAY_PCT))
      return { start, end }
    })

    // Enforce strict sequential windows with explicit dwell so each card locks visibly
    // before the next begins. This keeps the stacked formation until the final card.
    let prevEnd = windows[0]?.end ?? 0
    const enforced: TimelineWindow[] = windows.map((w, i) => {
      if (i === 0) {
        prevEnd = w.end
        return w
      }
      const minStart = prevEnd + WINDOW_GAP_PCT + CARD_DWELL_PCT
      const start = Math.min(100, Math.max(w.start, minStart))
      // Each card's animation window, followed by dwell where it's locked
      const animEnd = Math.max(start + MIN_WINDOW_SPAN, w.end)
      const end = Math.min(100, animEnd + CARD_DWELL_PCT)
      prevEnd = end
      return { start, end }
    })
    windows = enforced

    // Give card 4 a similar span to other cards (not stretched to 100%)
    // This ensures consistent scroll time across all animated cards
    if (windows.length > 3) {
      const lastAnimated = 3 // Card 4 is at index 3 in windows array
      const card4Start = windows[lastAnimated].start
      // Use same span as card 2 for consistency (around 16-19%)
      const card2Span = windows[1] ? windows[1].end - windows[1].start : 18
      const card4End = Math.min(85, card4Start + card2Span) // Cap at 85% to leave dwell space
      windows[lastAnimated] = { start: card4Start, end: card4End }
    }

    // Derive a longer, smoother runway per animated card based on available height
    const durationBase = (targetHeight / Math.max(viewportHeight, 1)) * 24
    const clampMin = isCompactViewport ? DURATION_MIN_VH_MOBILE : DURATION_MIN_VH_DESKTOP
    const clampMax = isCompactViewport ? DURATION_MAX_VH_MOBILE : DURATION_MAX_VH_DESKTOP
    let durationVh = Math.max(clampMin, Math.min(clampMax, durationBase))
    // Slow down per-card progress: require roughly 3× scroll distance.
    // Account for total animated cards (items.length - 1) to size the container properly.
    const animatedCards = Math.max(items.length - 1, 1)
    durationVh = durationVh * 3.2
    if (isCompactViewport) durationVh = Math.min(DURATION_MAX_VH_MOBILE, durationVh * MOBILE_FALLBACK_SLOWDOWN)

    // Tail ensures the last card fully locks and dwells before unpinning.
    // Increase tail to ensure card 4 completes before viewport moves
    const tailMult = isCompactViewport ? TAIL_MULTIPLIER_MOBILE : TAIL_MULTIPLIER_DESKTOP
    const proportionalTail = durationVh * animatedCards * 0.30
    const absoluteTail = isCompactViewport ? 280 : 260
    const tailVh = Math.max(proportionalTail, durationVh * tailMult, absoluteTail)
    const tabClearance = Math.max(baseTabHeight * 1.05, 72)

    const tabOffsets = tabHeights.map((value) => (value > 0 ? value : tabClearance))

    // Keep all cards the same visual width; avoid per-card downscaling.
    const scales = cards.map(() => 1)

    const nextState: TimelineState = {
      windows,
      duration: `${durationVh.toFixed(2)}vh`,
      tail: `${tailVh.toFixed(2)}vh`,
      step: `${Math.round(desiredStep)}px`,
      tabOffsets,
      tabClearance: `${tabClearance.toFixed(2)}px`,
      scales,
      translateStart: translateStartPx,
      targetHeight,
    }

    // Dev logging to debug timeline
    // @ts-ignore - process.env is available in Vite build
    if (process.env.NODE_ENV === 'development' && windows.length > 0) {
      console.log('SlidingStack Timeline:')
      windows.forEach((w, i) => {
        console.log(`  Card ${i + 1}: ${w.start.toFixed(1)}% → ${w.end.toFixed(1)}%`)
      })
      console.log(`  Duration: ${durationVh.toFixed(2)}vh, Tail: ${tailVh.toFixed(2)}vh`)
      // Calculate using the same formula as cssVars
      const calculatedHeight = durationVh * (animatedCards * 7) + tailVh
      const effectiveMultiplier = (calculatedHeight - tailVh) / durationVh
      console.log(`  Container height: ${animatedCards} cards × 7 = ${effectiveMultiplier.toFixed(1)} × ${durationVh.toFixed(2)} + ${tailVh.toFixed(2)} = ${calculatedHeight.toFixed(0)}vh`)
      // Show physical scroll distance for each card's window
      const card2Span = windows[1] ? windows[1].end - windows[1].start : 0
      const card3Span = windows[2] ? windows[2].end - windows[2].start : 0
      const card4Span = windows[3] ? windows[3].end - windows[3].start : 0
      console.log(`  Card scroll distances: Card 2: ${(calculatedHeight * card2Span / 100).toFixed(0)}vh | Card 3: ${(calculatedHeight * card3Span / 100).toFixed(0)}vh | Card 4: ${(calculatedHeight * card4Span / 100).toFixed(0)}vh`)
    }

    setTimelineState((prev) => (timelineStatesEqual(prev, nextState) ? prev : nextState))
  }, [items, isCompactViewport])

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    computeTimeline()

    const handleResize = () => computeTimeline()
    window.addEventListener('resize', handleResize)

    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => computeTimeline())
      cardRefs.current.slice(0, items.length).forEach((card) => {
        if (card) observer?.observe(card)
      })
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      observer?.disconnect()
    }
  }, [computeTimeline, items.length])

  cardRefs.current.length = items.length

  const progressPct = progress * 100

  const cards = items.map((item, index) => {
    const ctaLabel = item.ctaLabel ?? 'Learn more'
    const zIndex = index + 1
    const fallback = calculateFallbackWindow(index, windowSize, INITIAL_DELAY_PCT)
    const window = timelineState.windows[index] ?? fallback
    const start = clampPercent(window.start)
    let end = clampPercent(window.end)
    if (index !== 0 && end - start < MIN_WINDOW_SPAN) {
      end = Math.min(100, start + MIN_WINDOW_SPAN)
    }
    const fallbackClearance = parseUnit(timelineState.tabClearance)
    const tabOffsetRaw = timelineState.tabOffsets[index] ?? fallbackClearance
    const tabOffset = Math.max(tabOffsetRaw, fallbackClearance)
    const tabPadding = tabOffset + 12
    const finalScale = 1
    const initialScale = index === 0 ? 1 : 0.98125

    const timingVars: CSSProperties &
      Record<'--stack-start' | '--stack-end' | '--card-scale-initial' | '--card-scale-final' | '--card-tab-offset', string | number> = {
      '--stack-start': `${start.toFixed(3)}%`,
      '--stack-end': `${end.toFixed(3)}%`,
      '--card-scale-initial': initialScale,
      '--card-scale-final': finalScale,
      '--card-tab-offset': `${tabPadding.toFixed(2)}px`,
    }

    const cardProgressValue = calculateCardProgress(index, progressPct, { start, end }, INITIAL_DELAY_PCT)

    // Using linear progress for consistent, predictable card animation timing
    const easedProgress = cardProgressValue

    // Defer body copy reveal so only the tab + title are visible at the start.
    // For cards 3-4, show body earlier since their windows start later in the timeline.
    const appearStart = index === 0 ? 0.55 : index >= 2 ? 0.20 : 0.35
    const appearEnd = 0.85
    const bodyProgress = Math.max(0, Math.min(1, (easedProgress - appearStart) / Math.max(0.0001, appearEnd - appearStart)))

    const palette = CARD_PALETTES[index % CARD_PALETTES.length]
    const isActive = canAnimate && index === activeIndex

    const cardStyle: CSSProperties & Record<'--card-bg', string> = {
      zIndex,
      ...timingVars,
      '--card-bg': palette,
    }

    if (canAnimate) {
      // Hide cards 2..n until their window begins so they don't peek in early.
      // Use a small buffer to prevent flash.
      if (index >= 1 && progressPct < start - 1) {
        cardStyle.visibility = 'hidden'
      }
      cardStyle.top = `calc(var(--stack-step) * ${index})`
      // Enforce uniform height so widths/scale remain consistent visually
      if (timelineState.targetHeight > 0) {
        cardStyle.minHeight = `${timelineState.targetHeight.toFixed(2)}px`
      }
    }

    if (useJsFallback) {
      const translateStart = timelineState.translateStart || 0
      const translateY = index === 0 ? 0 : translateStart * (1 - easedProgress)
      const scaleRange = finalScale - initialScale
      const fallbackScale = initialScale + scaleRange * easedProgress
      cardStyle.transform = `translateY(${translateY.toFixed(3)}px) scale(${fallbackScale.toFixed(4)})`
      cardStyle.opacity = 1
      cardStyle.pointerEvents = isActive ? 'auto' : 'none'
    }

    return (
      <ColorMorphCard
        key={item.id}
        id={item.id}
        progress={useJsFallback ? cardProgressValue : 1}
        className={cn(
          'sliding-stack__card pt-0 pb-10 sm:pb-12 lg:pb-14',
          cardClassName,
          isActive ? 'is-active' : undefined,
        )}
        ref={(node) => {
          cardRefs.current[index] = node
        }}
        style={cardStyle}
      >
        <div className="sliding-stack__tab">
          <span className="sliding-stack__tab-text">{item.tabLabel ?? item.title}</span>
        </div>
        <div
          className="sliding-stack__body px-6 sm:px-8 lg:px-10"
          style={useJsFallback ? { opacity: bodyProgress, transform: `translateY(${(1 - bodyProgress) * 12}px)`, transition: 'opacity 120ms linear, transform 180ms ease-out' } : undefined}
        >
          {renderCardContent(item, ctaLabel)}
        </div>
      </ColorMorphCard>
    )
  })

  return (
    <div
      ref={containerRef}
      className={cn('sliding-stack', stackModeClass, className)}
      data-sliding-stack=""
      data-scroll-story={canAnimate ? '' : undefined}
      data-js-fallback={useJsFallback ? '' : undefined}
      data-prefers-reduced-motion={prefersReducedMotion ? '' : undefined}
      data-active-index={activeIndex}
      style={{
        // Reduce gutters so cards appear ~20% wider overall.
        ...baseStackStyle,
        ...cssVars,
        ...style,
      }}
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
