import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { PROTOCOL_SECTIONS } from '../sections'
import { megaMenuSections } from '../../../config/megaMenu'
import { NAV_ITEMS } from '../../../config/navigation'
import { PAGE_META } from '../../../config/pageMeta'

const SRC_ROOT = join(__dirname, '..', '..', '..')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' || entry === '__mocks__' ? [] : sourceFiles(full)
    }
    return /\.tsx?$/.test(entry) ? [full] : []
  })
}

describe('protocol reference sections', () => {
  const ids = new Set(PROTOCOL_SECTIONS.map((s) => s.id))

  it('defines unique section ids', () => {
    expect(ids.size).toBe(PROTOCOL_SECTIONS.length)
  })

  it('gives every section a title and a short TOC chip label', () => {
    PROTOCOL_SECTIONS.forEach((s) => {
      expect(s.title.trim().length).toBeGreaterThan(3)
      expect(s.chip.trim().length).toBeGreaterThan(1)
      // Chips sit in a single wrapping row; long labels wreck that layout.
      expect(s.chip.length).toBeLessThanOrEqual(22)
      expect(s.content).toBeTruthy()
    })
  })

  it('namespaces every id so it cannot collide with a deep-dive anchor', () => {
    PROTOCOL_SECTIONS.forEach((s) => expect(s.id.startsWith('proto-')).toBe(true))
  })

  /** Same guard as the deep dive: anchors are invisible to the type system. */
  it('has no reference to an undefined /protocol anchor', () => {
    const broken: string[] = []
    for (const file of sourceFiles(SRC_ROOT)) {
      const contents = readFileSync(file, 'utf8')
      for (const m of contents.matchAll(/\/protocol#([a-z0-9-]+)/g)) {
        if (!ids.has(m[1])) broken.push(`${file.replace(SRC_ROOT, 'src')} → #${m[1]}`)
      }
    }
    expect(broken).toEqual([])
  })

  it('points every mega-menu protocol item at a real section', () => {
    const broken = megaMenuSections
      .flatMap((s) => s.items)
      .filter((i) => i.href.startsWith('/protocol#'))
      .map((i) => i.href.replace('/protocol#', ''))
      .filter((a) => !ids.has(a))
    expect(broken).toEqual([])
  })

  it('is reachable from navigation and described in page meta', () => {
    expect(NAV_ITEMS.some((n) => n.href === '/protocol')).toBe(true)
    expect(PAGE_META.protocol).toBeDefined()
    expect(PAGE_META.protocol.url).toBe('/protocol')
  })

  it('has a route registered for /protocol', () => {
    const app = readFileSync(join(SRC_ROOT, 'App.tsx'), 'utf8')
    expect(app).toContain('path="/protocol"')
  })

  it('is linked from the site header', () => {
    const header = readFileSync(join(SRC_ROOT, 'components', 'layout', 'Header.tsx'), 'utf8')
    expect(header).toContain('to="/protocol"')
  })
})
