import type { MutableRefObject, RefObject } from 'react'
import { useCallback, useEffect, useRef } from 'react'

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

interface NormalizedStageStop {
  hue: number
  accentHue: number
  overlayOpacity: number
  spotOpacity: number
  cardOverlayOpacity: number
  cardBorderOpacity: number
  cardShadowOpacity: number
}

const defaultStop: NormalizedStageStop = {
  hue: 220,
  accentHue: 268,
  overlayOpacity: 0.38,
  spotOpacity: 0.28,
  cardOverlayOpacity: 0.32,
  cardBorderOpacity: 0.38,
  cardShadowOpacity: 0.26,
}

function normalizeStop(stop: StageStop): NormalizedStageStop {
  return {
    hue: stop.hue,
    accentHue: stop.accentHue ?? defaultStop.accentHue,
    overlayOpacity: stop.overlayOpacity ?? defaultStop.overlayOpacity,
    spotOpacity: stop.spotOpacity ?? defaultStop.spotOpacity,
    cardOverlayOpacity: stop.cardOverlayOpacity ?? defaultStop.cardOverlayOpacity,
    cardBorderOpacity: stop.cardBorderOpacity ?? defaultStop.cardBorderOpacity,
    cardShadowOpacity: stop.cardShadowOpacity ?? defaultStop.cardShadowOpacity,
  }
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
  from,
  to,
  scrollTrigger,
  prefersReducedMotion = false,
}: UseStageTimelineConfig): number {
  const progressRef = useRef(0)
  const fromStop = normalizeStop(from)
  const toStop = normalizeStop(to)

  const timelineRef = useScrollTimeline({
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
