import { mkdirSync, writeFileSync } from 'node:fs'
import { createWriteStream } from 'node:fs'
import { basename, join } from 'node:path'
import { pipeline } from 'node:stream/promises'

const ORIGINS = [
  'https://telco.in',
  'https://www.telco.in',
  'https://telcoin.org',
  'https://www.telcoin.org',
  'https://telcoin.network',
  'https://www.telcoin.network',
]

const OUT_DIR = 'telcoinwiki-react/public/media'
const LOGO_DIR = join(OUT_DIR, 'marquee/logos')
const HERO_DIR = join(OUT_DIR, 'hero')
const MANIFEST = 'telcoinwiki-react/tools/assets/assets-manifest.json'

const MAX_BYTES_VIDEO = 15 * 1024 * 1024 // 15MB cap per video
const MAX_BYTES_IMAGE = 4 * 1024 * 1024 // 4MB cap per image (posters)
const TIMEOUT_MS = 15000

const sleep = (ms)=>new Promise(r=>setTimeout(r,ms))

async function fetchText(url, init = {}) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { ...init, signal: ctl.signal })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  } finally { clearTimeout(t) }
}

async function respectRobots(origin) {
  const txt = await fetchText(new URL('/robots.txt', origin).toString())
  if (!txt) return true // be permissive but cautious
  // Disallow simple patterns; if root is disallowed, skip origin
  if (/Disallow:\s*\/$/im.test(txt)) return false
  return true
}

function extractAssetLinks(html, origin) {
  const re = /(href|src)=["']([^"']+\.(?:svg|mp4|webm|webp|jpg|jpeg|png))(?:\?[^"']*)?["']/gi
  const out = new Set()
  let m
  while ((m = re.exec(html))) {
    const raw = m[2]
    try {
      const url = new URL(raw, origin)
      // limit to our origins only
      if (ORIGINS.some((o) => url.origin === new URL(o).origin)) {
        out.add(url.toString())
      }
    } catch {}
  }
  return [...out]
}

async function headOk(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    if (!res.ok) return null
    const len = Number(res.headers.get('content-length') || '0')
    const type = (res.headers.get('content-type') || '').split(';')[0].trim()
    const isVideo = /^(video\/mp4|video\/webm)$/.test(type)
    const isImage = /^(image\/(?:svg\+xml|webp|jpeg|png))$/.test(type)
    if (!isVideo && !isImage) return null
    if (len && isVideo && len > MAX_BYTES_VIDEO) return null
    if (len && isImage && len > MAX_BYTES_IMAGE) return null
    return { len, type }
  } catch { return null }
}

async function download(url, dest) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS)
  const res = await fetch(url, { signal: ctl.signal })
  clearTimeout(t)
  if (!res.ok || !res.body) throw new Error('download failed')
  await pipeline(res.body, createWriteStream(dest))
}

async function crawlOrigin(origin) {
  const results = []
  if (!(await respectRobots(origin))) {
    return results
  }
  // Try homepage and a few common paths
  const paths = ['/', '/sitemap.xml', '/documentation', '/docs', '/assets', '/media']
  for (const p of paths) {
    const url = new URL(p, origin).toString()
    const html = await fetchText(url)
    if (!html) continue
    results.push(...extractAssetLinks(html, origin))
    await sleep(200)
  }
  return Array.from(new Set(results))
}

function destFor(url) {
  const name = basename(new URL(url).pathname)
  if (/\.svg$/i.test(name)) return join(LOGO_DIR, name)
  if (/\.(mp4|webm|webp|jpg|jpeg|png)$/i.test(name)) return join(HERO_DIR, name)
  return null
}

async function main() {
  mkdirSync(LOGO_DIR, { recursive: true })
  mkdirSync(HERO_DIR, { recursive: true })

  const manifest = { fetchedAt: new Date().toISOString(), entries: [] }

  for (const origin of ORIGINS) {
    const links = await crawlOrigin(origin)
    for (const url of links) {
      const head = await headOk(url)
      if (!head) continue
      const dest = destFor(url)
      if (!dest) continue
      try {
        await download(url, dest)
        manifest.entries.push({ url, dest, type: head.type, bytes: head.len ?? null })
        console.log('saved', url, '→', dest)
      } catch (e) {
        console.warn('skip', url, (e && e.message) || e)
      }
      await sleep(150)
    }
  }

  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2))
  console.log('Wrote manifest', MANIFEST)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
