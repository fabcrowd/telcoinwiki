import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'

import { useScrollTimeline } from './useScrollTimeline'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useStageTimeline } from './useStageTimeline'
import { useMediaQuery } from './useMediaQuery'

interface StageStop {
  hue: number
  accentHue?: number
  overlayOpacity?: number
  spotOpacity?: number
  cardOverlayOpacity?: number
  cardBorderOpacity?: number
  cardShadowOpacity?: number
}

interface StageStops {
  from: StageStop
  to: StageStop
}

const heroStageStops: StageStops = {
  from: {
    hue: 220,
    accentHue: 268,
    overlayOpacity: 0.32,
    spotOpacity: 0.22,
    cardOverlayOpacity: 0.34,
    cardBorderOpacity: 0.42,
    cardShadowOpacity: 0.28,
  },
  to: {
    hue: 214,
    accentHue: 284,
    overlayOpacity: 0.55,
    spotOpacity: 0.42,
    cardOverlayOpacity: 0.45,
    cardBorderOpacity: 0.52,
    cardShadowOpacity: 0.34,
  },
}

const brokenMoneyStageStops: StageStops = {
  from: {
    ...heroStageStops.to,
  },
  to: {
    hue: 244,
    accentHue: 296,
    overlayOpacity: 0.5,
    spotOpacity: 0.4,
    cardOverlayOpacity: 0.44,
    cardBorderOpacity: 0.52,
    cardShadowOpacity: 0.35,
  },
}

const telcoinModelStageStops: StageStops = {
  from: {
    ...brokenMoneyStageStops.to,
  },
  to: {
    hue: 266,
    accentHue: 312,
    overlayOpacity: 0.54,
    spotOpacity: 0.42,
    cardOverlayOpacity: 0.46,
    cardBorderOpacity: 0.55,
    cardShadowOpacity: 0.36,
  },
}

const engineStageStops: StageStops = {
  from: {
    ...telcoinModelStageStops.to,
  },
  to: {
    hue: 214,
    accentHue: 258,
    overlayOpacity: 0.49,
    spotOpacity: 0.38,
    cardOverlayOpacity: 0.43,
    cardBorderOpacity: 0.5,
    cardShadowOpacity: 0.33,
  },
}

const experienceStageStops: StageStops = {
  from: {
    ...engineStageStops.to,
  },
  to: {
    hue: 272,
    accentHue: 318,
    overlayOpacity: 0.56,
    spotOpacity: 0.44,
    cardOverlayOpacity: 0.48,
    cardBorderOpacity: 0.58,
    cardShadowOpacity: 0.38,
  },
}

const learnMoreStageStops: StageStops = {
  from: {
    ...experienceStageStops.to,
  },
  to: {
    hue: 236,
    accentHue: 286,
    overlayOpacity: 0.52,
    spotOpacity: 0.41,
    cardOverlayOpacity: 0.45,
    cardBorderOpacity: 0.53,
    cardShadowOpacity: 0.35,
  },
}

type TimelineCreator = Parameters<typeof useScrollTimeline>[0]['create']

function createFadeInStyle(prefersReducedMotion: boolean): CSSProperties | undefined {
  return prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined
}

interface BaseSectionState {
  sectionRef: RefObject<HTMLElement>
  prefersReducedMotion: boolean
}

interface HeroSectionState extends BaseSectionState {
  overlayStyle: CSSProperties | undefined
  copyStyle: CSSProperties | undefined
  stageProgress: number
}

interface SlidingSectionState extends BaseSectionState {
  introStyle: CSSProperties | undefined
  stackStyle: CSSProperties | undefined
  stageProgress: number
  onStackProgress?: (value: number) => void
  stickyStyle: CSSProperties | undefined
}

function useCinematicSection(
  prefersReducedMotion: boolean,
  sectionRef: RefObject<HTMLElement>,
  create: TimelineCreator,
  options?: Parameters<typeof useScrollTimeline>[0]['scrollTrigger'],
) {
  useScrollTimeline({
    target: prefersReducedMotion ? null : sectionRef,
    create,
    scrollTrigger: options,
  })
}

interface StackSectionOptions {
  stageScrollTrigger?: Parameters<typeof useStageTimeline>[0]['scrollTrigger']
  animationScrollTrigger?: Parameters<typeof useScrollTimeline>[0]['scrollTrigger']
}

