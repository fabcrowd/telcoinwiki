import type { MutableRefObject, RefObject } from 'react'
import { useEffect, useRef } from 'react'

 codex/wrap-animation-initialization-in-checks
import type { GSAPContext, GSAPTimeline } from 'gsap'
=======
import { gsap } from 'gsap'
 main
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'

 codex/wrap-animation-initialization-in-checks
import { loadGsapWithScrollTrigger } from '../utils/lazyGsap'
=======
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}
 main

type Timeline = GSAPTimeline

type ScrollTimelineTarget = Element | RefObject<Element> | null

export interface UseScrollTimelineConfig {
  /**
   * Element that should control the ScrollTrigger instance.
   */
  target: ScrollTimelineTarget
  /**
   * Callback that receives the GSAP timeline. Define tweens inside this function.
   */
  create: (timeline: Timeline, context: gsap.Context) => void
  /**
   * Additional GSAP timeline options.
   */
  timeline?: gsap.TimelineVars
  /**
   * Optional ScrollTrigger configuration overriding the sensible defaults.
   */
  scrollTrigger?: ScrollTriggerType.Vars
}

const defaultScrollTrigger: ScrollTriggerType.Vars = {
  start: 'top 80%',
  end: 'bottom top',
  toggleActions: 'play reverse play reverse',
}

function isRefObject(value: ScrollTimelineTarget): value is RefObject<Element> {
  return Boolean(value && typeof value === 'object' && 'current' in value)
}

function resolveTarget(target: ScrollTimelineTarget): Element | null {
  if (!target) {
    return null
  }

  return isRefObject(target) ? target.current : target
}

export function useScrollTimeline({
  target,
  create,
  timeline: timelineVars,
  scrollTrigger,
}: UseScrollTimelineConfig): MutableRefObject<Timeline | null> {
  const timelineRef = useRef<Timeline | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const element = resolveTarget(target)

    if (!element) {
      return undefined
    }

    let disposed = false
    let context: GSAPContext | null = null
    let timeline: Timeline | null = null

    loadGsapWithScrollTrigger()
      .then(({ gsap }) => {
        if (disposed) {
          return
        }

        context = gsap.context(() => {
          timeline = gsap.timeline({
            defaults: { ease: 'power1.out' },
            ...timelineVars,
            scrollTrigger: {
              trigger: element,
              ...defaultScrollTrigger,
              ...scrollTrigger,
            },
          })

          timelineRef.current = timeline
          create(timeline!, context!)
        }, element)
      })
      .catch((error) => {
        if (import.meta.env?.DEV) {
          console.warn('Failed to initialize scroll timeline', error)
        }
      })

    return () => {
      disposed = true

      context?.revert()
      timeline?.scrollTrigger?.kill()
      timeline?.kill()
      timelineRef.current = null
    }
  }, [target, create, timelineVars, scrollTrigger])

  return timelineRef
}
