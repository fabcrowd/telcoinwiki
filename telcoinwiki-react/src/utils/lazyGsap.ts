import type { ScrollTriggerStatic } from 'gsap/ScrollTrigger'

type GsapModule = typeof import('gsap')

interface GsapBundle {
  gsap: GsapModule['gsap']
  ScrollTrigger: ScrollTriggerStatic
}

let gsapBundlePromise: Promise<GsapBundle> | null = null

export function loadGsapWithScrollTrigger(): Promise<GsapBundle> {
  if (gsapBundlePromise) {
    return gsapBundlePromise
  }

  let pluginRegistered = false

  gsapBundlePromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([gsapModule, scrollTriggerModule]) => {
      const gsapInstance = (gsapModule as unknown as GsapModule).gsap ?? (gsapModule as GsapModule).default

      if (!gsapInstance) {
        throw new Error('Failed to load GSAP instance')
      }

      const ScrollTrigger =
        scrollTriggerModule.ScrollTrigger ??
        (scrollTriggerModule as unknown as { default?: ScrollTriggerStatic }).default ??
        (scrollTriggerModule as unknown as ScrollTriggerStatic)

      if (!ScrollTrigger) {
        throw new Error('Failed to load GSAP ScrollTrigger plugin')
      }

      if (!pluginRegistered) {
        gsapInstance.registerPlugin(ScrollTrigger)
        pluginRegistered = true
      }

      return { gsap: gsapInstance, ScrollTrigger }
    },
  )

  return gsapBundlePromise
}
