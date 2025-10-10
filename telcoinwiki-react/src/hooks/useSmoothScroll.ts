import { useEffect, useRef, useState } from 'react'

import type Lenis from 'lenis'
import type { LenisOptions } from 'lenis'

type LenisSubscriber = (lenis: Lenis | null) => void

const lenisSubscribers = new Set<LenisSubscriber>()
let activeLenis: Lenis | null = null

const notifyLenisSubscribers = () => {
  lenisSubscribers.forEach((subscriber) => {
    try {
      subscriber(activeLenis)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Smooth scroll subscriber failed', error)
      }
    }
  })
}

export const getActiveLenis = (): Lenis | null => activeLenis

export const subscribeToLenis = (subscriber: LenisSubscriber): (() => void) => {
  lenisSubscribers.add(subscriber)
  subscriber(activeLenis)
  return () => {
    lenisSubscribers.delete(subscriber)
  }
}

export interface UseSmoothScrollOptions {
  /**
   * Allows consumers to disable Lenis entirely (e.g. for specific pages).
   * Defaults to `true`.
   */
  enabled?: boolean
  /**
   * Options passed directly to the Lenis constructor.
   */
  lenis?: LenisOptions
}

export interface SmoothScrollHandle {
  lenis: Lenis | null
  prefersReducedMotion: boolean
}

const prefersReducedMotionQuery = '(prefers-reduced-motion: reduce)'

interface AnimationModules {
  LenisCtor: typeof import('lenis').default
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
}

let animationModulesPromise: Promise<AnimationModules> | null = null

