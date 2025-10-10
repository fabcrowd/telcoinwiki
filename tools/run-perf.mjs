import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'

const PORT = process.env.PREVIEW_PORT ?? 4173
const BASE = `http://localhost:${PORT}`

const run = (cmd, args, opts = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...opts })
    child.on('exit', (code) => (code === 0 ? resolve(undefined) : reject(new Error(`${cmd} ${args.join(' ')} -> ${code}`))))
  })

const waitForServer = async (url, timeoutMs = 30000) => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (res.ok) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 300))
  }
  throw new Error(`Server did not become ready at ${url}`)
}

async function main() {
  if (!existsSync('telcoinwiki-react/node_modules/.bin/vite')) {
    console.log('[perf] Installing workspace dependencies…')
    await run('npm', ['--prefix', 'telcoinwiki-react', 'ci', '--no-audit', '--no-fund'])
  }

  const runBuild = async () => {
    try {
      await run('npm', ['--prefix', 'telcoinwiki-react', 'run', 'build'])
    } catch (err) {
      const message = err?.message ?? ''
      const missingVite = typeof message === 'string' && message.includes('-> 127')
      if (!missingVite) {
        throw err
      }

      console.log('[perf] Build failed (likely missing deps). Reinstalling workspace packages…')
      await run('npm', ['--prefix', 'telcoinwiki-react', 'ci', '--no-audit', '--no-fund'])
      await run('npm', ['--prefix', 'telcoinwiki-react', 'run', 'build'])
    }
  }

  console.log('[perf] Building site…')
  await runBuild()

  console.log('[perf] Starting preview server…')
  const preview = spawn('npm', ['--prefix', 'telcoinwiki-react', 'run', 'preview'], { stdio: 'inherit' })
  try {
    await waitForServer(BASE)
    console.log('[perf] Preview is up →', BASE)

    console.log('[perf] Running Lighthouse across routes…')
    await run('node', ['telcoinwiki-react/tools/run-lighthouse.mjs'])
  } finally {
    console.log('[perf] Stopping preview server…')
    // Best-effort shutdown
    try { preview.kill('SIGTERM') } catch {}
  }
}

main().catch((err) => {
  console.error('[perf] Failed:', err?.message || err)
  process.exit(1)
})
