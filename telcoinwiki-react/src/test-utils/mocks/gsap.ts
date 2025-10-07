export interface ScrollTriggerMock {
  kill: () => void
  isActive: boolean
  progress: number
}

const createScrollTrigger = (): ScrollTriggerMock => ({
  kill: () => {},
  isActive: false,
  progress: 0,
})

const gsapInstance = {
  context: (fn: () => void) => {
    fn()
    return { revert: () => {} }
  },
  timeline: (options?: unknown) => {
    void options

    return {
      to: () => {},
      progress: () => 0,
      scrollTrigger: createScrollTrigger(),
      kill: () => {},
    }
  },
}

export const gsap = gsapInstance

export default gsapInstance
