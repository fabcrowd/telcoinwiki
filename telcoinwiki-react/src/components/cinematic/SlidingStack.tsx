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

const baseStackStyle = {
  '--stack-gutter': 'clamp(6px, 0.6vw, 12px)',
  '--stack-top': 'calc(var(--header-height) + 2vh)',
  '--stack-bottom': '0vh',
  '--stack-translate-start': 'calc(100vh - var(--stack-top) - var(--stack-bottom))',
  '--stack-tail': '320vh',
  '--last-card-translate-end': '12vh',
  '--stack-step': '0px',
} satisfies CSSProperties

const DEFAULT_STACK_DURATION = '80vh'
const DEFAULT_STACK_TAIL = baseStackStyle['--stack-tail'] as string
const DEFAULT_STACK_STEP = '60px'
const DEFAULT_TAB_CLEARANCE = '72px'
const MIN_WINDOW_SPAN = 5
const EPSILON = 0.45

type TimelineWindow = { start: number; end: number }

interface TimelineState {
  windows: TimelineWindow[]
  duration: string
  tail: string
  step: string
  tabOffsets: number[]
  tabClearance: string
}

const approx = (a: number, b: number, epsilon = EPSILON) => Math.abs(a - b) <= epsilon

const parseUnit = (value: string) => Number.parseFloat(value) || 0

const timelineStatesEqual = (a: TimelineState, b: TimelineState) => {
  if (a.windows.length !== b.windows.length) return false
  if (!approx(parseUnit(a.duration), parseUnit(b.duration))) return false
  if (!approx(parseUnit(a.tail), parseUnit(b.tail))) return false
  if (!approx(parseUnit(a.step), parseUnit(b.step))) return false
  if (!approx(parseUnit(a.tabClearance), parseUnit(b.tabClearance))) return false
  if (a.tabOffsets.length !== b.tabOffsets.length) return false
  for (let i = 0; i < a.windows.length; i += 1) {
    if (!approx(a.windows[i]?.start ?? 0, b.windows[i]?.start ?? 0)) return false
    if (!approx(a.windows[i]?.end ?? 0, b.windows[i]?.end ?? 0)) return false
  }
  for (let i = 0; i < a.tabOffsets.length; i += 1) {
    if (!approx(a.tabOffsets[i] ?? 0, b.tabOffsets[i] ?? 0)) return false
  }
  return true
}

const fallbackWindow = (index: number, windowSize: number): TimelineWindow => {
  if (index === 0) return { start: 0, end: 0 }
  const start = (index - 1) * windowSize
  const end = Math.min(100, index * windowSize)
  return { start, end }
}

