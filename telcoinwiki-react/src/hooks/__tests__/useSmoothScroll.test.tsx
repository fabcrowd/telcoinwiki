import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSmoothScroll } from '../useSmoothScroll'

describe('useSmoothScroll', () => {
  it('reflects the prefers-reduced-motion media query and updates on change events', () => {
    const changeListeners: Array<(event: MediaQueryListEvent) => void> = []

    const matchMedia = vi.fn().mockImplementation((query: string) => {
      const mediaQueryList: MediaQueryList = {
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: vi.fn((event: string, listener: EventListenerOrEventListenerObject) => {
          if (event === 'change' && typeof listener === 'function') {
            changeListeners.push(listener as (event: MediaQueryListEvent) => void)
          }
        }),
        removeEventListener: vi.fn((event: string, listener: EventListenerOrEventListenerObject) => {
          if (event === 'change' && typeof listener === 'function') {
            const index = changeListeners.indexOf(listener as (event: MediaQueryListEvent) => void)
            if (index >= 0) {
              changeListeners.splice(index, 1)
            }
          }
        }),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }

      return mediaQueryList
    })

    const originalMatchMedia = window.matchMedia
    window.matchMedia = matchMedia

    try {
      const { result } = renderHook(() => useSmoothScroll())

      expect(result.current.prefersReducedMotion).toBe(true)
      expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')

      act(() => {
        changeListeners.forEach((listener) => listener({ matches: false } as MediaQueryListEvent))
      })

      expect(result.current.prefersReducedMotion).toBe(false)
    } finally {
      window.matchMedia = originalMatchMedia
    }
  })
})
