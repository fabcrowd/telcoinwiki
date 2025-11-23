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

// Second section: Measure section 1's main card height and position section 2 accordingly
export function useHomeSection2Scroll(): SlidingSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const systemPrefersReducedMotion = usePrefersReducedMotion()
  const isHandheld = useMediaQuery('(max-width: 40rem)')
  const prefersReducedMotion = systemPrefersReducedMotion || isHandheld

  const introStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const stackStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const [stackProgress, setStackProgress] = useState(0)
  const [mainCardOffset, setMainCardOffset] = useState<number | undefined>(undefined)

  // Measure section 1's main card height and set offset for section 2
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      return
    }

    const section1 = document.getElementById('home-broken-money')
    if (!section1) return

    const measureAndSetOffset = () => {
      const section1MainCard = section1.querySelector<HTMLElement>('[data-sticky-module-lead]')
      if (!section1MainCard) return

      // Measure the main card's height
      const mainCardHeight = section1MainCard.getBoundingClientRect().height
      
      // Set the offset to half the main card height - section 2 should position itself 1/2 height down
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
  }, [prefersReducedMotion])

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

// Third section: Measure section 2's main card height and position section 3 accordingly
export function useHomeSection3Scroll(): SlidingSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const systemPrefersReducedMotion = usePrefersReducedMotion()
  const isHandheld = useMediaQuery('(max-width: 40rem)')
  const prefersReducedMotion = systemPrefersReducedMotion || isHandheld

  const introStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const stackStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const [stackProgress, setStackProgress] = useState(0)
  const [mainCardOffset, setMainCardOffset] = useState<number | undefined>(undefined)

  // Measure section 2's main card height and set offset for section 3
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      return
    }

    const section2 = document.getElementById('home-section-2')
    if (!section2) return

    const measureAndSetOffset = () => {
      const section2MainCard = section2.querySelector<HTMLElement>('[data-sticky-module-lead]')
      if (!section2MainCard) return

      // Measure the main card's height
      const mainCardHeight = section2MainCard.getBoundingClientRect().height
      
      // Set the offset to half the main card height - section 3 should position itself 1/2 height down
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
  }, [prefersReducedMotion])

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

// Fourth section: Measure section 3's main card height and position section 4 accordingly
export function useHomeSection4Scroll(): SlidingSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const systemPrefersReducedMotion = usePrefersReducedMotion()
  const isHandheld = useMediaQuery('(max-width: 40rem)')
  const prefersReducedMotion = systemPrefersReducedMotion || isHandheld

  const introStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const stackStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const [stackProgress, setStackProgress] = useState(0)
  const [mainCardOffset, setMainCardOffset] = useState<number | undefined>(undefined)

  // Measure section 3's main card height and set offset for section 4
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      return
    }

    const section3 = document.getElementById('home-section-3')
    if (!section3) return

    const measureAndSetOffset = () => {
      const section3MainCard = section3.querySelector<HTMLElement>('[data-sticky-module-lead]')
      if (!section3MainCard) return

      // Measure the main card's height
      const mainCardHeight = section3MainCard.getBoundingClientRect().height
      
      // Set the offset to half the main card height - section 4 should position itself 1/2 height down
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
  }, [prefersReducedMotion])

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

// Fifth section: Measure section 4's main card height and position section 5 accordingly
export function useHomeSection5Scroll(): SlidingSectionState {
  const sectionRef = useRef<HTMLElement | null>(null)
  const systemPrefersReducedMotion = usePrefersReducedMotion()
  const isHandheld = useMediaQuery('(max-width: 40rem)')
  const prefersReducedMotion = systemPrefersReducedMotion || isHandheld

  const introStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const stackStyle = useMemo(() => createFadeInStyle(prefersReducedMotion), [prefersReducedMotion])
  const [stackProgress, setStackProgress] = useState(0)
  const [mainCardOffset, setMainCardOffset] = useState<number | undefined>(undefined)

  // Measure section 4's main card height and set offset for section 5
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      return
    }

    const section4 = document.getElementById('home-section-4')
    if (!section4) return

    const measureAndSetOffset = () => {
      const section4MainCard = section4.querySelector<HTMLElement>('[data-sticky-module-lead]')
      if (!section4MainCard) return

      // Measure the main card's height
      const mainCardHeight = section4MainCard.getBoundingClientRect().height
      
      // Set the offset to half the main card height - section 5 should position itself 1/2 height down
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
  }, [prefersReducedMotion])

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
