import { renderHook, waitFor } from '@testing-library/react'
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
  })
})
