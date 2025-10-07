import '@testing-library/jest-dom/vitest'
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
