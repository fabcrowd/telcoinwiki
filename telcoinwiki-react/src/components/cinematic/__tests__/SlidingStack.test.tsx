import { render, cleanup } from '@testing-library/react'

import { SlidingStack } from '../SlidingStack'

const setMatchMedia = (overrides: Record<string, boolean>) => {
  // @ts-expect-error - we mock matchMedia in tests
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

const ITEMS = [
  { id: 'one', title: 'One', body: 'First card copy' },
  { id: 'two', title: 'Two', body: 'Second card copy' },
  { id: 'three', title: 'Three', body: 'Third card copy' },
]

describe('SlidingStack', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders static layout when reduced motion is preferred', () => {
    setMatchMedia({})

    const handleProgress = jest.fn()
    render(<SlidingStack items={ITEMS} prefersReducedMotion onProgressChange={handleProgress} />)

    const container = document.querySelector('[data-sliding-stack]') as HTMLDivElement
    expect(container).toBeTruthy()
    expect(container.classList.contains('sliding-stack--static')).toBe(true)

    const cards = Array.from(document.querySelectorAll('.sliding-stack__card')) as HTMLElement[]
    expect(cards).toHaveLength(3)
    cards.forEach((card) => {
      expect(card.classList.contains('is-active')).toBe(false)
    })
    expect(handleProgress).toHaveBeenCalledWith(1)
  })

  it('uses static layout on handheld breakpoints', () => {
    setMatchMedia({
      '(max-width: 62rem)': true,
      '(max-width: 40rem)': true,
    })

    render(<SlidingStack items={ITEMS} prefersReducedMotion={false} />)

    const container = document.querySelector('[data-sliding-stack]') as HTMLDivElement
    expect(container.classList.contains('sliding-stack--static')).toBe(true)
  })
})
