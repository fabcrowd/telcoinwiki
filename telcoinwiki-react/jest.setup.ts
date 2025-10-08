import '@testing-library/jest-dom'

// Provide a cross-suite matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// requestAnimationFrame polyfill for tests
if (!('requestAnimationFrame' in window)) {
  // @ts-expect-error – JSDOM lacks RAF in some environments
  window.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16) as unknown as number
}
if (!('cancelAnimationFrame' in window)) {
  // @ts-expect-error – JSDOM lacks RAF in some environments
  window.cancelAnimationFrame = (handle: number) => clearTimeout(handle)
}

// ResizeObserver stub
if (!('ResizeObserver' in window)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error – provide minimal polyfill for tests
  window.ResizeObserver = ResizeObserverStub
}
