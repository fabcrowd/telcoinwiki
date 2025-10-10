import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'

import { useScrollTimeline } from './useScrollTimeline'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useStageTimeline } from './useStageTimeline'
import { useMediaQuery } from './useMediaQuery'
import { lerp } from '../utils/interpolate'
import { clearStageVariables, setStageVariables, type StageVariableUpdates } from '../utils/stageHost'

interface StageStop {
  hue: number
  accentHue?: number
  overlayOpacity?: number
  spotOpacity?: number
  cardOverlayOpacity?: number
  cardBorderOpacity?: number
  cardShadowOpacity?: number
}

interface NormalizedStageStop {
  hue: number
  accentHue: number
  overlayOpacity: number
  spotOpacity: number
  cardOverlayOpacity: number
  cardBorderOpacity: number
  cardShadowOpacity: number
}

const STAGE_DEFAULTS: NormalizedStageStop = {
  hue: 220,
  accentHue: 268,
  overlayOpacity: 0.38,
  spotOpacity: 0.28,
  cardOverlayOpacity: 0.32,
  cardBorderOpacity: 0.38,
  cardShadowOpacity: 0.26,
}

function normalizeStageStop(stop: StageStop): NormalizedStageStop {
  return {
    hue: stop.hue,
    accentHue: stop.accentHue ?? STAGE_DEFAULTS.accentHue,
    overlayOpacity: stop.overlayOpacity ?? STAGE_DEFAULTS.overlayOpacity,
    spotOpacity: stop.spotOpacity ?? STAGE_DEFAULTS.spotOpacity,
    cardOverlayOpacity: stop.cardOverlayOpacity ?? STAGE_DEFAULTS.cardOverlayOpacity,
    cardBorderOpacity: stop.cardBorderOpacity ?? STAGE_DEFAULTS.cardBorderOpacity,
    cardShadowOpacity: stop.cardShadowOpacity ?? STAGE_DEFAULTS.cardShadowOpacity,
  }
}

function interpolateStageStops(start: NormalizedStageStop, end: NormalizedStageStop, progress: number): NormalizedStageStop {
  return {
    hue: lerp(start.hue, end.hue, progress),
    accentHue: lerp(start.accentHue, end.accentHue, progress),
    overlayOpacity: lerp(start.overlayOpacity, end.overlayOpacity, progress),
    spotOpacity: lerp(start.spotOpacity, end.spotOpacity, progress),
    cardOverlayOpacity: lerp(start.cardOverlayOpacity, end.cardOverlayOpacity, progress),
    cardBorderOpacity: lerp(start.cardBorderOpacity, end.cardBorderOpacity, progress),
    cardShadowOpacity: lerp(start.cardShadowOpacity, end.cardShadowOpacity, progress),
  }
}

function stageStopToVariables(stop: NormalizedStageStop): StageVariableUpdates {
  return {
    '--tc-stage-hue': stop.hue.toFixed(2),
    '--tc-stage-accent-hue': stop.accentHue.toFixed(2),
    '--tc-stage-overlay-opacity': stop.overlayOpacity.toFixed(3),
    '--tc-stage-spot-opacity': stop.spotOpacity.toFixed(3),
    '--tc-stage-card-overlay-opacity': stop.cardOverlayOpacity.toFixed(3),
    '--tc-stage-card-border-opacity': stop.cardBorderOpacity.toFixed(3),
    '--tc-stage-card-shadow-opacity': stop.cardShadowOpacity.toFixed(3),
  }
}

const heroStageStops = {
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
} as const

const brokenMoneyStageStops = {
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
} as const

const telcoinModelStageStops = {
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
} as const

const engineStageStops = {
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
} as const

const experienceStageStops = {
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
} as const

const learnMoreStageStops = {
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
} as const

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
  stageStops: typeof heroStageStops,
  options?: StackSectionOptions,
): () => SlidingSectionState {
  return function useHomeStackSection(): SlidingSectionState {
    const sectionRef = useRef<HTMLElement | null>(null)
    const systemPrefersReducedMotion = usePrefersReducedMotion()
    const isCompact = useMediaQuery('(max-width: 62rem)')
    const isHandheld = useMediaQuery('(max-width: 40rem)')
    const prefersReducedMotion = systemPrefersReducedMotion || isHandheld
    const interactive = !prefersReducedMotion

    const fromStop = normalizeStageStop(stageStops.from)
    const toStop = normalizeStageStop(stageStops.to)

    const [stackProgress, setStackProgress] = useState<number>(() => (interactive ? 0 : 1))

    useEffect(() => {
      setStackProgress(interactive ? 0 : 1)
    }, [interactive])

    const stageStart = isHandheld ? 'top 86%' : isCompact ? 'top 80%' : 'top 76%'
    const stageEnd = isHandheld ? 'bottom 18%' : isCompact ? 'bottom 24%' : 'bottom 30%'
    const animationStart = isHandheld ? 'top 92%' : isCompact ? 'top 86%' : 'top 80%'
    const animationEnd = isHandheld ? 'bottom 20%' : isCompact ? 'bottom 24%' : 'bottom 24%'
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
