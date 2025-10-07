import { useMemo, useRef } from 'react'
import type { CSSProperties, RefObject } from 'react'

import { useScrollTimeline } from './useScrollTimeline'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useStageTimeline } from './useStageTimeline'

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

const pillarsStageStops = {
  from: {
    ...heroStageStops.to,
  },
  to: {
    hue: 252,
    accentHue: 302,
    overlayOpacity: 0.5,
    spotOpacity: 0.38,
    cardOverlayOpacity: 0.42,
    cardBorderOpacity: 0.5,
    cardShadowOpacity: 0.33,
  },
} as const

const communityStageStops = {
  from: {
    ...pillarsStageStops.to,
  },
  to: {
    hue: 208,
    accentHue: 222,
    overlayOpacity: 0.48,
    spotOpacity: 0.36,
    cardOverlayOpacity: 0.4,
    cardBorderOpacity: 0.48,
    cardShadowOpacity: 0.32,
  },
} as const

const ctaStageStops = {
  from: {
    ...communityStageStops.to,
  },
  to: {
    hue: 260,
    accentHue: 292,
    overlayOpacity: 0.52,
    spotOpacity: 0.42,
    cardOverlayOpacity: 0.46,
    cardBorderOpacity: 0.54,
    cardShadowOpacity: 0.36,
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

interface PillarSectionState extends BaseSectionState {
  cardStyle: CSSProperties | undefined
  stageProgress: number
}

interface CommunitySectionState extends BaseSectionState {
  itemStyle: CSSProperties | undefined
  asideStyle: CSSProperties | undefined
  stageProgress: number
}

interface CtaSectionState extends BaseSectionState {
  copyStyle: CSSProperties | undefined
  panelStyle: CSSProperties | undefined
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

export function useHomeProductPillarsScroll(): PillarSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const stageProgressRaw = useStageTimeline({
    target: sectionRef,
    from: pillarsStageStops.from,
    to: pillarsStageStops.to,
    scrollTrigger: { start: 'top 75%', end: 'bottom 35%' },
    prefersReducedMotion,
  })
  const stageProgress = prefersReducedMotion ? 1 : stageProgressRaw
  const cardStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])

  useCinematicSection(
    prefersReducedMotion,
    sectionRef,
    (timeline) => {
      timeline.fromTo(
        '[data-pillars-card]',
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' },
      )
    },
    { start: 'top 75%', end: 'bottom 25%' },
  )

  return { sectionRef, prefersReducedMotion, cardStyle, stageProgress }
}

export function useHomeCommunityProofScroll(): CommunitySectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const stageProgressRaw = useStageTimeline({
    target: sectionRef,
    from: communityStageStops.from,
    to: communityStageStops.to,
    scrollTrigger: { start: 'top 78%', end: 'bottom 35%' },
    prefersReducedMotion,
  })
  const stageProgress = prefersReducedMotion ? 1 : stageProgressRaw
  const itemStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const asideStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])

  useCinematicSection(
    prefersReducedMotion,
    sectionRef,
    (timeline) => {
      timeline.fromTo(
        '[data-community-proof-item]',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        0,
      )

      timeline.fromTo(
        '[data-scroll-split-aside]',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.15,
      )
    },
    { start: 'top 80%', end: 'bottom 25%' },
  )

  return { sectionRef, prefersReducedMotion, itemStyle, asideStyle, stageProgress }
}

export function useHomeCtaScroll(): CtaSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const stageProgressRaw = useStageTimeline({
    target: sectionRef,
    from: ctaStageStops.from,
    to: ctaStageStops.to,
    scrollTrigger: { start: 'top 82%', end: 'bottom 32%' },
    prefersReducedMotion,
  })
  const stageProgress = prefersReducedMotion ? 1 : stageProgressRaw
  const copyStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const panelStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])

  useCinematicSection(
    prefersReducedMotion,
    sectionRef,
    (timeline) => {
      timeline.fromTo(
        '[data-cta-copy]',
        { autoAlpha: 0, y: 32 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' },
      )

      timeline.fromTo(
        '[data-cta-reveal]',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.2,
      )
    },
    { start: 'top 80%', end: 'bottom 20%' },
  )

  return { sectionRef, prefersReducedMotion, copyStyle, panelStyle, stageProgress }
}
