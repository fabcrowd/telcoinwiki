import { useEffect } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

// Session flag to avoid replaying in a single SPA session
const INTRO_SESSION_KEY = 'tw_hero_entrance_done'

// Timings (ms)
const TITLE_MS = 1125
const SUBTITLE_MS = 1125
const SUBTITLE_DELAY_MS = 1000
const HEADER_MS = 700
const FADE_MS = 3000

export function HeroEntrance() {
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    // Only run on the Home page if the hero exists
    const hero = document.getElementById('home-hero')
    if (!hero) return

    // Do not repeat within this session
    try {
      if (window.sessionStorage.getItem(INTRO_SESSION_KEY)) return
    } catch {
      /* ignore sessionStorage access failures, e.g., Safari private mode */
    }

    const root = document.documentElement
    const add = (cls: string) => root.classList.add(cls)
    const remove = (cls: string) => root.classList.remove(cls)

    // Lock non-hero content until first scroll
    add('intro-lock-sections')
    // Keep header offscreen and hero text hidden until we sequence
    add('intro-pending')
    add('intro-header-hold')

    // Helper: start the sequence when both overlay is gone and mask finished
    let overlayDone = false
    let maskDone = false
    let started = false

    const maybeStart = () => {
      if (started || !overlayDone || !maskDone) return
      started = true

      const title = hero.querySelector<HTMLElement>('[data-hero-title]')
      const subtitle = hero.querySelector<HTMLElement>('[data-hero-subtitle]')
      const bodies = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-body]'))
      const live = hero.querySelector<HTMLElement>('[data-hero-live]')

      let headerReleased = false

      const releaseHeader = () => {
        if (headerReleased) return
        headerReleased = true
        add('intro-show-header')
        remove('intro-header-hold')
        window.setTimeout(() => remove('intro-show-header'), HEADER_MS + 120)
      }

      const subtitleStartDelay = TITLE_MS + SUBTITLE_DELAY_MS
      const bodyStartDelay = subtitleStartDelay + SUBTITLE_MS
      const headerStartDelay = bodyStartDelay + FADE_MS + 160

      const kickOffHeroCopy = () => {
        remove('intro-pending')
        try {
          window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
        } catch {
          /* ignore sessionStorage persistence issues */
        }

        if (prefersReduced) {
          if (title) {
            title.style.opacity = '1'
            title.style.transform = 'translateX(0)'
          }
          window.setTimeout(() => {
            if (subtitle) {
              subtitle.style.opacity = '1'
              subtitle.style.transform = 'translateX(0)'
            }
          }, subtitleStartDelay)

          window.setTimeout(() => {
            ;[...bodies, live].filter(Boolean).forEach((el) => {
              const node = el as HTMLElement
              node.style.opacity = '1'
            })
          }, bodyStartDelay)

          window.setTimeout(releaseHeader, headerStartDelay)
          return
        }

        if (title) {
          title.style.animation = `introSlideInLeft ${TITLE_MS}ms var(--transition-overshoot) forwards`
          title.style.opacity = '1'
        }

        window.setTimeout(() => {
          if (subtitle) {
            subtitle.style.animation = `introSlideInRight ${SUBTITLE_MS}ms var(--transition-overshoot) forwards`
            subtitle.style.opacity = '1'
          }
        }, subtitleStartDelay)

        window.setTimeout(() => {
          ;[...bodies, live].filter(Boolean).forEach((el) => {
            const node = el as HTMLElement
            node.style.animation = `introFadeIn ${FADE_MS}ms var(--transition-smooth) forwards`
            node.style.opacity = '1'
          })
        }, bodyStartDelay)

        window.setTimeout(releaseHeader, headerStartDelay)
      }

      window.setTimeout(kickOffHeroCopy, 80)
    }

    // 1) Watch the hero mask animation end on all layers
    const sequencer = document.querySelector('.hero-sequencer')
    const ended = new Set<EventTarget>()
    const maskFallback = window.setTimeout(() => {
      maskDone = true
      maybeStart()
    }, 1600)
    const onAnimEnd = (e: Event) => {
      const evt = e as AnimationEvent
      const target = evt.target as Element
      // Only count the hero layer mask animations
      if (!target || !target.classList.contains('hero-layer')) return
      const name = evt.animationName || ''
      if (!name || !/heroMask/i.test(name)) return
      ended.add(target)
      const total = sequencer?.querySelectorAll('.hero-layer').length ?? 0
      if (total > 0 && ended.size >= total) {
        maskDone = true
        maybeStart()
      }
    }
    sequencer?.addEventListener('animationend', onAnimEnd, true)
    // Fallback in case mask animations are disabled or reduced

    // 2) Wait for the intro veil overlay to be removed (if present)
    const overlay = document.querySelector('.intro-reveal')
    if (!overlay) {
      overlayDone = true
      maybeStart()
    } else {
      const obs = new MutationObserver(() => {
        if (!document.querySelector('.intro-reveal')) {
          overlayDone = true
          obs.disconnect()
          maybeStart()
        }
      })
      obs.observe(document.body, { childList: true, subtree: true })
    }

    // 3) Unlock lower sections on first scroll
    const onFirstScroll = () => {
      remove('intro-lock-sections')
      window.removeEventListener('scroll', onFirstScroll)
    }
    window.addEventListener('scroll', onFirstScroll, { passive: true })

    return () => {
      sequencer?.removeEventListener('animationend', onAnimEnd, true)
      window.clearTimeout(maskFallback)
      window.removeEventListener('scroll', onFirstScroll)
      // Safety: never leave global intro classes behind on unmount/navigation
      const root = document.documentElement
      root.classList.remove('intro-lock-sections')
      root.classList.remove('intro-pending')
      root.classList.remove('intro-header-hold')
      root.classList.remove('intro-show-header')
    }
  }, [prefersReduced])

  return null
}

export default HeroEntrance
