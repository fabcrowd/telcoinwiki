import type { MutableRefObject, RefObject } from 'react'
import { useEffect, useRef } from 'react'

import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'

type GsapExports = typeof import('gsap')
type GsapInstance = GsapExports['gsap']
type Timeline = ReturnType<GsapInstance['timeline']>
type TimelineVars = Parameters<GsapInstance['timeline']>[0]
type GsapContext = ReturnType<GsapInstance['context']>

interface ScrollTimelineModules {
  gsap: GsapInstance
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
}

let scrollTimelineModulesPromise: Promise<ScrollTimelineModules> | null = null

async function loadScrollTimelineModules(): Promise<ScrollTimelineModules> {
  if (!scrollTimelineModulesPromise) {
    scrollTimelineModulesPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, scrollTriggerModule]) => {
        const { gsap } = gsapModule
        const { ScrollTrigger } = scrollTriggerModule

        if (typeof window !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger)
        }

        return { gsap, ScrollTrigger }
      },
    )
  }

  return scrollTimelineModulesPromise
}

type ScrollTimelineTarget = Element | RefObject<Element> | null

export interface UseScrollTimelineConfig {
  /**
   * Element that should control the ScrollTrigger instance.
   */
  target: ScrollTimelineTarget
  /**
   * Callback that receives the GSAP timeline. Define tweens inside this function.
   */
  create: (timeline: Timeline, context: GsapContext) => void
  /**
   * Additional GSAP timeline options.
   */
  timeline?: TimelineVars
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

    let isDisposed = false
    let timeline: Timeline | null = null
    let context: GsapContext | null = null

    const initialize = async () => {
      try {
        const { gsap } = await loadScrollTimelineModules()

        if (isDisposed) {
          return
        }

        const config: TimelineVars = {
          defaults: { ease: 'power1.out' },
          ...(timelineVars ?? {}),
          scrollTrigger: {
            trigger: element,
            ...defaultScrollTrigger,
            ...scrollTrigger,
          },
        }

        context = gsap.context((ctx) => {
          const createdTimeline = gsap.timeline(config)
          timeline = createdTimeline
          timelineRef.current = createdTimeline
          create(createdTimeline, ctx)
        }, element)
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to load GSAP for scroll timelines', error)
        }
      }
    }

    // Heuristic: initialize immediately if the element is near the viewport top; otherwise defer to idle to reduce LCP cost
    const rect = element.getBoundingClientRect()
    const nearViewport = rect.top < window.innerHeight * 0.33

    const schedule = () => {
      void initialize()
    }

    if (nearViewport) {
      schedule()
    } else if ('requestIdleCallback' in window) {
      ;(window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout?: number }) => number }).requestIdleCallback(
        schedule,
        { timeout: 400 },
      )
    } else {
      window.setTimeout(schedule, 200)
    }

    return () => {
      isDisposed = true

      if (context) {
        context.revert()
      }

      if (timeline) {
        // Clear all event callbacks to prevent memory leaks
        timeline.eventCallback('onStart', null)
        timeline.eventCallback('onUpdate', null)
        timeline.eventCallback('onComplete', null)
        timeline.eventCallback('onReverseComplete', null)
        timeline.eventCallback('onRepeat', null)

        // Kill ScrollTrigger first, then timeline
        if (timeline.scrollTrigger) {
          timeline.scrollTrigger.kill(true)
        }
        timeline.kill()
      }

      timelineRef.current = null
    }
  }, [target, create, timelineVars, scrollTrigger])

  return timelineRef
}
