import { renderHook, waitFor } from '@testing-library/react'
 codex/wrap-animation-initialization-in-checks
import { describe, expect, it, vi } from 'vitest'

import { setMatchMedia } from '../../test-utils/mediaQuery'
import { lenisConstructorMock, lenisMockInstance } from '../../test-utils/mocks/lenis'
import { ScrollTrigger } from '../../test-utils/mocks/gsapScrollTrigger'
import { useSmoothScroll } from '../useSmoothScroll'

describe('useSmoothScroll', () => {
  it('disables Lenis timelines when prefers-reduced-motion is enabled', () => {
    setMatchMedia('(prefers-reduced-motion: reduce)', true)

    const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

    const { result, unmount } = renderHook(() => useSmoothScroll())

    expect(result.current.prefersReducedMotion).toBe(true)
    expect(result.current.lenis).toBeNull()
    expect(rafSpy).not.toHaveBeenCalled()

    unmount()
    rafSpy.mockRestore()
  })

  it('initialises Lenis and binds ScrollTrigger when enabled', async () => {
    setMatchMedia('(prefers-reduced-motion: reduce)', false)

    let frameCount = 0
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        if (frameCount === 0) {
          frameCount += 1
          callback(performance.now())
        }

        return 1 as unknown as number
      })
    const cancelSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {})

    const { result, unmount } = renderHook(() => useSmoothScroll())

    await waitFor(() => {
      expect(lenisConstructorMock).toHaveBeenCalledTimes(1)
    })

    expect(result.current.prefersReducedMotion).toBe(false)
    expect(lenisConstructorMock).toHaveBeenCalledWith(
      expect.objectContaining({ smoothWheel: true, smoothTouch: false }),
    )
    expect(lenisMockInstance.on).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(ScrollTrigger.refresh).toHaveBeenCalledTimes(1)
    expect(rafSpy).toHaveBeenCalled()

    unmount()
    rafSpy.mockRestore()
    cancelSpy.mockRestore()
=======
import { describe, expect, it, vi, beforeEach } from 'vitest'

const { lenisInstances, LenisConstructor, scrollTriggerMock } = vi.hoisted(() => {
  const instances: Array<{
    on: ReturnType<typeof vi.fn>
    off: ReturnType<typeof vi.fn>
    raf: ReturnType<typeof vi.fn>
    destroy: ReturnType<typeof vi.fn>
  }> = []

  const constructor = vi.fn(() => {
    const instance = {
      on: vi.fn(),
      off: vi.fn(),
      raf: vi.fn(),
      destroy: vi.fn(),
    }

    instances.push(instance)
    return instance
  })

  const scrollTrigger = {
    refresh: vi.fn(),
    update: vi.fn(),
  }

  return { lenisInstances: instances, LenisConstructor: constructor, scrollTriggerMock: scrollTrigger }
})

vi.mock('@studio-freight/lenis', () => ({
  default: LenisConstructor,
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: scrollTriggerMock,
}))

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    context: vi.fn((callback?: () => void) => {
      if (callback) {
        callback()
      }

      return {
        revert: vi.fn(),
      }
    }),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      kill: vi.fn(),
      progress: vi.fn(() => 0),
      scrollTrigger: { kill: vi.fn() },
    })),
  },
}))

import { useSmoothScroll } from '../useSmoothScroll'

describe('useSmoothScroll', () => {
  beforeEach(() => {
    lenisInstances.length = 0
    LenisConstructor.mockClear()
    scrollTriggerMock.refresh.mockClear()
    scrollTriggerMock.update.mockClear()
  })

  it('disables Lenis when the user prefers reduced motion', async () => {
    const matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const originalMatchMedia = window.matchMedia
    window.matchMedia = matchMedia as unknown as typeof window.matchMedia

    try {
      const { result } = renderHook(() => useSmoothScroll())

      expect(result.current.prefersReducedMotion).toBe(true)

      await waitFor(() => {
        expect(LenisConstructor).not.toHaveBeenCalled()
      })
    } finally {
      window.matchMedia = originalMatchMedia
    }
 main
  })
})
