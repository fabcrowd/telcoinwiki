import { act } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntroReveal } from '../IntroReveal'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'

jest.mock('../../../hooks/usePrefersReducedMotion')

const INTRO_SESSION_KEY = 'tw_intro_shown'
const mockUsePrefersReducedMotion = usePrefersReducedMotion as jest.MockedFunction<
  typeof usePrefersReducedMotion
>

const mountAppChrome = () => {
  const header = document.createElement('header')
  header.className = 'site-header'
  const main = document.createElement('main')
  main.className = 'site-main'
  const footer = document.createElement('footer')
  document.body.append(header, main, footer)
  return { header, main, footer }
}

const advanceToNextTimer = () => {
  act(() => {
    jest.advanceTimersToNextTimer()
  })
}

describe('IntroReveal', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    sessionStorage.clear()
    document.body.innerHTML = ''
    document.body.style.overflow = ''
    mockUsePrefersReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('locks focus, runs the full reveal sequence, and restores document chrome afterwards', () => {
    const { header, main, footer } = mountAppChrome()
    document.body.style.overflow = 'scroll'

    render(<IntroReveal />)

    const dialog = screen.getByRole('dialog', { name: 'Loading Telcoin Wiki' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveFocus()
    expect(sessionStorage.getItem(INTRO_SESSION_KEY)).toBe('1')
    expect(document.body.style.overflow).toBe('hidden')

    expect(header).toHaveAttribute('inert', '')
    expect(header).toHaveAttribute('aria-hidden', 'true')
    expect(main).toHaveAttribute('inert', '')
    expect(main).toHaveAttribute('aria-hidden', 'true')
    expect(footer).toHaveAttribute('inert', '')
    expect(footer).toHaveAttribute('aria-hidden', 'true')

    advanceToNextTimer()
    expect(dialog).toHaveClass('is-prelude')

    advanceToNextTimer()
    expect(dialog).toHaveClass('is-flying')

    advanceToNextTimer()
    expect(screen.queryByRole('dialog', { name: 'Loading Telcoin Wiki' })).toBeNull()
    expect(document.body.style.overflow).toBe('scroll')
    ;[header, main, footer].forEach((el) => {
      expect(el.hasAttribute('inert')).toBe(false)
      expect(el.hasAttribute('aria-hidden')).toBe(false)
    })
    expect(jest.getTimerCount()).toBe(0)
  })

  it('honors reduced motion timings and can be dismissed with Escape', async () => {
    mockUsePrefersReducedMotion.mockReturnValue(true)
    mountAppChrome()

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<IntroReveal />)

    const dialog = screen.getByRole('dialog', { name: 'Loading Telcoin Wiki' })
    expect(dialog).toHaveClass('intro-reveal--reduced')

    advanceToNextTimer()
    expect(dialog).toHaveClass('is-prelude')

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: 'Loading Telcoin Wiki' })).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(sessionStorage.getItem(INTRO_SESSION_KEY)).toBe('1')
    expect(jest.getTimerCount()).toBe(0)
  })

  it('skips rendering when the intro was already seen in this session', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false)
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    const { header, main, footer } = mountAppChrome()
    document.body.style.overflow = 'visible'

    render(<IntroReveal />)

    expect(screen.queryByRole('dialog', { name: 'Loading Telcoin Wiki' })).toBeNull()
    expect(document.body.style.overflow).toBe('visible')
    ;[header, main, footer].forEach((el) => {
      expect(el.hasAttribute('inert')).toBe(false)
      expect(el.hasAttribute('aria-hidden')).toBe(false)
    })
    expect(jest.getTimerCount()).toBe(0)
  })
})
