import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { ECOSYSTEM_IDS } from '../data'
import { NAV_ITEMS } from '../../../config/navigation'
import { PAGE_META } from '../../../config/pageMeta'
import { megaMenuSections } from '../../../config/megaMenu'

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

describe('atlas route wiring', () => {
  it('is reachable from navigation and described in page meta', () => {
    expect(NAV_ITEMS.some((n) => n.href === '/atlas')).toBe(true)
    expect(PAGE_META.atlas).toBeDefined()
    expect(PAGE_META.atlas.url).toBe('/atlas')
  })

  it('has a route registered for /atlas', () => {
    const app = readFileSync(join(SRC_ROOT, 'App.tsx'), 'utf8')
    expect(app).toContain('path="/atlas"')
  })

  it('is linked from the site header, desktop and mobile', () => {
    const header = readFileSync(join(SRC_ROOT, 'components', 'layout', 'Header.tsx'), 'utf8')
    const matches = header.match(/to="\/atlas"/g) ?? []
    expect(matches.length).toBeGreaterThanOrEqual(2)
  })

  it('has at least one mega-menu entry pointing at /atlas', () => {
    const hasAtlasItem = megaMenuSections.some((section) => section.items.some((item) => item.href === '/atlas'))
    expect(hasAtlasItem).toBe(true)
  })

  it('is cross-linked from the Protocol and Deep Dive hero sections', () => {
    const protocolPage = readFileSync(join(SRC_ROOT, 'pages', 'ProtocolPage.tsx'), 'utf8')
    const deepDivePage = readFileSync(join(SRC_ROOT, 'pages', 'DeepDivePage.tsx'), 'utf8')
    expect(protocolPage).toMatch(/to="\/atlas"/)
    expect(deepDivePage).toMatch(/to="\/atlas"/)
  })
})

describe('atlas node deep links', () => {
  /**
   * Every `/atlas?scene=eco&node=<id>` reference anywhere in the app —
   * whether hand-written or generated — must name a real ecosystem entity.
   * This is what the search index's per-entity docs rely on to actually
   * land on the right node instead of a blank ecosystem view.
   */
  it('has no reference to an unknown ecosystem node id', () => {
    const broken: string[] = []
    for (const file of sourceFiles(SRC_ROOT)) {
      const contents = readFileSync(file, 'utf8')
      for (const m of contents.matchAll(/\/atlas\?scene=eco&node=([a-z0-9-]+)/g)) {
        if (!ECOSYSTEM_IDS.includes(m[1])) broken.push(`${file.replace(SRC_ROOT, 'src')} → node=${m[1]}`)
      }
    }
    expect(broken).toEqual([])
  })

  it('generates a query-param deep link for every ecosystem entity in the search index build', () => {
    const generator = readFileSync(join(SRC_ROOT, '..', 'tools', 'build-search-index.mjs'), 'utf8')
    expect(generator).toContain('scene=eco&node=')
    expect(generator).toContain("ECOSYSTEM_IDS } from")
  })
})
