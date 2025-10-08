import { render, screen, cleanup } from '@testing-library/react'
import { vi } from 'vitest'

import { InteractiveTopology } from '../InteractiveTopology'

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList
  }
}

const setMatchMedia = (overrides: Record<string, boolean>) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: overrides[query] ?? false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('InteractiveTopology', () => {
  beforeEach(() => {
    setMatchMedia({})
  })

  afterEach(() => {
    cleanup()
  })

  it('positions nodes with desktop coordinates by default', () => {
    render(<InteractiveTopology />)

    const associationButton = screen.getByRole('button', { name: /Telcoin Association/i }) as HTMLButtonElement

    expect(associationButton.style.left).toBe('50%')
    expect(associationButton.style.top).toBe('32%')
    expect(associationButton.style.width).toBe('15rem')

    const validatorEdgeTitle = screen.getAllByTitle('Validator policy sync')[0]
    const validatorEdgePath = validatorEdgeTitle.parentElement as SVGPathElement
    expect(validatorEdgePath.getAttribute('stroke-width')).toBe('2.2')
  })

  it('uses mobile coordinates and stroke widths on narrow screens', () => {
    setMatchMedia({
      '(max-width: 1024px)': true,
      '(max-width: 640px)': true,
    })

    render(<InteractiveTopology />)

    const associationButton = screen.getByRole('button', { name: /Telcoin Association/i }) as HTMLButtonElement
    expect(associationButton.style.left).toBe('50%')
    expect(associationButton.style.top).toBe('28%')
    expect(associationButton.style.width).toBe('min(64vw, 13.5rem)')

    const walletButton = screen.getByRole('button', { name: /Telcoin Wallet/i }) as HTMLButtonElement
    expect(walletButton.style.left).toBe('50%')
    expect(walletButton.style.top).toBe('86%')

    const validatorEdgeTitle = screen.getAllByTitle('Validator policy sync')[0]
    const validatorEdgePath = validatorEdgeTitle.parentElement as SVGPathElement
    expect(validatorEdgePath.getAttribute('stroke-width')).toBe('1.8')
  })
})
