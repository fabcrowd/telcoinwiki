import { render, screen, cleanup } from '@testing-library/react'

import { InteractiveTopology } from '../InteractiveTopology'

const setMatchMedia = (overrides: Record<string, boolean>) => {
  // @ts-ignore
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: overrides[query] ?? false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
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
    const associationWrapper = associationButton.parentElement as HTMLDivElement

    expect(associationWrapper.style.left).toBe('50%')
    expect(associationWrapper.style.top).toBe('32%')
    expect(associationButton.style.width).toBe('15rem')

    const validatorTitleEl = screen.getAllByText('Validator policy sync', { selector: 'title' })[0]
    const validatorEdgePath = validatorTitleEl.parentElement as SVGPathElement
    expect(validatorEdgePath.getAttribute('stroke-width')).toBe('2.2')
  })

  it('uses mobile coordinates and stroke widths on narrow screens', () => {
    setMatchMedia({
      '(max-width: 1024px)': true,
      '(max-width: 640px)': true,
    })

    render(<InteractiveTopology />)

    const associationButton = screen.getByRole('button', { name: /Telcoin Association/i }) as HTMLButtonElement
    const associationWrapper = associationButton.parentElement as HTMLDivElement
    expect(associationWrapper.style.left).toBe('50%')
    expect(associationWrapper.style.top).toBe('28%')
    expect(associationButton.style.width).toBe('min(64vw, 13.5rem)')

    const walletButton = screen.getByRole('button', { name: /Telcoin Wallet/i }) as HTMLButtonElement
    const walletWrapper = walletButton.parentElement as HTMLDivElement
    expect(walletWrapper.style.left).toBe('50%')
    expect(walletWrapper.style.top).toBe('86%')

    const validatorTitleEl = screen.getAllByText('Validator policy sync', { selector: 'title' })[0]
    const validatorEdgePath = validatorTitleEl.parentElement as SVGPathElement
    expect(validatorEdgePath.getAttribute('stroke-width')).toBe('1.8')
  })
})
