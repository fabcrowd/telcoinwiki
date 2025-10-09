import { useMemo, useRef } from 'react'
import type { CSSProperties, RefObject } from 'react'

import { useScrollTimeline } from './useScrollTimeline'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useStageTimeline } from './useStageTimeline'
import { useMediaQuery } from './useMediaQuery'

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
<<<<<<< HEAD
    const prefersReducedMotion = usePrefersReducedMotion()
    const isCompact = useMediaQuery('(max-width: 62rem)')
    const isHandheld = useMediaQuery('(max-width: 40rem)')
=======
    const systemPrefersReducedMotion = usePrefersReducedMotion()
    const isCompact = useMediaQuery('(max-width: 62rem)')
    const isHandheld = useMediaQuery('(max-width: 40rem)')
    const prefersReducedMotion = systemPrefersReducedMotion || isHandheld
>>>>>>> origin/main

    const stageStart = isHandheld ? 'top 86%' : isCompact ? 'top 80%' : 'top 76%'
    const stageEnd = isHandheld ? 'bottom 18%' : isCompact ? 'bottom 24%' : 'bottom 30%'
    const animationStart = isHandheld ? 'top 92%' : isCompact ? 'top 86%' : 'top 80%'
    const animationEnd = isHandheld ? 'bottom 20%' : isCompact ? 'bottom 24%' : 'bottom 24%'
<<<<<<< HEAD
=======
    const animationToggleActions = isHandheld ? 'play none none none' : undefined

    const animationScrollTrigger = {
      start: animationStart,
      end: animationEnd,
      ...(options?.animationScrollTrigger ?? {}),
      ...(animationToggleActions && !options?.animationScrollTrigger?.toggleActions
        ? { toggleActions: animationToggleActions }
        : {}),
    }
>>>>>>> origin/main

    const stageProgressRaw = useStageTimeline({
      target: sectionRef,
      from: stageStops.from,
      to: stageStops.to,
      scrollTrigger: {
        start: stageStart,
        end: stageEnd,
        ...(options?.stageScrollTrigger ?? {}),
      },
      prefersReducedMotion,
    })
    const stageProgress = prefersReducedMotion ? 1 : stageProgressRaw

    const introStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
    const stackStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])

    useCinematicSection(
      prefersReducedMotion,
      sectionRef,
      (timeline) => {
        timeline.fromTo(
          '[data-section-intro]',
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          0,
        )

        timeline.fromTo(
          '[data-sliding-stack]',
          { autoAlpha: 0, y: 52 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          0.18,
        )
      },
<<<<<<< HEAD
      {
        start: animationStart,
        end: animationEnd,
        ...(options?.animationScrollTrigger ?? {}),
      },
=======
      animationScrollTrigger,
>>>>>>> origin/main
    )

    return { sectionRef, prefersReducedMotion, stageProgress, introStyle, stackStyle }
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

  const copyStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])

  useCinematicSection(prefersReducedMotion, sectionRef, (timeline) => {
    timeline.fromTo(
      '[data-hero-copy]',
      { autoAlpha: 0, y: 48 },
      { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power2.out' },
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
