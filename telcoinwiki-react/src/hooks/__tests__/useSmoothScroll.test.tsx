import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { setMatchMedia } from '../../test-utils/mediaQuery'
import { useSmoothScroll } from '../useSmoothScroll'

describe('useSmoothScroll', () => {
  it('disables Lenis timelines when prefers-reduced-motion is enabled', () => {
    setMatchMedia('(prefers-reduced-motion: reduce)', true)

    const rafSpy = vi.spyOn(window, 'requestAnimationFrame')

    const { result } = renderHook(() => useSmoothScroll())

    expect(result.current.prefersReducedMotion).toBe(true)
    expect(result.current.lenis).toBeNull()
    expect(rafSpy).not.toHaveBeenCalled()

    rafSpy.mockRestore()
  })
})
