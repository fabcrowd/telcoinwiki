import { render, cleanup } from '@testing-library/react'

import { SlidingStack } from '../SlidingStack'

const setMatchMedia = (overrides: Record<string, boolean>) => {
  // @ts-expect-error – we mock matchMedia in tests
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

  it('applies desktop stacking offsets and min height', () => {
    setMatchMedia({})

    render(<SlidingStack items={ITEMS} progress={0.5} />)

    const container = document.querySelector('[data-sliding-stack]') as HTMLDivElement
    expect(container).toBeTruthy()
    expect(container.style.minHeight).toBe('552px')

    const cards = Array.from(document.querySelectorAll('.sliding-stack__card')) as HTMLElement[]
    expect(cards).toHaveLength(3)
<<<<<<< HEAD
    expect(cards[0].style.getPropertyValue('--stack-translate')).toBe('-76.000px')
    expect(cards[0].style.getPropertyValue('--stack-scale')).toBe('1.000')
    expect(cards[0].style.getPropertyValue('--stack-opacity')).toBe('0.180')

    expect(cards[2].style.getPropertyValue('--stack-translate')).toBe('76.000px')
    expect(cards[2].style.getPropertyValue('--stack-scale')).toBe('0.945')
    expect(cards[2].style.getPropertyValue('--stack-opacity')).toBe('1.000')
=======
    expect(cards[0].style.transform).toBe('translateY(-76.000px) scale(1.000)')
    expect(cards[0].style.opacity).toBe('0.18')

    expect(cards[2].style.transform).toBe('translateY(83.680px) scale(0.933)')
    expect(cards[2].style.opacity).toBe('0.942')
>>>>>>> origin/main
  })

  it('switches to static layout on handheld breakpoints', () => {
    setMatchMedia({
      '(max-width: 62rem)': true,
      '(max-width: 40rem)': true,
    })

    render(<SlidingStack items={ITEMS} progress={0.25} />)

    const container = document.querySelector('[data-sliding-stack]') as HTMLDivElement
    expect(container.classList.contains('sliding-stack--static')).toBe(true)
    expect(container.style.minHeight).toBe('')

    const cards = Array.from(document.querySelectorAll('.sliding-stack__card')) as HTMLElement[]
<<<<<<< HEAD
    // In static mode vars still compute, but CSS sets transform: none;
    // For progress=0.25 (normalized 0.5) the first card is -28px, second is 28px at handheld translate unit 56
    expect(cards[0].style.getPropertyValue('--stack-translate')).toBe('-28.000px')
    expect(cards[1].style.getPropertyValue('--stack-translate')).toBe('28.000px')
=======
    // In static mode transforms and opacity are handled in CSS, so inline styles are cleared
    expect(cards[0].style.transform).toBe('')
    expect(cards[1].style.transform).toBe('')
>>>>>>> origin/main
  })
})
