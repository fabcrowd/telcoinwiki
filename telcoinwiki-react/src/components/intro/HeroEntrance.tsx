import { useEffect, useLayoutEffect } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

// Session flag to avoid replaying in a single SPA session
const INTRO_SESSION_KEY = 'tw_hero_entrance_done'

// Timings (ms)
// Increased delays to allow readers time to read each section before the next animation begins
const TITLE_MS = 780
const SUBTITLE_MS = 720
const SUBTITLE_DELAY_MS = 3000
const HEADER_MS = 700
const FADE_MS = 800

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function HeroEntrance() {
  const prefersReduced = usePrefersReducedMotion()

  useIsomorphicLayoutEffect(() => {
    // Only run on the Home page if the hero exists
    const root = document.documentElement
    const add = (cls: string) => root.classList.add(cls)
    const remove = (cls: string) => root.classList.remove(cls)
    const timeouts: number[] = []
    const trackTimeout = (cb: () => void, delay: number) => {
      const id = window.setTimeout(cb, delay)
      timeouts.push(id)
      return id
    }
    const cleanupRootState = () => {
      remove('intro-lock-sections')
      remove('intro-pending')
      remove('intro-header-hold')
      remove('intro-show-header')
      remove('intro-preload')
    }
    const hero = document.getElementById('home-hero')
    add('intro-preload')
    if (!hero) {
      cleanupRootState()
      return () => {
        cleanupRootState()
      }
    }

    // Do not repeat within this session
    let hasPlayed = false
    try {
      hasPlayed = Boolean(window.sessionStorage.getItem(INTRO_SESSION_KEY))
    } catch {
      /* ignore sessionStorage access failures, e.g., Safari private mode */
      hasPlayed = false
    }
    if (hasPlayed) {
      cleanupRootState()
      return () => {
        cleanupRootState()
      }
    }

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
      // Body starts 6000ms after title starts (allows ~3s to read subtitle)
      const bodyStartDelay = 6000
      // Header starts 10000ms after title starts (allows ~4s to read body text)
      const headerStartDelay = 10000

      const kickOffHeroCopy = () => {
        const setInitialHiddenState = () => {
          if (title) {
            title.style.opacity = '0'
            title.style.transform = 'translateX(-50vw)'
          }
          if (subtitle) {
            subtitle.style.opacity = '0'
            subtitle.style.transform = 'translateX(50vw)'
          }
          ;[...bodies, live].filter(Boolean).forEach((el) => {
            const node = el as HTMLElement
            node.style.opacity = '0'
          })
        }

        setInitialHiddenState()

        remove('intro-preload')
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
          trackTimeout(() => {
            if (subtitle) {
              subtitle.style.opacity = '1'
              subtitle.style.transform = 'translateX(0)'
            }
          }, subtitleStartDelay)

          trackTimeout(() => {
            ;[...bodies, live].filter(Boolean).forEach((el) => {
              const node = el as HTMLElement
              node.style.opacity = '1'
            })
          }, bodyStartDelay)

          trackTimeout(releaseHeader, headerStartDelay)
          return
        }

        if (title) {
          title.style.animation = `introSlideInLeft ${TITLE_MS}ms var(--transition-overshoot) forwards`
          title.style.opacity = '1'
        }

        trackTimeout(() => {
          if (subtitle) {
            subtitle.style.animation = `introSlideInRight ${SUBTITLE_MS}ms var(--transition-overshoot) forwards`
            subtitle.style.opacity = '1'
          }
        }, subtitleStartDelay)

        trackTimeout(() => {
          ;[...bodies, live].filter(Boolean).forEach((el) => {
            const node = el as HTMLElement
            node.style.animation = `introFadeIn ${FADE_MS}ms var(--transition-smooth) forwards`
            node.style.opacity = '1'
          })
        }, bodyStartDelay)

        trackTimeout(releaseHeader, headerStartDelay)
      }

      trackTimeout(kickOffHeroCopy, 80)
    }

    // 1) Watch the hero mask animation end on all layers
    const sequencer = document.querySelector('.hero-sequencer')
    const ended = new Set<EventTarget>()
    const maskFallback = trackTimeout(() => {
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
    let obs: MutationObserver | null = null
    if (!overlay) {
      overlayDone = true
      maybeStart()
    } else {
      obs = new MutationObserver(() => {
        if (!document.querySelector('.intro-reveal')) {
          overlayDone = true
          obs?.disconnect()
          obs = null
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
      timeouts.forEach((id) => window.clearTimeout(id))
      // Clean up MutationObserver
      if (obs) {
        obs.disconnect()
        obs = null
      }
      // Safety: never leave global intro classes behind on unmount/navigation
      cleanupRootState()
    }
  }, [prefersReduced])

  return null
}

export default HeroEntrance
