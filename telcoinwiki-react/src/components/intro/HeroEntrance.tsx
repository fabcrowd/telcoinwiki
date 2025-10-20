import { useEffect } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

// Session flag to avoid replaying in a single SPA session
const INTRO_SESSION_KEY = 'tw_hero_entrance_done'

// Timings (ms)
const TITLE_MS = 900
const SUBTITLE_MS = 900
const HEADER_MS = 700
const FADE_MS = 1000

export function HeroEntrance() {
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    // Only run on the Home page if the hero exists
    const hero = document.getElementById('home-hero')
    if (!hero) return

    // Do not repeat within this session
    try {
      if (window.sessionStorage.getItem(INTRO_SESSION_KEY)) return
    } catch {}

    const root = document.documentElement
    const add = (cls: string) => root.classList.add(cls)
    const remove = (cls: string) => root.classList.remove(cls)

    // Lock non-hero content until first scroll
    add('intro-lock-sections')
    // Keep header offscreen and hero text hidden until we sequence
    add('intro-pending')

    // Helper: start the sequence when both overlay is gone and mask finished
    let overlayDone = false
    let maskDone = false
    let started = false

    const maybeStart = () => {
      if (started || !overlayDone || !maskDone) return
      started = true

      // Reduced motion: skip animations, reveal immediately
      if (prefersReduced) {
        remove('intro-pending')
        add('intro-show-header')
        window.setTimeout(() => {
          remove('intro-show-header')
          try { window.sessionStorage.setItem(INTRO_SESSION_KEY, '1') } catch {}
        }, 50)
        return
      }

      // Elements
      const title = hero.querySelector<HTMLElement>('[data-hero-title]')
      const subtitle = hero.querySelector<HTMLElement>('[data-hero-subtitle]')
      const bodies = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-body]'))
      const live = hero.querySelector<HTMLElement>('[data-hero-live]')

      // Title slide-in from right
      if (title) {
        title.style.animation = `introSlideInRight ${TITLE_MS}ms var(--transition-overshoot) forwards`
        title.style.opacity = '1'
      }

      // Subtitle starts when title is halfway to destination
      window.setTimeout(() => {
        if (subtitle) {
          subtitle.style.animation = `introSlideInLeft ${SUBTITLE_MS}ms var(--transition-overshoot) forwards`
          subtitle.style.opacity = '1'
        }
      }, Math.round(TITLE_MS * 0.5))

      // When both are in place, fade in remaining hero text + live pill
      const tailWait = Math.max(TITLE_MS, Math.round(TITLE_MS * 0.5) + SUBTITLE_MS)
      window.setTimeout(() => {
        ;[...bodies, live].filter(Boolean).forEach((el) => {
          const node = el as HTMLElement
          node.style.animation = `introFadeIn ${FADE_MS}ms var(--transition-smooth) forwards`
          node.style.opacity = '1'
        })

        // Slide header down from the top right after copy fades in
        window.setTimeout(() => {
          add('intro-show-header')
          // After header settles, clear the intro-pending state
          window.setTimeout(() => {
            remove('intro-pending')
            // Mark session done
            try { window.sessionStorage.setItem(INTRO_SESSION_KEY, '1') } catch {}
            // Allow header rule to clean up
            window.setTimeout(() => remove('intro-show-header'), 60)
          }, HEADER_MS + 60)
        }, FADE_MS + 40)
      }, tailWait + 40)
    }

    // 1) Watch the hero mask animation end on all layers
    const sequencer = document.querySelector('.hero-sequencer')
    let ended = new Set<EventTarget>()
    let maskFallback: number | undefined
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
    maskFallback = window.setTimeout(() => {
      maskDone = true
      maybeStart()
    }, 1600)

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
      if (maskFallback) window.clearTimeout(maskFallback)
      window.removeEventListener('scroll', onFirstScroll)
    }
  }, [prefersReduced])

  return null
}

export default HeroEntrance

