import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { initLenisScroll, destroyLenisScroll, getLenisInstance, type Lenis } from '../utils/lenisScroll'

export interface UseSmoothScrollOptions {
  /**
   * Enable/disable Lenis smooth scrolling
   */
  enabled?: boolean
}

export interface SmoothScrollHandle {
  /**
   * Mirrors the user's reduced motion preference for animation callers.
   */
  prefersReducedMotion: boolean
  /**
   * Lenis instance (null if not initialized)
   */
  lenis: Lenis | null
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}): SmoothScrollHandle {
  const { enabled = true } = options
  const prefersReducedMotion = usePrefersReducedMotion()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Only initialize if enabled and user doesn't prefer reduced motion
    if (enabled && !prefersReducedMotion && !initializedRef.current) {
      initLenisScroll()
      initializedRef.current = true
    } else if (!enabled || prefersReducedMotion) {
      // Destroy if disabled or user prefers reduced motion
      if (initializedRef.current) {
        destroyLenisScroll()
        initializedRef.current = false
      }
    }

    return () => {
      // Cleanup on unmount
      if (initializedRef.current) {
        destroyLenisScroll()
        initializedRef.current = false
      }
    }
  }, [enabled, prefersReducedMotion])

  return {
    prefersReducedMotion,
    lenis: getLenisInstance(),
  }
}
