import { useEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const INTRO_SESSION_KEY = 'tw_intro_shown'

// Timings (ms)
const LOGO_FADE_MS = 1000
// Start fly immediately after fade completes so total ≈ 3s
const HOLD_BEFORE_FLY_MS = LOGO_FADE_MS // 1000ms
const FLY_MS = 2000
const FADE_OUT_OVERLAY_MS = 600 // overlaps tail of fly

export interface IntroRevealProps {
  /** Path to the logo SVG used for the reveal. Default: "/logo.svg" */
  logoSrc?: string
}

export function IntroReveal({ logoSrc = '/logo.svg' }: IntroRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Show only once per session
  const shouldShow = useMemo(() => {
    if (typeof window === 'undefined') return false
    try {
      return !window.sessionStorage.getItem(INTRO_SESSION_KEY)
    } catch {
      // In case storage is blocked, still show once
      return true
    }
  }, [])

  const [isActive, setActive] = useState(shouldShow)
  const [fly, setFly] = useState(false)
  const timeouts = useRef<number[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Body scroll lock while active
  useEffect(() => {
    if (!isActive) return
    const body = document.body
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    // Focus the overlay container to prevent accidental keyboard activation underneath
    containerRef.current?.focus()

    // Make underlying chrome inert to keyboard/screen-reader focus
    const toInert = Array.from(
      document.querySelectorAll<HTMLElement>('header.site-header, main.site-main, footer')
    )
    const prevInert = new Map<HTMLElement, boolean>()
    const prevAriaHidden = new Map<HTMLElement, string | null>()
    toInert.forEach((el) => {
      prevInert.set(el, el.hasAttribute('inert'))
      prevAriaHidden.set(el, el.getAttribute('aria-hidden'))
      el.setAttribute('inert', '')
      el.setAttribute('aria-hidden', 'true')
    })
    return () => {
      body.style.overflow = prevOverflow
      toInert.forEach((el) => {
        if (!prevInert.get(el)) el.removeAttribute('inert')
        const prev = prevAriaHidden.get(el)
        if (prev === null) el.removeAttribute('aria-hidden')
        else el.setAttribute('aria-hidden', prev)
      })
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive) return

    // Mark as shown for this session immediately to avoid replays on SPA nav/back
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    } catch {}

    if (prefersReducedMotion) {
      // Minimal: quick fade-in then out
      const t1 = window.setTimeout(() => setFly(true), Math.min(900, HOLD_BEFORE_FLY_MS))
      const t2 = window.setTimeout(() => setActive(false), Math.min(1400, HOLD_BEFORE_FLY_MS + FLY_MS))
      timeouts.current.push(t1, t2)
      return () => {
        timeouts.current.forEach((id) => window.clearTimeout(id))
      }
    }

    // Normal choreography
    const tFly = window.setTimeout(() => setFly(true), HOLD_BEFORE_FLY_MS)
    const tDone = window.setTimeout(() => setActive(false), HOLD_BEFORE_FLY_MS + Math.max(FLY_MS, FADE_OUT_OVERLAY_MS) + 100)
    timeouts.current.push(tFly, tDone)
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id))
    }
  }, [isActive, prefersReducedMotion])

  // Accessibility: allow ESC to skip
  useEffect(() => {
    if (!isActive) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive])

  if (!isActive) return null

  return (
    <div
      className={[
        'intro-reveal',
        prefersReducedMotion ? 'intro-reveal--reduced' : '',
        fly ? 'is-flying' : '',
      ].join(' ')}
      role="dialog"
      aria-label="Loading Telcoin Wiki"
      aria-modal="true"
      tabIndex={-1}
      ref={containerRef}
    >
      <div className="intro-reveal__veil" aria-hidden="true" />
      <img
        src={logoSrc}
        alt="Telcoin Wiki logo"
        className="intro-reveal__logo"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  )
}

export default IntroReveal
