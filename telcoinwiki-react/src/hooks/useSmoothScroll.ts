import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export interface UseSmoothScrollOptions {
  /**
   * Historically toggled Lenis+GSAP; retained for API stability.
   */
  enabled?: boolean
}

export interface SmoothScrollHandle {
  /**
   * Mirrors the user’s reduced motion preference for animation callers.
   */
  prefersReducedMotion: boolean
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}): SmoothScrollHandle {
  const { enabled = true } = options
  void enabled

  const prefersReducedMotion = usePrefersReducedMotion()

  return { prefersReducedMotion }
}