function createStackSectionHook(
  stageStops: StageStops,
  options?: StackSectionOptions,
): () => SlidingSectionState {
  return function useHomeStackSection(): SlidingSectionState {
    const sectionRef = useRef<HTMLElement | null>(null)
    const systemPrefersReducedMotion = usePrefersReducedMotion()
    const isCompact = useMediaQuery('(max-width: 62rem)')
    const isHandheld = useMediaQuery('(max-width: 40rem)')
    const prefersReducedMotion = systemPrefersReducedMotion || isHandheld
    const interactive = !prefersReducedMotion

    const [stackProgress, setStackProgress] = useState<number>(() => (interactive ? 0 : 1))

    useEffect(() => {
      setStackProgress(interactive ? 0 : 1)
    }, [interactive])

    const stageStart = isHandheld ? 'top 78%' : isCompact ? 'top 70%' : 'top 64%'
    const stageEnd = isHandheld ? 'bottom 10%' : isCompact ? 'bottom 14%' : 'bottom 18%'
    const animationStart = isHandheld ? 'top 88%' : isCompact ? 'top 80%' : 'top 74%'
    const animationEnd = isHandheld ? 'bottom 8%' : isCompact ? 'bottom 12%' : 'bottom 14%'
    const animationScrollTrigger = {
      start: animationStart,
      end: animationEnd,
      ...(options?.animationScrollTrigger ?? {}),
    }

    if (!animationScrollTrigger.toggleActions && isHandheld) {
      animationScrollTrigger.toggleActions = 'play none none none'
    }

    const stageProgressRaw = useStageTimeline({
      target: interactive ? null : sectionRef,
      from: stageStops.from,
      to: stageStops.to,
      scrollTrigger: interactive
        ? undefined
        : {
            start: stageStart,
            end: stageEnd,
            ...(options?.stageScrollTrigger ?? {}),
          },
      prefersReducedMotion,
    })
    const stageProgress = interactive ? stackProgress : prefersReducedMotion ? 1 : stageProgressRaw

    const introStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
    const stackStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
    const stickyStyle = useMemo(() => {
      if (!interactive) {
        return undefined
      }

      const clamped = Math.max(0, Math.min(1, stackProgress))
      const ENTRY_THRESHOLD = 0.24
      const EXIT_THRESHOLD = 0.76

      const smooth = (value: number) => value * value * (3 - 2 * value)

      const enterPhase = ENTRY_THRESHOLD <= 0 ? 1 : Math.min(Math.max(clamped / ENTRY_THRESHOLD, 0), 1)
      const exitPhase = EXIT_THRESHOLD >= 1 ? 0 : Math.min(
        Math.max((clamped - EXIT_THRESHOLD) / (1 - EXIT_THRESHOLD), 0),
        1,
      )

      const enterEase = smooth(enterPhase)
      const exitEase = smooth(exitPhase)

      const centerWeight = enterEase * (1 - exitEase)

      // Translate from below the viewport, hold centered, then lift out.
      const ENTRY_OFFSET = 130
      const EXIT_OFFSET = 140
      const translateEnter = (1 - enterEase) * ENTRY_OFFSET
      const translateExit = exitEase * EXIT_OFFSET
      const translatePercent = -50 + translateEnter - translateExit

      const revealWeight = centerWeight

      const stickyVars: CSSProperties & Record<'--workspace-center' | '--workspace-reveal', string> = {
        top: '50vh',
        transform: `translate3d(0, ${translatePercent.toFixed(3)}%, 0)`,
        willChange: 'transform',
        '--workspace-center': centerWeight.toFixed(3),
        '--workspace-reveal': revealWeight.toFixed(3),
      }

      return stickyVars
    }, [interactive, stackProgress])

    // PERFORMANCE FIX: Removed CSS variable updates that caused repaints
    // Stage effects are now handled per-component using GPU-accelerated properties

    useCinematicSection(
      prefersReducedMotion,
      sectionRef,
      (timeline) => {
        timeline.fromTo('[data-sliding-stack]', { y: 52 }, { y: 0, duration: 0.9, ease: 'power2.out' }, 0.18)
      },
      animationScrollTrigger,
    )

    return {
      sectionRef,
      prefersReducedMotion,
      stageProgress,
      introStyle,
      stackStyle,
      stickyStyle,
      onStackProgress: interactive ? setStackProgress : undefined,
    }
  }
}

export function useHomeHeroScroll(): HeroSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const stageProgressRaw = useStageTimeline({
    target: sectionRef,
    from: heroStageStops.from,
    to: heroStageStops.to,
    scrollTrigger: { start: 'top top', end: 'bottom 35%' },
    prefersReducedMotion,
  })
  const stageProgress = prefersReducedMotion ? 1 : stageProgressRaw

  const overlayStyle = useMemo(() => {
    if (prefersReducedMotion) {
      return { clipPath: 'inset(0% 0 0 0)', '--cinematic-reveal': '0%' } as CSSProperties
    }

    return {
      clipPath: 'inset(var(--cinematic-reveal, 0%) 0 0 0)',
      '--cinematic-reveal': '65%',
    } as CSSProperties
  }, [prefersReducedMotion])

  // Keep themes consistent: no fade on hero copy
  const copyStyle = useMemo<CSSProperties | undefined>(() => (prefersReducedMotion ? { transform: 'none' } : undefined), [prefersReducedMotion])

  useCinematicSection(prefersReducedMotion, sectionRef, (timeline) => {
    // No fade: slide hero copy into place with y-only motion
    timeline.fromTo(
      '[data-hero-copy]',
      { y: 48 },
      { y: 0, duration: 1, stagger: 0.1, ease: 'power2.out' },
      0,
    )

    timeline.fromTo(
      '[data-hero-overlay]',
      { '--cinematic-reveal': '65%' },
      { '--cinematic-reveal': '0%', duration: 1.2, ease: 'power2.out' },
      0,
    )

    timeline.fromTo(
      '[data-hero-background]',
      { '--color-shift-clip': '65%' },
      { '--color-shift-clip': '0%', duration: 1.2, ease: 'power2.out' },
      0,
    )

  })

  return { sectionRef, prefersReducedMotion, overlayStyle, copyStyle, stageProgress }
}

export const useHomeBrokenMoneyScroll = createStackSectionHook(brokenMoneyStageStops)

export const useHomeTelcoinModelScroll = createStackSectionHook(telcoinModelStageStops)

export const useHomeEngineScroll = createStackSectionHook(engineStageStops)

export const useHomeExperienceScroll = createStackSectionHook(experienceStageStops)

export const useHomeLearnMoreScroll = createStackSectionHook(learnMoreStageStops, {
  animationScrollTrigger: { start: 'top 78%', end: 'bottom 22%' },
  stageScrollTrigger: { start: 'top 78%', end: 'bottom 28%' },
})
