import { useEffect, useMemo, useRef, useState } from 'react'

const INTRO_SESSION_KEY = 'tw_intro_shown'

// Simplified timing: show logo for 2 seconds, then fade out
const LOGO_DISPLAY_MS = 2000
const FADE_OUT_MS = 500

export function IntroReveal() {

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
  const [isFading, setIsFading] = useState(false)
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
        else if (prev) el.setAttribute('aria-hidden', prev)
      })
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive) return

    // Mark as shown for this session immediately to avoid replays on SPA nav/back
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    } catch {
      // Ignore sessionStorage persistence issues (e.g., Safari private mode)
    }

    // Simple: show logo for 2 seconds, then fade out
    const fadeTimeout = setTimeout(() => {
      setIsFading(true)
    }, LOGO_DISPLAY_MS)

    const hideTimeout = setTimeout(() => {
      setActive(false)
    }, LOGO_DISPLAY_MS + FADE_OUT_MS)

    return () => {
      clearTimeout(fadeTimeout)
      clearTimeout(hideTimeout)
    }
  }, [isActive])

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
      className={'intro-reveal' + (isFading ? ' intro-reveal--fading' : '')}
      role="dialog"
      aria-label="Loading Telcoin Wiki"
      aria-modal="true"
      tabIndex={-1}
      ref={containerRef}
    >
      <div className="intro-reveal__veil" aria-hidden="true" />
      <img
        className="intro-logo-static"
        src="/logo.svg"
        alt="Telcoin Wiki logo"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  )
}

export default IntroReveal
