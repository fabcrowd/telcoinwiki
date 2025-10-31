import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { clamp01, getViewportSize, schedule, type Axis } from '../utils/scroll'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export interface ScrollProgressOptions {
  /** Axis to observe; defaults to 'y'. */
  axis?: Axis
  /** Clamp progress to [0,1]. Default true. */
  clamp?: boolean
  /** When true, returns 1 immediately and removes listeners. */
  disabled?: boolean
  /** Offset in pixels to treat the start sooner/later (positive = later). */
  startOffset?: number
  /** Offset in pixels to treat the end sooner/later (positive = later). */
  endOffset?: number
  /** Optional smoothing factor 0..1 for low‑pass filtering of progress (0 = none). */
  smoothing?: number
}

/**
 * Lightweight scroll progress hook that computes a 0..1 value for an element
 * across the viewport. It avoids perpetual RAF by only measuring on scroll/resize
 * and batches work via a single rAF tick. Respects reduced‑motion by returning 1.
 */
export function useScrollProgress(
  targetRef: RefObject<HTMLElement | null>,
  { axis = 'y', clamp = true, disabled = false, startOffset = 0, endOffset = 0, smoothing = 0.12 }: ScrollProgressOptions = {},
): number {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const targetRefValue = useRef(0)
  const rafIdRef = useRef<number | null>(null)
  const mountedRef = useRef(false)

  const compute = useMemo(() => {
    return () => {
      const el = targetRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const { w, h } = getViewportSize()
      // Define start when leading edge enters viewport, end when trailing edge leaves.
      const viewportStart = axis === 'y' ? 0 + startOffset : 0 + startOffset
      const viewportEnd = axis === 'y' ? h - endOffset : w - endOffset

      const lead = axis === 'y' ? rect.top : rect.left

      const total = Math.max(1, viewportEnd - viewportStart + (axis === 'y' ? rect.height : rect.width))
      const travelled = viewportEnd - lead
      const raw = travelled / total
      const next = clamp ? clamp01(raw) : raw

      if (smoothing <= 0) {
        progressRef.current = next
        setProgress(next)
        return
      }

      targetRefValue.current = next

      if (rafIdRef.current == null) {
        const step = () => {
          if (!mountedRef.current) { rafIdRef.current = null; return }
          const current = progressRef.current
          const target = targetRefValue.current
          const delta = target - current
          const alpha = Math.min(1, Math.max(0.01, smoothing))
          const nextValue = Math.abs(delta) < 0.001 ? target : current + delta * alpha
          progressRef.current = nextValue
          setProgress(nextValue)
          if (Math.abs(target - nextValue) >= 0.001) {
            rafIdRef.current = requestAnimationFrame(step)
          } else {
            rafIdRef.current = null
          }
        }
        rafIdRef.current = requestAnimationFrame(step)
      }
    }
  }, [axis, clamp, endOffset, startOffset, targetRef, smoothing])

  useEffect(() => {
    if (disabled || prefersReducedMotion) {
      setProgress(1)
      return
    }

    mountedRef.current = true

    const onChange = () => schedule(compute)
    window.addEventListener('scroll', onChange, { passive: true })
    window.addEventListener('resize', onChange)
    onChange()

    return () => {
      mountedRef.current = false
      window.removeEventListener('scroll', onChange)
      window.removeEventListener('resize', onChange)
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [compute, disabled, prefersReducedMotion])

  return progress
}
