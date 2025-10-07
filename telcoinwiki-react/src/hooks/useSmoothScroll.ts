import { useEffect, useRef, useState } from 'react'

import Lenis, { type LenisOptions } from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
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

export function useSmoothScroll(options: UseSmoothScrollOptions = {}): SmoothScrollHandle {
  const { enabled = true, lenis: lenisOptions } = options
  const lenisRef = useRef<Lenis | null>(null)
  const frameRef = useRef<number | null>(null)
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

    const root = document.documentElement
    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      ...lenisOptions,
    })

    lenisRef.current = lenis

    const updateScrollTriggers = () => ScrollTrigger.update()
    lenis.on('scroll', updateScrollTriggers)

    if (typeof ScrollTrigger.refresh === 'function') {
      ScrollTrigger.refresh()
    }

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

    const stopAnimation = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }

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

    const cleanupCallbacks: Array<() => void> = []

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

    startAnimation()

    return () => {
      cleanupCallbacks.forEach((cleanup) => cleanup())
      lenis.off('scroll', updateScrollTriggers)
      stopAnimation()
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled, lenisOptions, prefersReducedMotion])

  return { lenis: lenisRef.current, prefersReducedMotion }
}
