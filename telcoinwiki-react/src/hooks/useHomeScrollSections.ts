import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useMediaQuery } from './useMediaQuery'

interface BaseSectionState {
  sectionRef: RefObject<HTMLElement | null>
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
  stackCardsEnabled?: boolean
  sectionOffset?: number
}

function createFadeInStyle(prefersReducedMotion: boolean): CSSProperties {
  return prefersReducedMotion ? { opacity: 1, transform: 'none' } : { opacity: 1, transform: 'none' }
}

// Hero section scroll state
export function useHomeHeroScroll(): HeroSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const systemPrefersReducedMotion = usePrefersReducedMotion()
  const isHandheld = useMediaQuery('(max-width: 40rem)')
  const prefersReducedMotion = systemPrefersReducedMotion || isHandheld

  const overlayStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const copyStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])

  return {
    sectionRef,
    prefersReducedMotion,
    overlayStyle,
    copyStyle,
    stageProgress: 1,
  }
}

// First section (broken-money): Standard scroll state
export function useHomeBrokenMoneyScroll(): SlidingSectionState {
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
    stickyStyle: prefersReducedMotion ? undefined : { top: '20vh' },
      onStackProgress: prefersReducedMotion ? undefined : setStackProgress,
    }
  }

// Sections 2-5 share one shape: measure the PREVIOUS section's main card
// height and offset this section by half of it, so each section's stack
// starts right where the one before it released. Only the previous
// section's DOM id differs between them.
function useHomeCascadedSectionScroll(previousSectionId: string): SlidingSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const systemPrefersReducedMotion = usePrefersReducedMotion()
  const isHandheld = useMediaQuery('(max-width: 40rem)')
  const prefersReducedMotion = systemPrefersReducedMotion || isHandheld

  const introStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const stackStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const [stackProgress, setStackProgress] = useState(0)
  const [mainCardOffset, setMainCardOffset] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      return
    }

    const previousSection = document.getElementById(previousSectionId)
    if (!previousSection) return

    const measureAndSetOffset = () => {
      const previousMainCard = previousSection.querySelector<HTMLElement>('[data-sticky-module-lead]')
      if (!previousMainCard) return

      // Measure the main card's height
      const mainCardHeight = previousMainCard.getBoundingClientRect().height

      // Set the offset to half the main card height - this section should position itself 1/2 height down
      setMainCardOffset(mainCardHeight / 2)
    }

    // Measure after layout
    const rafId = requestAnimationFrame(() => {
      measureAndSetOffset()
    })

    // Re-measure on resize with debouncing (150ms delay for better performance)
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    const handleResize = () => {
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout)
      }
      resizeTimeout = setTimeout(() => {
        measureAndSetOffset()
        resizeTimeout = null
      }, 150)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [prefersReducedMotion, previousSectionId])

  // Sticky style matches first section (no special positioning)
  const stickyStyle = useMemo(() => {
    return prefersReducedMotion ? undefined : { top: '20vh' }
  }, [prefersReducedMotion])

  return {
    sectionRef,
    prefersReducedMotion,
    stageProgress: 1,
    stackProgress,
    introStyle,
    stackStyle,
    stickyStyle,
    onStackProgress: prefersReducedMotion ? undefined : setStackProgress,
    stackCardsEnabled: true, // Always enabled - no special timing
    sectionOffset: mainCardOffset, // Pass measured height for CSS positioning
  }
}

// Second section: Measure section 1's main card height and position section 2 accordingly
export function useHomeSection2Scroll(): SlidingSectionState {
  return useHomeCascadedSectionScroll('home-broken-money')
}

// Third section: Measure section 2's main card height and position section 3 accordingly
export function useHomeSection3Scroll(): SlidingSectionState {
  return useHomeCascadedSectionScroll('home-section-2')
}

// Fourth section: Measure section 3's main card height and position section 4 accordingly
export function useHomeSection4Scroll(): SlidingSectionState {
  return useHomeCascadedSectionScroll('home-section-3')
}

// Fifth section: Measure section 4's main card height and position section 5 accordingly
export function useHomeSection5Scroll(): SlidingSectionState {
  return useHomeCascadedSectionScroll('home-section-4')
}
