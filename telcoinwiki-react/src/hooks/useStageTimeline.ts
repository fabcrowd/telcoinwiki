import { useCallback, useEffect, useMemo, useState } from 'react'

import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'

import { clamp01, lerp } from '../utils/interpolate'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
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

const stageVariableMap: Record<keyof NormalizedStageStop, string> = {
  hue: '--tc-stage-hue',
  accentHue: '--tc-stage-accent-hue',
  overlayOpacity: '--tc-stage-overlay-opacity',
  spotOpacity: '--tc-stage-spot-opacity',
  cardOverlayOpacity: '--tc-stage-card-overlay-opacity',
  cardBorderOpacity: '--tc-stage-card-border-opacity',
  cardShadowOpacity: '--tc-stage-card-shadow-opacity',
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

function interpolateStops(start: NormalizedStageStop, end: NormalizedStageStop, progress: number): NormalizedStageStop {
  return {
    hue: lerp(start.hue, end.hue, progress),
    accentHue: lerp(start.accentHue, end.accentHue, progress),
    overlayOpacity: lerp(start.overlayOpacity, end.overlayOpacity, progress),
    spotOpacity: lerp(start.spotOpacity, end.spotOpacity, progress),
    cardOverlayOpacity: lerp(start.cardOverlayOpacity, end.cardOverlayOpacity, progress),
    cardBorderOpacity: lerp(start.cardBorderOpacity, end.cardBorderOpacity, progress),
    cardShadowOpacity: lerp(start.cardShadowOpacity, end.cardShadowOpacity, progress),
  }
}

function applyStageStop(root: HTMLElement, stop: NormalizedStageStop) {
  root.style.setProperty(stageVariableMap.hue, stop.hue.toFixed(2))
  root.style.setProperty(stageVariableMap.accentHue, stop.accentHue.toFixed(2))
  root.style.setProperty(stageVariableMap.overlayOpacity, stop.overlayOpacity.toFixed(3))
  root.style.setProperty(stageVariableMap.spotOpacity, stop.spotOpacity.toFixed(3))
  root.style.setProperty(stageVariableMap.cardOverlayOpacity, stop.cardOverlayOpacity.toFixed(3))
  root.style.setProperty(stageVariableMap.cardBorderOpacity, stop.cardBorderOpacity.toFixed(3))
  root.style.setProperty(stageVariableMap.cardShadowOpacity, stop.cardShadowOpacity.toFixed(3))
}

function useStageStopMemo(stop: StageStop): NormalizedStageStop {
  return useMemo(() => normalizeStop(stop), [stop])
}

export function useStageTimeline({
  target,
  from,
  to,
  scrollTrigger,
  prefersReducedMotion,
}: UseStageTimelineConfig): number {
  const prefersReducedMotionValue = usePrefersReducedMotion()
  const shouldReduce = prefersReducedMotion ?? prefersReducedMotionValue
  const [progress, setProgress] = useState(0)

  const fromStop = useStageStopMemo(from)
  const toStop = useStageStopMemo(to)

  const combinedScrollTrigger = useMemo(() => {
    const base: ScrollTriggerType.Vars = { ...(scrollTrigger ?? {}) }

    if (shouldReduce) {
      base.scrub = false
    } else if (typeof base.scrub === 'undefined') {
      base.scrub = true
    }

    return base
  }, [scrollTrigger, shouldReduce])

  useScrollTimeline({
    target,
    scrollTrigger: combinedScrollTrigger,
    create: useCallback(
      (timeline) => {
        if (typeof document === 'undefined') {
          return
        }

        const root = document.documentElement
        const trigger = timeline.scrollTrigger

        if (shouldReduce) {
          const applyFrom = () => {
            applyStageStop(root, fromStop)
            setProgress(0)
          }
          const applyTo = () => {
            applyStageStop(root, toStop)
            setProgress(1)
          }

          trigger?.eventCallback('onEnter', applyTo)
          trigger?.eventCallback('onEnterBack', applyTo)
          trigger?.eventCallback('onLeave', applyFrom)
          trigger?.eventCallback('onLeaveBack', applyFrom)

          if (trigger && (trigger.progress > 0 || trigger.isActive)) {
            applyTo()
          } else {
            applyFrom()
          }

          return
        }

        const update = (value: number) => {
          const clamped = clamp01(value)

          if (clamped <= 0 && !trigger?.isActive) {
            setProgress(0)
            return
          }

          const stageStop = interpolateStops(fromStop, toStop, clamped)
          applyStageStop(root, stageStop)
          setProgress(clamped)
        }

        timeline.to({}, {
          duration: 1,
          onUpdate: () => {
            update(timeline.progress())
          },
        })

        update(timeline.progress())
      },
      [fromStop, shouldReduce, toStop],
    ),
  })

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement

    return () => {
      Object.values(stageVariableMap).forEach((variable) => {
        root.style.removeProperty(variable)
      })
    }
  }, [])

  useEffect(() => {
    if (!shouldReduce || typeof document === 'undefined') {
      return
    }

    const root = document.documentElement
    applyStageStop(root, progress > 0 ? toStop : fromStop)
  }, [fromStop, progress, shouldReduce, toStop])

  return progress
}
