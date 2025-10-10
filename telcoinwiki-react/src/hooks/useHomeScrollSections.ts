import { useMemo, useRef } from 'react'
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
  onStackProgress?: (value: number) => void
  stickyStyle: CSSProperties | undefined
}

function createFadeInStyle(prefersReducedMotion: boolean): CSSProperties | undefined {
  return prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined
}

function createStackSectionHook(): () => SlidingSectionState {
  return function useHomeStackSection(): SlidingSectionState {
    const sectionRef = useRef<HTMLElement | null>(null)
    const systemPrefersReducedMotion = usePrefersReducedMotion()
    const isHandheld = useMediaQuery('(max-width: 40rem)')
    const prefersReducedMotion = systemPrefersReducedMotion || isHandheld

    const introStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
    const stackStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])

    return {
      sectionRef,
      prefersReducedMotion,
      stageProgress: 1,
      introStyle,
      stackStyle,
      stickyStyle: prefersReducedMotion ? undefined : { top: '20vh' },
      onStackProgress: undefined,
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

export const useHomeBrokenMoneyScroll = createStackSectionHook()

export const useHomeTelcoinModelScroll = createStackSectionHook()

export const useHomeEngineScroll = createStackSectionHook()

export const useHomeExperienceScroll = createStackSectionHook()

export const useHomeLearnMoreScroll = createStackSectionHook()
