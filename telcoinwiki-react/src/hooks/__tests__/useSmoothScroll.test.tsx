import { renderHook, waitFor } from '@testing-library/react'
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
  gsap: {
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
  })
})
