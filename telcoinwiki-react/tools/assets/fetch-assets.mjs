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

const OUT_DIR = 'public/media'
const LOGO_DIR = join(OUT_DIR, 'marquee/logos')
const HERO_DIR = join(OUT_DIR, 'hero')
const MANIFEST = 'tools/assets/assets-manifest.json'

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

function extractPageLinks(html, origin) {
  // Extract internal links that might lead to pages with images
  const re = /href=["']([^"']+)["']/gi
  const out = new Set()
  let m
  while ((m = re.exec(html))) {
    const raw = m[1]
    try {
      const url = new URL(raw, origin)
      // Only follow links within the same origin
      if (ORIGINS.some((o) => url.origin === new URL(o).origin)) {
        // Skip common non-content paths
        if (!/\.(pdf|zip|exe|dmg|rss|xml|json|css|js)$/i.test(url.pathname) &&
            !url.pathname.includes('#') &&
            !url.pathname.includes('mailto:') &&
            !url.pathname.includes('tel:')) {
          out.add(url.toString())
        }
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

async function crawlOrigin(origin, maxDepth = 2) {
  const results = new Set()
  const visited = new Set()
  const toVisit = []
  
  if (!(await respectRobots(origin))) {
    return []
  }
  
  // Start with homepage and common paths
  const initialPaths = [
    '/',
    '/digital-cash',
    '/wallet',
    '/network',
    '/telx',
    '/remittances',
    '/about',
    '/newsroom',
    '/legal',
  ]
  
  for (const p of initialPaths) {
    toVisit.push({ url: new URL(p, origin).toString(), depth: 0 })
  }
  
  while (toVisit.length > 0) {
    const { url, depth } = toVisit.shift()
    
    if (visited.has(url) || depth > maxDepth) continue
    visited.add(url)
    
    const html = await fetchText(url)
    if (!html) continue
    
    // Extract images from this page
    const images = extractAssetLinks(html, origin)
    images.forEach(img => results.add(img))
    
    // If we haven't reached max depth, extract links to follow
    if (depth < maxDepth) {
      const pageLinks = extractPageLinks(html, origin)
      for (const link of pageLinks) {
        if (!visited.has(link) && link.startsWith(origin)) {
          toVisit.push({ url: link, depth: depth + 1 })
        }
      }
    }
    
    await sleep(200) // Be respectful with rate limiting
  }
  
  return Array.from(results)
}

function destFor(url) {
  const name = basename(new URL(url).pathname)
  const urlPath = new URL(url).pathname.toLowerCase()
  
  // Deep dive images go to deep-dive subdirectories
  if (/digital-cash|currency|e[A-Z]{3}/i.test(urlPath)) {
    if (/\.svg$/i.test(name)) return join(OUT_DIR, 'deep-dive/digital-cash', name)
    if (/\.(jpg|jpeg|png)$/i.test(name)) return join(OUT_DIR, 'deep-dive/digital-cash', name)
  }
  
  if (/telx|uniswap|balancer|polygon|base|eth|wbtc|weth|usdc|tel\.(png|svg)/i.test(urlPath)) {
    if (/\.svg$/i.test(name)) return join(OUT_DIR, 'deep-dive/telx', name)
    if (/\.(jpg|jpeg|png)$/i.test(name)) return join(OUT_DIR, 'deep-dive/telx', name)
  }
  
  // Logos go to marquee/logos
  if (/\.svg$/i.test(name)) return join(LOGO_DIR, name)
  // Other images go to hero or appropriate location
  if (/\.(mp4|webm|webp|jpg|jpeg|png)$/i.test(name)) {
    if (/hero|background|foreground/i.test(urlPath)) {
      return join(HERO_DIR, name)
    }
    // Check if it's a deep dive related image
    if (/network|consensus|execution|governance|bank|vault|settlement/i.test(urlPath)) {
      return join(OUT_DIR, 'deep-dive/digital-cash', name)
    }
    return join(HERO_DIR, name)
  }
  return null
}

async function main() {
  mkdirSync(LOGO_DIR, { recursive: true })
  mkdirSync(HERO_DIR, { recursive: true })
  mkdirSync(join(OUT_DIR, 'deep-dive/digital-cash'), { recursive: true })
  mkdirSync(join(OUT_DIR, 'deep-dive/telx'), { recursive: true })

  const manifest = { fetchedAt: new Date().toISOString(), entries: [] }

  for (const origin of ORIGINS) {
    console.log(`\nCrawling ${origin}...`)
    const links = await crawlOrigin(origin, 2) // Max depth of 2
    console.log(`Found ${links.length} image links from ${origin}`)
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
