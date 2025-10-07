import { useEffect, useRef, useState } from 'react'

import Lenis, { type LenisOptions } from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      ...lenisOptions,
    })

    lenisRef.current = lenis

    const updateScrollTriggers = () => ScrollTrigger.update()
    lenis.on('scroll', updateScrollTriggers)

    ScrollTrigger.refresh()

    const onAnimationFrame = (time: number) => {
      lenis.raf(time)
      frameRef.current = window.requestAnimationFrame(onAnimationFrame)
    }

    frameRef.current = window.requestAnimationFrame(onAnimationFrame)

    return () => {
      lenis.off('scroll', updateScrollTriggers)
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled, lenisOptions, prefersReducedMotion])

  return { lenis: lenisRef.current, prefersReducedMotion }
}
