import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { timelineMock, contextMock } = vi.hoisted(() => {
  const timeline = vi.fn(() => ({
    kill: vi.fn(),
    scrollTrigger: { kill: vi.fn() },
  }))

  const context = vi.fn((callback?: (ctx: unknown) => void) => {
    const ctx = {
      revert: vi.fn(),
      add: vi.fn(),
      ignore: vi.fn(),
      kill: vi.fn(),
      clear: vi.fn(),
      isReverted: false,
    }

    if (callback) {
      callback(ctx)
    }

    return ctx
  })

  return { timelineMock: timeline, contextMock: context }
})

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    timeline: timelineMock,
    context: contextMock,
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    refresh: vi.fn(),
    update: vi.fn(),
  },
}))

import { useScrollTimeline } from '../useScrollTimeline'

describe('useScrollTimeline', () => {
  beforeEach(() => {
    timelineMock.mockClear()
    contextMock.mockClear()
  })

  it('skips timeline creation when no target is provided (reduced motion)', () => {
    const createSpy = vi.fn()

    const { unmount } = renderHook(() =>
      useScrollTimeline({
        target: null,
        create: createSpy,
      }),
    )

    expect(timelineMock).not.toHaveBeenCalled()
    expect(contextMock).not.toHaveBeenCalled()
    expect(createSpy).not.toHaveBeenCalled()

    unmount()
  })
})
