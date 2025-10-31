import { useMemo, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useMediaQuery } from './useMediaQuery'

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
  stackProgress: number
  onStackProgress?: (value: number) => void
  stickyStyle: CSSProperties | undefined
}

function createFadeInStyle(prefersReducedMotion: boolean): CSSProperties | undefined {
  return prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined
}

function createStackSectionHook(top: string = '20vh'): () => SlidingSectionState {
  return function useHomeStackSection(): SlidingSectionState {
    const sectionRef = useRef<HTMLElement | null>(null)
    const systemPrefersReducedMotion = usePrefersReducedMotion()
    const isHandheld = useMediaQuery('(max-width: 40rem)')
    const prefersReducedMotion = systemPrefersReducedMotion || isHandheld

    const introStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
    const stackStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
    const [stackProgress, setStackProgress] = useState(0)

    return {
      sectionRef,
      prefersReducedMotion,
      stageProgress: 1,
      stackProgress,
      introStyle,
      stackStyle,
      stickyStyle: prefersReducedMotion ? undefined : { top },
      onStackProgress: prefersReducedMotion ? undefined : setStackProgress,
    }
  }
}

export function useHomeHeroScroll(): HeroSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const overlayStyle = useMemo(() => {
    return {
      clipPath: 'inset(0% 0 0 0)',
      '--cinematic-reveal': '0%',
    } as CSSProperties
  }, [])

  const copyStyle = useMemo<CSSProperties | undefined>(() => {
    return prefersReducedMotion ? { transform: 'none' } : undefined
  }, [prefersReducedMotion])

  return { sectionRef, prefersReducedMotion, overlayStyle, copyStyle, stageProgress: 1 }
}

// Start the first section just below the header so the card is visible
// as soon as the hero scrolls out of view.
export const useHomeBrokenMoneyScroll = createStackSectionHook('calc(var(--header-height) + 0.75rem)')

export const useHomeTelcoinModelScroll = createStackSectionHook()

export const useHomeEngineScroll = createStackSectionHook()

export const useHomeExperienceScroll = createStackSectionHook()

export const useHomeLearnMoreScroll = createStackSectionHook()
