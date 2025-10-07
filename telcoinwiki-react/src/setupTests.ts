import '@testing-library/jest-dom/vitest'
 codex/wrap-animation-initialization-in-checks

import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

import { matchMediaMock, resetMatchMedia } from './test-utils/mediaQuery.ts'

vi.mock('@studio-freight/lenis', async () => ({
  ...(await import('./test-utils/mocks/lenis.ts')),
}))

vi.mock('gsap', async () => {
  const module = await import('./test-utils/mocks/gsap.ts')
  return { ...module, gsap: module.default }
})

vi.mock('gsap/ScrollTrigger', async () => ({
  ...(await import('./test-utils/mocks/gsapScrollTrigger.ts')),
}))

const { resetLenisMock } = await import('./test-utils/mocks/lenis.ts')
const { resetGsapMock } = await import('./test-utils/mocks/gsap.ts')
const { resetScrollTriggerMock } = await import('./test-utils/mocks/gsapScrollTrigger.ts')

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
})

class MockResizeObserver {
  observe = vi.fn<(target: Element) => void>()
  unobserve = vi.fn<(target: Element) => void>()
  disconnect = vi.fn<() => void>()
}

class MockIntersectionObserver {
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe = vi.fn<(target: Element) => void>()
  unobserve = vi.fn<(target: Element) => void>()
  disconnect = vi.fn<() => void>()
  takeRecords = vi.fn<() => IntersectionObserverEntry[]>(() => [])

  trigger(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this)
  }
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
})

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})

beforeEach(() => {
  vi.clearAllMocks()
  resetMatchMedia()
  resetLenisMock()
  resetGsapMock()
  resetScrollTriggerMock()
})

afterEach(() => {
  cleanup()
})
=======
import { vi } from 'vitest'

const createMatchMedia = (matches = false) => ({
  matches,
  media: '(prefers-reduced-motion: reduce)',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    ...createMatchMedia(false),
    media: query,
  })),
})

if (!('requestAnimationFrame' in window)) {
  window.requestAnimationFrame = (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 16) as unknown as number
}

if (!('cancelAnimationFrame' in window)) {
  window.cancelAnimationFrame = (handle: number) => {
    window.clearTimeout(handle)
  }
}

if (!('ResizeObserver' in window)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // @ts-expect-error - provide minimal stub for test environment
  window.ResizeObserver = ResizeObserverStub
}

if (!('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }

  // @ts-expect-error - provide minimal stub for test environment
  window.IntersectionObserver = IntersectionObserverStub
}
 main
