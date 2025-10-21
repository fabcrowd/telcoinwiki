import { useEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const INTRO_SESSION_KEY = 'tw_intro_shown'

// Timings (ms)
// Hold the filled logo for 3s, then short prelude and a longer, smoother fly
const STATIC_LOGO_MS = 3000
const PRELUDE_MS = 300
// Slightly longer fly for more travel through the logo
const FLY_MS = 1400

export function IntroReveal() {
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
  const [prelude, setPrelude] = useState(false)
  const [fly, setFly] = useState(false)
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
    } catch {
      // Ignore sessionStorage persistence issues (e.g., Safari private mode)
    }

    if (prefersReducedMotion) {
      // Minimal: short static, short fly, quick exit
      const ids: number[] = []
      const trackTimeout = (cb: () => void, delay: number) => {
        const id = window.setTimeout(cb, delay)
        ids.push(id)
        return id
      }
      trackTimeout(() => setPrelude(true), Math.min(500, STATIC_LOGO_MS))
      trackTimeout(() => setFly(true), Math.min(900, STATIC_LOGO_MS + PRELUDE_MS))
      trackTimeout(
        () => setActive(false),
        Math.min(1600, STATIC_LOGO_MS + PRELUDE_MS + FLY_MS),
      )
      return () => ids.forEach((id) => window.clearTimeout(id))
    }

    // Normal choreography: 3.0s static logo, 0.3s prelude, longer fly
    const ids: number[] = []
    const trackTimeout = (cb: () => void, delay: number) => {
      const id = window.setTimeout(cb, delay)
      ids.push(id)
      return id
    }
    trackTimeout(() => setPrelude(true), STATIC_LOGO_MS)
    trackTimeout(() => setFly(true), STATIC_LOGO_MS + PRELUDE_MS)
    trackTimeout(
      () => setActive(false),
      STATIC_LOGO_MS + PRELUDE_MS + FLY_MS + 100,
    )
    return () => ids.forEach((id) => window.clearTimeout(id))
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
        prelude ? 'is-prelude' : '',
        fly ? 'is-flying' : '',
      ].join(' ')}
      role="dialog"
      aria-label="Loading Telcoin Wiki"
      aria-modal="true"
      tabIndex={-1}
      ref={containerRef}
    >
      <div className="intro-reveal__veil" aria-hidden="true" />
      {/* 1) Static filled logo hold (2s) */}
      <img
        className="intro-logo-static"
        src="/logo.svg"
        alt="Telcoin Wiki logo"
        decoding="async"
        fetchPriority="high"
      />
      {/* Prelude: outline draw + subtle glint (no filled letters) */}
      <div className="intro-prelude" aria-hidden="true">
        <svg
          className="intro-prelude__svg"
          width="260"
          height="72"
          viewBox="0 0 260 72"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="introWikiStroke" x1="188" y1="10" x2="188" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#2DC9FF" />
              <stop offset="1" stopColor="#0F6BFF" />
            </linearGradient>
          </defs>
          {/* Telcoin stroke outline */}
          <path
            className="intro-prelude__telcoin"
            d="M1.349 23.181L9.810 23.181L9.810 46L15.586 46L15.586 23.181L24.047 23.181L24.047 18.364L1.349 18.364ZM34.684 46.405C39.811 46.405 43.266 43.908 44.076 40.063L38.759 39.712C38.179 41.290 36.694 42.114 34.778 42.114C31.904 42.114 30.082 40.211 30.082 37.121L30.082 37.107L44.197 37.107L44.197 35.528C44.197 28.484 39.933 25.003 34.454 25.003C28.355 25.003 24.401 29.335 24.401 35.731C24.401 42.303 28.301 46.405 34.684 46.405ZM30.082 33.545C30.204 31.183 31.998 29.294 34.549 29.294C37.045 29.294 38.772 31.075 38.786 33.545ZM54.267 18.364L48.519 18.364L48.519 46L54.267 46ZM68.790 46.405C74.309 46.405 77.777 43.166 78.047 38.403L72.623 38.403C72.285 40.616 70.828 41.857 68.858 41.857C66.172 41.857 64.432 39.604 64.432 35.636C64.432 31.723 66.186 29.483 68.858 29.483C70.963 29.483 72.312 30.873 72.623 32.938L78.047 32.938C77.804 28.147 74.174 25.003 68.763 25.003C62.475 25.003 58.589 29.362 58.589 35.717C58.589 42.019 62.407 46.405 68.790 46.405ZM91.680 46.405C97.968 46.405 101.882 42.100 101.882 35.717C101.882 29.294 97.968 25.003 91.680 25.003C85.392 25.003 81.478 29.294 81.478 35.717C81.478 42.100 85.392 46.405 91.680 46.405ZM91.707 41.952C88.806 41.952 87.321 39.293 87.321 35.677C87.321 32.060 88.806 29.388 91.707 29.388C94.554 29.388 96.039 32.060 96.039 35.677C96.039 39.293 94.554 41.952 91.707 41.952ZM106.203 46L111.952 46L111.952 25.273L106.203 25.273ZM109.091 22.601C110.805 22.601 112.208 21.292 112.208 19.686C112.208 18.094 110.805 16.785 109.091 16.785C107.390 16.785 105.987 18.094 105.987 19.686C105.987 21.292 107.390 22.601 109.091 22.601ZM122.858 34.017C122.872 31.345 124.464 29.780 126.785 29.780C129.093 29.780 130.482 31.291 130.469 33.828L130.469 46L136.218 46L136.218 32.803C136.218 27.972 133.384 25.003 129.066 25.003C125.989 25.003 123.762 26.514 122.831 28.930L122.588 28.930L122.588 25.273L117.110 25.273L117.110 46L122.858 46Z"
            fill="none"
            stroke="#F4F8FF"
            strokeWidth="1.25"
            strokeLinecap="round"
            pathLength={1}
          />
          {/* Wiki stroke outline */}
          <path
            className="intro-prelude__wiki"
            d="M154.623 46L160.317 46L165.567 27.931L165.783 27.931L171.045 46L176.740 46L184.648 18.364L178.265 18.364L173.690 37.607L173.447 37.607L168.414 18.364L162.949 18.364L157.902 37.566L157.673 37.566L153.098 18.364L146.715 18.364ZM188.227 46L193.976 46L193.976 25.273L188.227 25.273ZM191.115 22.601C192.829 22.601 194.232 21.292 194.232 19.686C194.232 18.094 192.829 16.785 191.115 16.785C189.414 16.785 188.011 18.094 188.011 19.686C188.011 21.292 189.414 22.601 191.115 22.601ZM199.134 46L204.882 46L204.882 39.415L206.434 37.647L212.088 46L218.822 46L210.739 34.246L218.430 25.273L211.832 25.273L205.193 33.140L204.882 33.140L204.882 18.364L199.134 18.364ZM221.807 46L227.556 46L227.556 25.273L221.807 25.273ZM224.695 22.601C226.409 22.601 227.812 21.292 227.812 19.686C227.812 18.094 226.409 16.785 224.695 16.785C222.995 16.785 221.591 18.094 221.591 19.686C221.591 21.292 222.995 22.601 224.695 22.601Z"
            fill="none"
            stroke="url(#introWikiStroke)"
            strokeWidth="1.25"
            strokeLinecap="round"
            pathLength={1}
          />
          {/* Glint dash traveling along stroke */}
          <path
            className="intro-prelude__glint intro-prelude__glint--telcoin"
            d="M1.349 23.181L9.810 23.181L9.810 46L15.586 46L15.586 23.181L24.047 23.181L24.047 18.364L1.349 18.364ZM34.684 46.405C39.811 46.405 43.266 43.908 44.076 40.063L38.759 39.712C38.179 41.290 36.694 42.114 34.778 42.114C31.904 42.114 30.082 40.211 30.082 37.121L30.082 37.107L44.197 37.107L44.197 35.528C44.197 28.484 39.933 25.003 34.454 25.003C28.355 25.003 24.401 29.335 24.401 35.731C24.401 42.303 28.301 46.405 34.684 46.405ZM30.082 33.545C30.204 31.183 31.998 29.294 34.549 29.294C37.045 29.294 38.772 31.075 38.786 33.545ZM54.267 18.364L48.519 18.364L48.519 46L54.267 46ZM68.790 46.405C74.309 46.405 77.777 43.166 78.047 38.403L72.623 38.403C72.285 40.616 70.828 41.857 68.858 41.857C66.172 41.857 64.432 39.604 64.432 35.636C64.432 31.723 66.186 29.483 68.858 29.483C70.963 29.483 72.312 30.873 72.623 32.938L78.047 32.938C77.804 28.147 74.174 25.003 68.763 25.003C62.475 25.003 58.589 29.362 58.589 35.717C58.589 42.019 62.407 46.405 68.790 46.405ZM91.680 46.405C97.968 46.405 101.882 42.100 101.882 35.717C101.882 29.294 97.968 25.003 91.680 25.003C85.392 25.003 81.478 29.294 81.478 35.717C81.478 42.100 85.392 46.405 91.680 46.405ZM91.707 41.952C88.806 41.952 87.321 39.293 87.321 35.677C87.321 32.060 88.806 29.388 91.707 29.388C94.554 29.388 96.039 32.060 96.039 35.677C96.039 39.293 94.554 41.952 91.707 41.952ZM106.203 46L111.952 46L111.952 25.273L106.203 25.273ZM109.091 22.601C110.805 22.601 112.208 21.292 112.208 19.686C112.208 18.094 110.805 16.785 109.091 16.785C107.390 16.785 105.987 18.094 105.987 19.686C105.987 21.292 107.390 22.601 109.091 22.601ZM122.858 34.017C122.872 31.345 124.464 29.780 126.785 29.780C129.093 29.780 130.482 31.291 130.469 33.828L130.469 46L136.218 46L136.218 32.803C136.218 27.972 133.384 25.003 129.066 25.003C125.989 25.003 123.762 26.514 122.831 28.930L122.588 28.930L122.588 25.273L117.110 25.273L117.110 46L122.858 46Z"
            fill="none"
            stroke="var(--palette-4)"
            strokeWidth="2.2"
            strokeLinecap="round"
            pathLength={1}
          />
          <path
            className="intro-prelude__glint intro-prelude__glint--wiki"
            d="M154.623 46L160.317 46L165.567 27.931L165.783 27.931L171.045 46L176.740 46L184.648 18.364L178.265 18.364L173.690 37.607L173.447 37.607L168.414 18.364L162.949 18.364L157.902 37.566L157.673 37.566L153.098 18.364L146.715 18.364ZM188.227 46L193.976 46L193.976 25.273L188.227 25.273ZM191.115 22.601C192.829 22.601 194.232 21.292 194.232 19.686C194.232 18.094 192.829 16.785 191.115 16.785C189.414 16.785 188.011 18.094 188.011 19.686C188.011 21.292 189.414 22.601 191.115 22.601ZM199.134 46L204.882 46L204.882 39.415L206.434 37.647L212.088 46L218.822 46L210.739 34.246L218.430 25.273L211.832 25.273L205.193 33.140L204.882 33.140L204.882 18.364L199.134 18.364ZM221.807 46L227.556 46L227.556 25.273L221.807 25.273ZM224.695 22.601C226.409 22.601 227.812 21.292 227.812 19.686C227.812 18.094 226.409 16.785 224.695 16.785C222.995 16.785 221.591 18.094 221.591 19.686C221.591 21.292 222.995 22.601 224.695 22.601Z"
            fill="none"
            stroke="var(--palette-5)"
            strokeWidth="2.2"
            strokeLinecap="round"
            pathLength={1}
          />
        </svg>
      </div>
    </div>
  )
}

export default IntroReveal
