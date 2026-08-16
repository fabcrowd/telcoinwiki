import { CONSENSUS, ECOSYSTEM, ECOSYSTEM_EDGES, ECOSYSTEM_IDS, isEcosystemId } from '../data'
import { PROTOCOL_SECTIONS } from '../../../components/protocol/sections'
import { SECTIONS as DEEP_DIVE_SECTIONS } from '../../../components/deepDive/sections'

describe('atlas ecosystem data', () => {
  it('has a unique, stable id for every entity matching its record key', () => {
    ECOSYSTEM_IDS.forEach((id) => expect(ECOSYSTEM[id].id).toBe(id))
    expect(new Set(ECOSYSTEM_IDS).size).toBe(ECOSYSTEM_IDS.length)
  })

  it('gives every entity a non-empty label, kicker, body and at least one fact', () => {
    ECOSYSTEM_IDS.forEach((id) => {
      const e = ECOSYSTEM[id]
      expect(e.label.trim().length).toBeGreaterThan(0)
      expect(e.kicker.trim().length).toBeGreaterThan(0)
      expect(e.body.trim().length).toBeGreaterThan(20)
      expect(e.facts.length).toBeGreaterThan(0)
    })
  })

  it('every edge endpoint references a real entity', () => {
    const bad = ECOSYSTEM_EDGES.filter((e) => !ECOSYSTEM_IDS.includes(e.a) || !ECOSYSTEM_IDS.includes(e.b))
    expect(bad).toEqual([])
  })

  it('has no self-referencing or duplicate edges', () => {
    const selfEdges = ECOSYSTEM_EDGES.filter((e) => e.a === e.b)
    expect(selfEdges).toEqual([])

    const seen = new Set<string>()
    const dupes = ECOSYSTEM_EDGES.filter((e) => {
      const key = [e.a, e.b].sort().join('::')
      if (seen.has(key)) return true
      seen.add(key)
      return false
    })
    expect(dupes).toEqual([])
  })

  it('every entity participates in at least one relationship (no orphan nodes)', () => {
    const connected = new Set<string>()
    ECOSYSTEM_EDGES.forEach((e) => {
      connected.add(e.a)
      connected.add(e.b)
    })
    const orphans = ECOSYSTEM_IDS.filter((id) => !connected.has(id))
    expect(orphans).toEqual([])
  })

  /**
   * The whole point of grounding the Atlas in the rest of the site is that
   * "Learn more" actually lands somewhere real. This is the regression guard
   * for that — same shape as the deep-dive and protocol anchor tests.
   */
  it('every entity href resolves to a real deep-dive or protocol section', () => {
    const protoIds = new Set(PROTOCOL_SECTIONS.map((s) => s.id))
    const deepIds = new Set(DEEP_DIVE_SECTIONS.map((s) => s.id))
    const broken: string[] = []

    ECOSYSTEM_IDS.forEach((id) => {
      const href = ECOSYSTEM[id].href
      if (href.startsWith('/protocol#')) {
        const anchor = href.replace('/protocol#', '')
        if (!protoIds.has(anchor)) broken.push(`${id} -> ${href}`)
      } else if (href.startsWith('/deep-dive#')) {
        const anchor = href.replace('/deep-dive#', '')
        if (!deepIds.has(anchor)) broken.push(`${id} -> ${href}`)
      } else {
        broken.push(`${id} -> ${href} (unrecognised route)`)
      }
    })

    expect(broken).toEqual([])
  })

  it('every entity has a non-empty hrefLabel', () => {
    ECOSYSTEM_IDS.forEach((id) => expect(ECOSYSTEM[id].hrefLabel.trim().length).toBeGreaterThan(0))
  })
})

describe('isEcosystemId', () => {
  it('accepts every real entity id', () => {
    ECOSYSTEM_IDS.forEach((id) => expect(isEcosystemId(id)).toBe(true))
  })

  it('rejects unknown strings, empty strings, null and undefined', () => {
    // This is the guard that stops a garbage ?node= query param (typo'd,
    // stale after a rename, or hand-crafted) from ever reaching ecoSelected.
    expect(isEcosystemId('not-a-real-entity')).toBe(false)
    expect(isEcosystemId('')).toBe(false)
    expect(isEcosystemId(null)).toBe(false)
    expect(isEcosystemId(undefined)).toBe(false)
  })
})

describe('atlas consensus constants', () => {
  it('keeps the quorum at a real 2f+1 majority of the validator set', () => {
    const f = Math.floor((CONSENSUS.validators.length - 1) / 3)
    expect(CONSENSUS.quorum).toBe(2 * f + 1)
    expect(CONSENSUS.quorum).toBeLessThanOrEqual(CONSENSUS.validators.length)
  })

  it('keeps the GC window wide enough that a quorum can always find eligible parents', () => {
    expect(CONSENSUS.keepRounds).toBeGreaterThanOrEqual(2)
  })
})
