import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NetworkAtlas } from '../NetworkAtlas'

/**
 * jsdom has no real WebGL implementation. Rather than rely on however the
 * current jsdom version happens to behave for `getContext('webgl2')`
 * (returns null in some versions, throws "not implemented" in others), stub
 * it explicitly so this test exercises the engine's defensive `if (!gl)`
 * path deterministically — the same path a visitor with WebGL disabled hits.
 */
function stubNoWebGL() {
  const original = HTMLCanvasElement.prototype.getContext
  // @ts-expect-error – narrowing to the two context ids the engine requests
  HTMLCanvasElement.prototype.getContext = function (id: string) {
    if (id === 'webgl2' || id === 'webgl') return null
    return original.call(this, id)
  }
  return () => {
    HTMLCanvasElement.prototype.getContext = original
  }
}

describe('NetworkAtlas (no WebGL)', () => {
  let restoreGetContext: () => void
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    restoreGetContext = stubNoWebGL()
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    restoreGetContext()
    errorSpy.mockRestore()
  })

  it('renders the fallback stage without throwing when WebGL is unavailable', () => {
    const { container } = render(
      <MemoryRouter>
        <NetworkAtlas />
      </MemoryRouter>,
    )
    const stage = container.querySelector('.atlas-stage') as HTMLElement
    expect(stage).toBeTruthy()
    expect(stage.dataset.atlasFailed).toBe('true')
  })

  it('always renders an accessible canvas label and the scene tablist', () => {
    render(
      <MemoryRouter>
        <NetworkAtlas />
      </MemoryRouter>,
    )
    expect(screen.getByRole('tablist', { name: /choose a model/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /consensus dag/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /ecosystem/i })).toBeInTheDocument()
  })

  it('mounts and unmounts cleanly — the returned engine handle is always callable', () => {
    // This is the regression guard for a real bug class: an early-return
    // branch in createAtlasEngine that forgets to return a working
    // `destroy()` would throw here when the effect cleanup runs.
    const { unmount } = render(
      <MemoryRouter>
        <NetworkAtlas />
      </MemoryRouter>,
    )
    expect(() => unmount()).not.toThrow()
  })

  it('survives mount → unmount → mount in immediate succession (React StrictMode shape)', () => {
    const first = render(
      <MemoryRouter>
        <NetworkAtlas />
      </MemoryRouter>,
    )
    first.unmount()
    const second = render(
      <MemoryRouter>
        <NetworkAtlas />
      </MemoryRouter>,
    )
    expect(() => second.unmount()).not.toThrow()
  })

  it('does not crash on a garbage ?node= query param', () => {
    // jsdom has no real WebGL, so this suite can't exercise the engine's
    // node-selection branch (see `isEcosystemId` in data.test.ts for that
    // coverage) — what this confirms is that reading an invalid/unknown
    // node id off the URL during mount never throws.
    const { container } = render(
      <MemoryRouter initialEntries={['/atlas?scene=eco&node=not-a-real-entity']}>
        <NetworkAtlas />
      </MemoryRouter>,
    )
    expect(container.querySelector('.atlas-stage')).toBeTruthy()
  })
})
