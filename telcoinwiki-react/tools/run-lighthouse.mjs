import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const base = process.env.PERF_URL ?? 'http://localhost:4173'
const outDir = process.env.PERF_OUT ?? 'tools/perf'
const routes = (process.env.PERF_ROUTES ?? '/,/,/network,/bank').split(',').filter(Boolean)

mkdirSync(outDir, { recursive: true })

const summary = []

const runOne = (pathname) =>
  new Promise((resolve, reject) => {
    const safe = pathname.replace(/\W+/g, '_').replace(/^_+|_+$/g, '') || 'home'
    const url = new URL(pathname, base).toString()
    const outputBase = join(outDir, `report-${safe}`)
    const args = [
      url,
      '--output=json',
      '--output=html',
      `--output-path=${outputBase}`,
      '--only-categories=performance,accessibility',
      '--throttling.cpuSlowdownMultiplier=4',
      '--screenEmulation.mobile=true',
      '--quiet',
    ]

    console.log(`\n[perf] Running Lighthouse → ${url}`)
    const child = spawn('npx', ['-y', 'lighthouse', ...args], { stdio: 'inherit' })
    child.on('exit', (code) => {
      if (code !== 0) return reject(new Error(`Lighthouse exit ${code}`))
      try {
        const json = JSON.parse(readFileSync(`${outputBase}.report.json`, 'utf8'))
        const lcp = json.audits['largest-contentful-paint']?.numericDisplayValue
        const cls = json.audits['cumulative-layout-shift']?.displayValue
        const inp = json.audits['interaction-to-next-paint']?.numericDisplayValue
        const perfScore = json.categories?.performance?.score ?? null
        const a11yScore = json.categories?.accessibility?.score ?? null
        console.log(`[perf] ${pathname} → LCP: ${lcp}, CLS: ${cls}, INP: ${inp}`)
        console.log(`[perf] Report: ${outputBase}.report.html`)
        summary.push({ route: pathname, lcp, cls, inp, performance: perfScore, accessibility: a11yScore })
      } catch (e) {
        console.warn('[perf] Could not parse JSON output for', pathname, e)
      }
      resolve()
    })
  })

for (const route of routes) {
  await runOne(route)
}

console.log('\n[perf] Completed all routes')
try {
  writeFileSync(join(outDir, 'summary.json'), JSON.stringify({ base, routes, summary }, null, 2))
  console.log(`[perf] Wrote summary → ${join(outDir, 'summary.json')}`)
} catch {}
