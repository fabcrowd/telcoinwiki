import { describe, it, expect } from '@jest/globals'
import { DEFAULT_CINEMATIC, type CinematicConfig } from '../../config/cinematic'
import { loadCinematicConfig } from '../cinematicConfig'

// Patch fetch in this module scope
const g = globalThis as unknown as { fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> }

describe('loadCinematicConfig', () => {
  it('falls back to defaults on fetch error', async () => {
    // @ts-expect-error – minimal mock
    g.fetch = async () => ({ ok: false })
    const cfg = await loadCinematicConfig()
    expect(cfg.heroLayers.length).toBe(DEFAULT_CINEMATIC.heroLayers.length)
    expect(cfg.marquee.items.length).toBe(DEFAULT_CINEMATIC.marquee.items.length)
  })

  it('merges user JSON when present', async () => {
    const user: Partial<CinematicConfig> = {
      marquee: { speedSec: 40, items: [{ id: 'x', label: 'X' }] },
    }
    // @ts-expect-error – minimal mock
    g.fetch = async () => ({ ok: true, json: async () => user })
    const cfg = await loadCinematicConfig()
    expect(cfg.marquee.speedSec).toBe(40)
    expect(cfg.marquee.items[0].label).toBe('X')
    // hero layers still present from defaults
    expect(cfg.heroLayers.length).toBeGreaterThan(0)
  })
})
