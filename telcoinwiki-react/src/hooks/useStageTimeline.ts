import { useCallback, useRef } from 'react'

import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'

import { useScrollTimeline } from './useScrollTimeline'

interface StageStop {
  hue: number
  accentHue?: number
  overlayOpacity?: number
  spotOpacity?: number
  cardOverlayOpacity?: number
  cardBorderOpacity?: number
  cardShadowOpacity?: number
}

export interface UseStageTimelineConfig {
  target: Parameters<typeof useScrollTimeline>[0]['target']
  from: StageStop
  to: StageStop
  scrollTrigger?: ScrollTriggerType.Vars
  prefersReducedMotion?: boolean
}

/**
 * Optimized stage timeline hook that returns progress value WITHOUT updating CSS variables.
 *
 * PERFORMANCE FIX: Previously, this hook updated 7 CSS variables on the HTML root element
 * on every scroll frame, causing massive repaints and flickering. Now it only tracks progress
 * and lets components apply effects locally using GPU-accelerated transforms/opacity.
 *
 * @returns Progress value (0-1) for the current scroll position
 */
export function useStageTimeline({
  target,
  scrollTrigger,
  prefersReducedMotion = false,
}: UseStageTimelineConfig): number {
  const progressRef = useRef(0)

  useScrollTimeline({
    target: prefersReducedMotion ? null : target,
    create: useCallback(
      (timeline) => {
        if (typeof document === 'undefined') {
          return
        }

        // Simple progress tracker - NO CSS variable updates
        const update = () => {
          progressRef.current = timeline.progress()
        }

        timeline.to(
          {},
          {
            duration: 1,
            ease: 'none',
            onUpdate: update,
          },
        )

        update()
      },
      [],
    ),
    scrollTrigger: scrollTrigger
      ? {
          ...scrollTrigger,
          scrub: prefersReducedMotion ? false : scrollTrigger.scrub ?? true,
        }
      : undefined,
  })

  // Return simple progress value - let components handle effects locally
  return prefersReducedMotion ? 1 : progressRef.current
}
