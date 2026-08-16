/**
 * Builds the runtime search payloads from the real content modules.
 *
 * The previous `public/data/search-index.json` was hand-maintained and had
 * drifted badly: it still described routes that no longer exist (Wallet,
 * Remittances, Start Here) and every entry pointed at `/`. Rather than
 * hand-maintaining a second copy of the content, this script renders the
 * actual FAQ and Deep Dive React trees to text and emits the payloads, so the
 * index cannot fall out of step with what the site renders.
 *
 * Run via `npm run build:search` (and automatically as part of `prebuild`).
 */
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server.js'
import * as esbuild from 'esbuild'

const here = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(here, '..')
const outputDir = join(projectRoot, 'public', 'data')

/** Mirrors the slugify used by `src/components/faq/FAQ.tsx` so anchors match. */
function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/** Render a React node to plain, collapsed text. */
function toText(node) {
  const markup = renderToStaticMarkup(
    createElement(StaticRouter, { location: '/' }, node),
  )
  return markup
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Bundle the content modules to CJS so this plain Node script can import TSX.
 * React and the router stay external so the copies here match the ones used
 * for rendering.
 */
async function loadContentModules() {
  // Emit inside the project so Node can resolve the externalised react /
  // react-router-dom from the app's own node_modules.
  const cacheRoot = join(projectRoot, 'node_modules', '.cache')
  await mkdir(cacheRoot, { recursive: true })
  const workDir = await mkdtemp(join(cacheRoot, 'tcw-search-'))
  const outfile = join(workDir, 'content.cjs')

  await esbuild.build({
    stdin: {
      contents: `
        export { faqItems, faqGroups } from ${JSON.stringify(join(projectRoot, 'src/components/faq/data.tsx'))}
        export { SECTIONS } from ${JSON.stringify(join(projectRoot, 'src/components/deepDive/sections.tsx'))}
      `,
      resolveDir: projectRoot,
      loader: 'ts',
    },
    bundle: true,
    format: 'cjs',
    platform: 'node',
    outfile,
    jsx: 'automatic',
    external: ['react', 'react-dom', 'react-router-dom'],
    logLevel: 'silent',
  })

  const loaded = await import(pathToFileURL(outfile).href)
  return { modules: loaded.default ?? loaded, cleanup: () => rm(workDir, { recursive: true, force: true }) }
}

function buildFaqDocs(faqItems, faqGroups) {
  const groupFor = new Map()
  faqGroups.forEach((group) => {
    group.items.forEach((item) => groupFor.set(item.question, group.title))
  })

  return faqItems.map((item) => {
    const id = item.id ?? slugify(item.question)
    return {
      id,
      question: item.question,
      answer: toText(item.answer),
      group: groupFor.get(item.question) ?? 'General',
      url: `/#faq-${id}`,
    }
  })
}

function buildSectionDocs(sections) {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    body: toText(section.content),
    url: `/deep-dive#${section.id}`,
  }))
}

/**
 * Route-level entries. These are genuinely static (there are only two real
 * routes) so they are declared here rather than scraped out of the page
 * components, which are layout-heavy and would produce noisy text.
 */
const PAGE_DOCS = [
  {
    id: 'home',
    title: 'Telcoin Wiki — community guide to the Telcoin ecosystem',
    summary:
      'Community-maintained introduction to Telcoin: the mobile-first financial network, Telcoin Network, Digital Cash, TELx, and the TEL token.',
    url: '/',
    tags: ['Getting Started', 'Overview'],
    headings: [
      { id: 'home-hero', title: 'Understand the Telcoin platform' },
      { id: 'home-story-cards', title: 'The Telcoin story' },
      { id: 'faq-section', title: 'Frequently asked questions' },
    ],
  },
  {
    id: 'deep-dive',
    title: 'Deep Dive — Telcoin architecture, economics and risks',
    summary:
      'Long-form reference covering Telcoin Network architecture, Narwhal and Bullshark consensus, Digital Cash, the Telcoin Digital Asset Bank, remittance corridors, TEL tokenomics, governance, and open risks.',
    url: '/deep-dive',
    tags: ['Deep Dive', 'Reference'],
    headings: [],
  },
]

async function main() {
  const { modules, cleanup } = await loadContentModules()

  try {
    const { faqItems, faqGroups, SECTIONS } = modules

    if (!Array.isArray(faqItems) || !Array.isArray(SECTIONS)) {
      throw new Error('content modules did not export the expected arrays')
    }

    const faqDocs = buildFaqDocs(faqItems, faqGroups)
    const sectionDocs = buildSectionDocs(SECTIONS)

    const pageDocs = PAGE_DOCS.map((page) =>
      page.id === 'deep-dive'
        ? { ...page, headings: sectionDocs.map((s) => ({ id: s.id, title: s.title })) }
        : page,
    )

    const searchIndex = [
      ...pageDocs.map((page) => ({
        id: page.id,
        kind: 'page',
        title: page.title,
        summary: page.summary,
        url: page.url,
        tags: page.tags,
        headings: page.headings,
        body: '',
      })),
      ...sectionDocs.map((section) => ({
        id: section.id,
        kind: 'section',
        title: section.title,
        summary: section.body.slice(0, 240),
        url: section.url,
        tags: ['Deep Dive'],
        headings: [],
        body: section.body,
      })),
    ]

    await mkdir(outputDir, { recursive: true })
    await writeFile(join(outputDir, 'search-index.json'), `${JSON.stringify(searchIndex, null, 2)}\n`)
    await writeFile(join(outputDir, 'faq.json'), `${JSON.stringify(faqDocs, null, 2)}\n`)

    const bytes = (o) => (JSON.stringify(o).length / 1024).toFixed(1)
    console.log(
      `[search-index] ${searchIndex.length} docs (${pageDocs.length} pages, ${sectionDocs.length} sections, ${bytes(searchIndex)} kB) + ${faqDocs.length} FAQ entries (${bytes(faqDocs)} kB)`,
    )
  } finally {
    await cleanup()
  }
}

main().catch((error) => {
  console.error('[search-index] build failed:', error)
  process.exit(1)
})
