import '@testing-library/jest-dom'

const noop = () => {}

const createMatchMedia = (matches = false) => ({
  matches,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addEventListener: noop,
  removeEventListener: noop,
  addListener: noop,
  removeListener: noop,
  dispatchEvent: () => false,
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    ...createMatchMedia(false),
    media: query,
  }),
})

if (!('requestAnimationFrame' in window)) {
  // @ts-expect-error – JSDOM lacks RAF in some environments
  window.requestAnimationFrame = (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 16) as unknown as number
}

if (!('cancelAnimationFrame' in window)) {
  // @ts-expect-error – JSDOM lacks RAF in some environments
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

  // @ts-expect-error – provide minimal stub for test environment
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

  // @ts-expect-error – provide minimal stub for test environment
  window.IntersectionObserver = IntersectionObserverStub
}

if (!('visibilityState' in document)) {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    enumerable: true,
    value: 'visible',
    writable: true,
  })
}

if (!('hidden' in document)) {
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    enumerable: true,
    value: false,
    writable: true,
  })
}