async function loadAnimationModules(): Promise<AnimationModules> {
  if (!animationModulesPromise) {
    animationModulesPromise = Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([lenisModule, gsapModule, scrollTriggerModule]) => {
      const LenisCtor = lenisModule.default
      const { gsap } = gsapModule
      const { ScrollTrigger } = scrollTriggerModule

      if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger)
      }

      return { LenisCtor, ScrollTrigger }
    })
  }

  return animationModulesPromise
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}): SmoothScrollHandle {
  const { enabled = true, lenis: lenisOptions } = options
  const lenisRef = useRef<Lenis | null>(null)
  const frameRef = useRef<number | null>(null)
  const previousScrollBehaviorRef = useRef<string | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.matchMedia(prefersReducedMotionQuery).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia(prefersReducedMotionQuery)
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    if (!enabled || prefersReducedMotion || typeof window === 'undefined') {
      return undefined
    }

    let isDisposed = false
    let cleanupCallbacks: Array<() => void> = []

    const stopAnimation = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }

    const initialize = async () => {
      try {
        const { LenisCtor, ScrollTrigger } = await loadAnimationModules()

        if (isDisposed || typeof window === 'undefined') {
          return
        }

        const root = document.documentElement

        // Ensure native CSS smooth scrolling doesn't fight Lenis/GSAP.
        // Store previous inline style so we can restore it on cleanup.
        previousScrollBehaviorRef.current = root.style.scrollBehavior || null
        root.style.scrollBehavior = 'auto'
        const lenis = new LenisCtor({
          smoothWheel: true,
          smoothTouch: false,
          ...lenisOptions,
        })

        lenisRef.current = lenis
        activeLenis = lenis
        notifyLenisSubscribers()

        // Sync ScrollTrigger with Lenis using the official integration pattern
        // Call ScrollTrigger.update() on Lenis scroll events for proper synchronization
        const maxSyncInterval = 1000 / 60
        let lastScrollTriggerSync = Number.NEGATIVE_INFINITY
        const scrollHandler = () => {
          const now = window.performance?.now?.() ?? Date.now()
          if (now - lastScrollTriggerSync < maxSyncInterval) {
            return
          }

          lastScrollTriggerSync = now
          try {
            ScrollTrigger.update()
          } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('ScrollTrigger update failed', err)
            }
          }
        }
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (lenis as any)?.on?.('scroll', scrollHandler)
        } catch {
          /* noop */
        }

        // Store handler for cleanup
        cleanupCallbacks.push(() => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (lenis as any)?.off?.('scroll', scrollHandler)
          } catch {
            /* noop */
          }
        })

        // Refresh triggers at safe times to ensure correct scroll range before
        // the user interacts. Some browsers finish layout after images/fonts load.
        const doRefresh = () => {
          try {
            if (typeof ScrollTrigger.refresh === 'function') {
              ScrollTrigger.refresh()
            }
          } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('ScrollTrigger refresh failed', err)
            }
          }
        }

        // Initial refresh right away
        doRefresh()
        // After fonts load
        if ('fonts' in document && 'ready' in document.fonts) {
          document.fonts.ready.then(() => doRefresh()).catch(() => {})
        }
        // After window load (images, etc.)
        const onLoad = () => doRefresh()
        window.addEventListener('load', onLoad)
        cleanupCallbacks.push(() => window.removeEventListener('load', onLoad))
        // And once more on first animation frame after init
        requestAnimationFrame(() => doRefresh())

        const nav = window.navigator as Navigator & { deviceMemory?: number }
        const lowPowerDevice = Boolean(
          (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 4) ||
            (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4),
        )
        const minFrameInterval = lowPowerDevice ? 1000 / 30 : 0

        let lastFrameTime = window.performance?.now?.() ?? 0
        let documentVisible = typeof document.hidden === 'boolean' ? !document.hidden : true
        let hasRenderableArea = window.innerWidth > 0 && window.innerHeight > 0
        let isIntersecting = true

        const shouldRun = () => documentVisible && hasRenderableArea && isIntersecting

        const onAnimationFrame = (time: number) => {
          if (!shouldRun()) {
            stopAnimation()
            return
          }

          if (minFrameInterval > 0 && time - lastFrameTime < minFrameInterval) {
            frameRef.current = window.requestAnimationFrame(onAnimationFrame)
            return
          }

          lastFrameTime = time
          lenis.raf(time)
          frameRef.current = window.requestAnimationFrame(onAnimationFrame)
        }

        const startAnimation = () => {
          if (frameRef.current === null && shouldRun()) {
            lastFrameTime = window.performance?.now?.() ?? 0
            frameRef.current = window.requestAnimationFrame(onAnimationFrame)
          }
        }

        const handleVisibilityChange = () => {
          documentVisible = !document.hidden
          if (documentVisible) {
            startAnimation()
          } else {
            stopAnimation()
          }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        cleanupCallbacks.push(() => document.removeEventListener('visibilitychange', handleVisibilityChange))

        if ('ResizeObserver' in window) {
          const resizeObserver = new window.ResizeObserver((entries) => {
            const entry = entries[0]
            if (!entry) {
              return
            }

            const { width, height } = entry.contentRect
            hasRenderableArea = width > 0 && height > 0

            if (hasRenderableArea) {
              startAnimation()
            } else {
              stopAnimation()
            }
          })

          resizeObserver.observe(root)
          cleanupCallbacks.push(() => resizeObserver.disconnect())
        } else {
          const handleResize = () => {
            hasRenderableArea = window.innerWidth > 0 && window.innerHeight > 0
            if (hasRenderableArea) {
              startAnimation()
            } else {
              stopAnimation()
            }
          }

          window.addEventListener('resize', handleResize)
          cleanupCallbacks.push(() => window.removeEventListener('resize', handleResize))
          handleResize()
        }

        if ('IntersectionObserver' in window) {
          const intersectionObserver = new window.IntersectionObserver((entries) => {
            const entry = entries[0]
            if (!entry) {
              return
            }

            isIntersecting = entry.isIntersecting

            if (isIntersecting) {
              startAnimation()
            } else {
              stopAnimation()
            }
          })

          intersectionObserver.observe(root)
          cleanupCallbacks.push(() => intersectionObserver.disconnect())
        } else {
          const handleWindowFocus = () => {
            isIntersecting = true
            startAnimation()
          }
          const handleWindowBlur = () => {
            isIntersecting = false
            stopAnimation()
          }

          window.addEventListener('focus', handleWindowFocus)
          window.addEventListener('blur', handleWindowBlur)
          cleanupCallbacks.push(() => {
            window.removeEventListener('focus', handleWindowFocus)
            window.removeEventListener('blur', handleWindowBlur)
          })
        }

        cleanupCallbacks.push(() => {
          stopAnimation()
          lenis.destroy()
          lenisRef.current = null
          activeLenis = null
          notifyLenisSubscribers()

          // Restore any previous inline scroll-behavior style
          if (previousScrollBehaviorRef.current !== null) {
            root.style.scrollBehavior = previousScrollBehaviorRef.current
          } else {
            root.style.removeProperty('scroll-behavior')
          }
        })

        startAnimation()
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to load smooth scroll modules', error)
        }
      }
    }

    initialize()

    return () => {
      isDisposed = true
      cleanupCallbacks.forEach((cleanup) => cleanup())
      cleanupCallbacks = []
      stopAnimation()
      lenisRef.current = null
    }
  }, [enabled, lenisOptions, prefersReducedMotion])

  return { lenis: lenisRef.current, prefersReducedMotion }
}
