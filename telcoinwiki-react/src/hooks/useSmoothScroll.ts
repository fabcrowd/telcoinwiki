import { useEffect, useRef } from 'react'

import type Lenis from '@studio-freight/lenis'
import type { LenisOptions } from '@studio-freight/lenis'

import { loadGsapWithScrollTrigger } from '../utils/lazyGsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

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

type LenisModule = typeof import('@studio-freight/lenis')
type LenisConstructor = new (options?: LenisOptions) => Lenis

let lenisModulePromise: Promise<LenisModule> | null = null

function loadLenisModule(): Promise<LenisModule> {
  if (!lenisModulePromise) {
    lenisModulePromise = import('@studio-freight/lenis')
  }

  return lenisModulePromise
}

function determineFrameInterval(): number {
  if (typeof navigator === 'undefined') {
    return 1000 / 60
  }

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string }
    hardwareConcurrency?: number
  }

  if (nav.connection?.saveData) {
    return 1000 / 30
  }

  if (nav.connection?.effectiveType && ['slow-2g', '2g', '3g'].includes(nav.connection.effectiveType)) {
    return 1000 / 30
  }

  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) {
    return 1000 / 45
  }

  return 1000 / 60
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}): SmoothScrollHandle {
  const { enabled = true, lenis: lenisOptions } = options
  const lenisRef = useRef<Lenis | null>(null)
  const frameRef = useRef<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!enabled || prefersReducedMotion || typeof window === 'undefined') {
      lenisRef.current = null
      return undefined
    }

    let disposed = false
    let lenisInstance: Lenis | null = null
    let intersectionObserver: IntersectionObserver | null = null
    let resizeObserver: ResizeObserver | null = null
    let sentinel: HTMLDivElement | null = null
    const cleanups: Array<() => void> = []

    const frameInterval = determineFrameInterval()
    let lastFrameTime = performance.now()
    let pausedByVisibility = typeof document !== 'undefined' ? document.visibilityState === 'hidden' : false
    let pausedByViewport = false

    const isPaused = () => pausedByVisibility || pausedByViewport

    const stopAnimation = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }

    const onAnimationFrame = (time: number) => {
      frameRef.current = null

      if (!lenisInstance || isPaused()) {
        return
      }

      if (time - lastFrameTime >= frameInterval) {
        lenisInstance.raf(time)
        lastFrameTime = time
      }

      frameRef.current = window.requestAnimationFrame(onAnimationFrame)
    }

    const startAnimation = () => {
      if (frameRef.current !== null || !lenisInstance || isPaused()) {
        return
      }

      lastFrameTime = performance.now()
      frameRef.current = window.requestAnimationFrame(onAnimationFrame)
    }

    const syncAnimation = () => {
      if (isPaused()) {
        stopAnimation()
      } else {
        startAnimation()
      }
    }

    const handleVisibilityChange = () => {
      if (typeof document === 'undefined') {
        return
      }

      pausedByVisibility = document.visibilityState === 'hidden'
      syncAnimation()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    cleanups.push(() => document.removeEventListener('visibilitychange', handleVisibilityChange))

    if ('IntersectionObserver' in window) {
      sentinel = document.createElement('div')
      sentinel.setAttribute('data-smooth-scroll-visibility', 'true')
      sentinel.style.cssText = 'position:fixed;width:1px;height:1px;top:0;left:0;pointer-events:none;opacity:0;'

      document.body.appendChild(sentinel)

      intersectionObserver = new IntersectionObserver((entries) => {
        const entry = entries.at(-1)

        if (!entry) {
          return
        }

        pausedByViewport = !entry.isIntersecting || entry.intersectionRatio === 0
        syncAnimation()
      })

      intersectionObserver.observe(sentinel)

      cleanups.push(() => {
        intersectionObserver?.disconnect()
        sentinel?.remove()
      })
    } else if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries.at(-1)

        if (!entry) {
          return
        }

        const { width, height } = entry.contentRect
        pausedByViewport = width === 0 || height === 0
        syncAnimation()
      })

      resizeObserver.observe(document.documentElement)
      cleanups.push(() => resizeObserver?.disconnect())
    } else {
      const handleBlur = () => {
        pausedByViewport = true
        syncAnimation()
      }
      const handleFocus = () => {
        pausedByViewport = false
        syncAnimation()
      }

      window.addEventListener('blur', handleBlur)
      window.addEventListener('focus', handleFocus)

      cleanups.push(() => {
        window.removeEventListener('blur', handleBlur)
        window.removeEventListener('focus', handleFocus)
      })
    }

    Promise.all([loadLenisModule(), loadGsapWithScrollTrigger()])
      .then(([lenisModule, { ScrollTrigger }]) => {
        if (disposed) {
          return
        }

        const LenisExport = (lenisModule as LenisModule).default ??
          (lenisModule as unknown as { Lenis?: LenisConstructor }).Lenis ??
          (lenisModule as unknown as LenisConstructor)

        const LenisCtor = LenisExport as LenisConstructor

        const lenis = new LenisCtor({
          smoothWheel: true,
          smoothTouch: false,
          ...lenisOptions,
        })

        lenisInstance = lenis
        lenisRef.current = lenis

        const updateScrollTriggers = () => ScrollTrigger.update()
        lenis.on('scroll', updateScrollTriggers)
        cleanups.push(() => lenis.off('scroll', updateScrollTriggers))

        ScrollTrigger.refresh()
        startAnimation()
      })
      .catch((error) => {
        if (import.meta.env?.DEV) {
          console.warn('Failed to initialise smooth scrolling', error)
        }
      })

    return () => {
      disposed = true

      cleanups.splice(0).forEach((cleanup) => cleanup())
      stopAnimation()

      lenisInstance?.destroy()
      lenisInstance = null
      lenisRef.current = null
    }
  }, [enabled, lenisOptions, prefersReducedMotion])

  return { lenis: lenisRef.current, prefersReducedMotion }
}