const clampPercent = (value: number) => Math.max(0, Math.min(100, value))

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
  })

  useEffect(() => {
    if (!onProgressChange) return
    if (effectiveDisabled) {
      onProgressChange(1)
      return
    }
    onProgressChange(progress)
  }, [effectiveDisabled, onProgressChange, progress])

  const initialAnnouncement = items.length ? `Slide 1 of ${items.length}: ${items[0].title}` : ''

  const [timelineState, setTimelineState] = useState<TimelineState>({
    windows: [],
    duration: DEFAULT_STACK_DURATION,
    tail: DEFAULT_STACK_TAIL,
    step: DEFAULT_STACK_STEP,
    tabOffsets: [],
    tabClearance: DEFAULT_TAB_CLEARANCE,
  })

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
        {cta}
      </>
    )
  }

  const cssVars = useMemo(() => {
    const animatedCount = Math.max((items.length || 1) - 1, 1)
    const vars: CSSProperties &
      Record<'--stack-count' | '--stack-duration' | '--stack-tail' | '--stack-step' | '--stack-tab-clearance', string> = {
      '--stack-count': String(animatedCount),
      '--stack-duration': timelineState.duration,
      '--stack-tail': timelineState.tail,
      '--stack-step': timelineState.step,
      '--stack-tab-clearance': timelineState.tabClearance,
    }
    return vars
  }, [items.length, timelineState.duration, timelineState.step, timelineState.tail, timelineState.tabClearance])

  const activeIndex = useMemo(() => {
    if (items.length <= 1) return 0
    if (progress >= 1) return items.length - 1
    return Math.min(items.length - 1, Math.floor(progress * items.length))
  }, [items.length, progress])

  const cardCount = Math.max(items.length, 1)
  const animatedCount = Math.max(cardCount - 1, 1)
  const windowSize = 100 / animatedCount

  const computeTimeline = useCallback(() => {
    if (typeof window === 'undefined') return
    const cards = cardRefs.current.slice(0, items.length).filter(Boolean) as HTMLElement[]
    if (!cards.length) return

    const viewportHeight = window.innerHeight || document.documentElement?.clientHeight || 1
    const heights = cards.map((card) => Math.max(card.scrollHeight, card.offsetHeight))
    const animatedHeights = heights.slice(1)
    const totalAnimated = animatedHeights.reduce((sum, value) => sum + value, 0)

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

    let accumulator = 0
    const windows: TimelineWindow[] = items.map((_, index) => {
      if (index === 0 || totalAnimated <= 0) {
        return fallbackWindow(index, windowSize)
      }
      const share = animatedHeights[index - 1] / totalAnimated
      const start = accumulator * 100
      accumulator += share
      const end = accumulator * 100
      return { start, end }
    })

    if (windows.length > 0) {
      const lastIndex = windows.length - 1
      windows[lastIndex] = {
        start: windows[lastIndex].start,
        end: 100,
      }
    }

    const avgAnimatedHeight =
      totalAnimated > 0 ? totalAnimated / Math.max(animatedHeights.length, 1) : heights[0] || viewportHeight
    const durationBase =
      totalAnimated > 0 ? (avgAnimatedHeight / viewportHeight) * 110 : parseUnit(DEFAULT_STACK_DURATION)
    const durationVh = Math.max(90, Math.min(150, durationBase))
    const lastHeight = heights[heights.length - 1] || avgAnimatedHeight || viewportHeight
    const tailBase = (lastHeight / viewportHeight) * 140
    const tailVh = Math.min(320, Math.max(durationVh * 1.2, tailBase, 140))
    const tabClearance = Math.max(baseTabHeight * 1.05, 72)

    const tabOffsets = tabHeights.map((value) => (value > 0 ? value : tabClearance))

    const nextState: TimelineState = {
      windows,
      duration: `${durationVh.toFixed(2)}vh`,
      tail: `${tailVh.toFixed(2)}vh`,
      step: `${Math.round(desiredStep)}px`,
      tabOffsets,
      tabClearance: `${tabClearance.toFixed(2)}px`,
    }

    setTimelineState((prev) => (timelineStatesEqual(prev, nextState) ? prev : nextState))
  }, [items.length, windowSize])

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

  const cards = items.map((item, index) => {
    const ctaLabel = item.ctaLabel ?? 'Learn more'
    const zIndex = index + 1
    const fallback = fallbackWindow(index, windowSize)
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

    const timingVars: CSSProperties & Record<'--stack-start' | '--stack-end', string> = {
      '--stack-start': `${start.toFixed(3)}%`,
      '--stack-end': `${end.toFixed(3)}%`,
    }

    return (
      <ColorMorphCard
        key={item.id}
        id={item.id}
        progress={1}
        className={cn('sliding-stack__card pt-0 pb-10 sm:pb-12 lg:pb-14', cardClassName)}
        ref={(node) => {
          cardRefs.current[index] = node
        }}
        style={{ zIndex, ...timingVars, '--card-tab-offset': `${tabPadding.toFixed(2)}px` }}
      >
        <div className="sliding-stack__tab">
          <span className="sliding-stack__tab-text">{item.tabLabel ?? item.title}</span>
        </div>
        <div className="sliding-stack__body px-6 sm:px-8 lg:px-10">{renderCardContent(item, ctaLabel)}</div>
      </ColorMorphCard>
    )
  })

  return (
    <div
      ref={containerRef}
      className={cn('sliding-stack sliding-stack--static', className)}
      data-sliding-stack=""
      data-scroll-story={SCROLL_STORY_ENABLED && !prefersReducedMotion ? '' : undefined}
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
