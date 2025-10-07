import '@testing-library/jest-dom/vitest'

import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

import { matchMediaMock, resetMatchMedia } from './test-utils/mediaQuery'

vi.mock('@studio-freight/lenis', () => {
  const mockInstance = {
    raf: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    destroy: vi.fn(),
  }

  const Lenis = vi.fn(() => mockInstance)

  return { default: Lenis }
})

vi.mock('gsap', () => {
  const revert = vi.fn()
  const context = vi.fn((fn: () => void) => {
    fn()
    return { revert }
  })

  const timeline = vi.fn(() => ({
    to: vi.fn(),
    progress: vi.fn(() => 0),
    scrollTrigger: { kill: vi.fn(), isActive: false, progress: 0 },
    kill: vi.fn(),
  }))

  return {
    gsap: {
      context,
      timeline,
      core: { Timeline: vi.fn() },
    },
  }
})

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    update: vi.fn(),
    refresh: vi.fn(),
  },
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
})

beforeEach(() => {
  resetMatchMedia()
})

afterEach(() => {
  cleanup()
})
