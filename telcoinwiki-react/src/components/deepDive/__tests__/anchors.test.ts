import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { SECTIONS } from '../sections'
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

/**
 * Regression guard for a real bug: the home page linked to `#deep-problem`,
 * `#deep-bank`, `#deep-tokenomics` and `#deep-faq`, none of which existed as
 * Deep Dive sections. Ten cards scrolled nowhere. Anchors are invisible to the
 * type system, so this walks the source instead.
 */
describe('deep dive anchors', () => {
  const sectionIds = new Set(SECTIONS.map((section) => section.id))

  it('defines unique section ids', () => {
    expect(sectionIds.size).toBe(SECTIONS.length)
  })

  it('has no reference to an undefined deep-dive anchor', () => {
    const broken: string[] = []

    for (const file of sourceFiles(SRC_ROOT)) {
      const contents = readFileSync(file, 'utf8')
      for (const match of contents.matchAll(/\/deep-dive#([a-z0-9-]+)/g)) {
        const anchor = match[1]
        // The Deep Dive page's own hero heading is not a collapsible section.
        if (anchor === 'deep-dive-hero') continue
        if (!sectionIds.has(anchor)) {
          broken.push(`${file.replace(SRC_ROOT, 'src')} → #${anchor}`)
        }
      }
    }

    expect(broken).toEqual([])
  })

  it('points every mega-menu deep-dive item at a real section', () => {
    const broken = megaMenuSections
      .flatMap((section) => section.items)
      .filter((item) => item.href.startsWith('/deep-dive#'))
      .map((item) => item.href.replace('/deep-dive#', ''))
      .filter((anchor) => !sectionIds.has(anchor))

    expect(broken).toEqual([])
  })

  it('lists every section in the Deep Dive page table of contents', () => {
    const page = readFileSync(join(SRC_ROOT, 'pages', 'DeepDivePage.tsx'), 'utf8')
    const missing = [...sectionIds].filter((id) => !page.includes(`href="#${id}"`))

    expect(missing).toEqual([])
  })
})
