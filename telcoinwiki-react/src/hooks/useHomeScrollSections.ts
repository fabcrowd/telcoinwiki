import { useMemo, useRef } from 'react'
import type { CSSProperties, RefObject } from 'react'

import { useScrollTimeline } from './useScrollTimeline'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type TimelineCreator = Parameters<typeof useScrollTimeline>[0]['create']

function createRevealStyle(prefersReducedMotion: boolean, initial: string): CSSProperties | undefined {
  return prefersReducedMotion ? { '--color-shift-clip': '0%' } : { '--color-shift-clip': initial }
}

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
  backgroundStyle: CSSProperties | undefined
}

interface PillarSectionState extends BaseSectionState {
  backgroundStyle: CSSProperties | undefined
  cardStyle: CSSProperties | undefined
}

interface CommunitySectionState extends BaseSectionState {
  backgroundStyle: CSSProperties | undefined
  itemStyle: CSSProperties | undefined
  asideStyle: CSSProperties | undefined
}

interface CtaSectionState extends BaseSectionState {
  backgroundStyle: CSSProperties | undefined
  copyStyle: CSSProperties | undefined
  panelStyle: CSSProperties | undefined
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
  const backgroundStyle = useMemo(
    () => (prefersReducedMotion ? { '--color-shift-clip': '0%' } : { '--color-shift-clip': '45%' }),
    [prefersReducedMotion],
  )

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
      '[data-color-shift]',
      { '--color-shift-clip': '45%' },
      { '--color-shift-clip': '0%', duration: 1.1, ease: 'power2.out' },
      0,
    )
  })

  return { sectionRef, prefersReducedMotion, overlayStyle, copyStyle, backgroundStyle }
}

export function useHomeProductPillarsScroll(): PillarSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const backgroundStyle = useMemo(() => createRevealStyle(prefersReducedMotion, '55%'), [prefersReducedMotion])
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

      timeline.fromTo(
        '[data-color-shift]',
        { '--color-shift-clip': '55%' },
        { '--color-shift-clip': '0%', duration: 1, ease: 'power2.out' },
        0,
      )
    },
    { start: 'top 75%', end: 'bottom 25%' },
  )

  return { sectionRef, prefersReducedMotion, backgroundStyle, cardStyle }
}

export function useHomeCommunityProofScroll(): CommunitySectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const backgroundStyle = useMemo(() => createRevealStyle(prefersReducedMotion, '65%'), [prefersReducedMotion])
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

      timeline.fromTo(
        '[data-color-shift]',
        { '--color-shift-clip': '65%' },
        { '--color-shift-clip': '0%', duration: 1.05, ease: 'power2.out' },
        0,
      )
    },
    { start: 'top 80%', end: 'bottom 25%' },
  )

  return { sectionRef, prefersReducedMotion, backgroundStyle, itemStyle, asideStyle }
}

export function useHomeCtaScroll(): CtaSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const backgroundStyle = useMemo(() => createRevealStyle(prefersReducedMotion, '58%'), [prefersReducedMotion])
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

      timeline.fromTo(
        '[data-color-shift]',
        { '--color-shift-clip': '58%' },
        { '--color-shift-clip': '0%', duration: 1, ease: 'power2.out' },
        0,
      )
    },
    { start: 'top 80%', end: 'bottom 20%' },
  )

  return { sectionRef, prefersReducedMotion, backgroundStyle, copyStyle, panelStyle }
}
