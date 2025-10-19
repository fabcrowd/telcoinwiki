#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import opentype from 'opentype.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const FONT_PATH = path.resolve(__dirname, 'fonts/Inter-Bold.otf')
const OUT_PATH = path.resolve(__dirname, '../public/logo.svg')

// Match existing canvas
const WIDTH = 260
const HEIGHT = 72
const VIEWBOX = `0 0 ${WIDTH} ${HEIGHT}`

// Typography
const FONT_SIZE = 38 // px
const BASELINE_Y = 46 // px
const LETTER_SPACING_EM = 0.015 // CSS em
const LETTER_SPACING_PX = LETTER_SPACING_EM * FONT_SIZE

const WORD_LEFTS = {
  Telcoin: 0, // x for "Telcoin"
  Wiki: 146, // x for "Wiki"
}

function buildWordPath(font, text, xStart, yBaseline, fontSize, letterSpacingPx) {
  const glyphs = font.stringToGlyphs(text)
  const scale = fontSize / font.unitsPerEm
  let x = xStart
  const path = new opentype.Path()

  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i]
    const prev = i > 0 ? glyphs[i - 1] : null
    // Kerning in font units
    let kern = 0
    if (prev) {
      kern = font.getKerningValue(prev, g)
    }
    const gx = x + kern * scale
    const gy = yBaseline
    const gp = g.getPath(gx, gy, fontSize)
    // Append commands
    gp.commands.forEach((cmd) => path.commands.push(cmd))
    // Advance x for next glyph
    const adv = (g.advanceWidth ?? font.unitsPerEm) * scale
    x = gx + adv + letterSpacingPx
  }

  return path
}

function pathToD(path) {
  // Higher precision to avoid visual stepping at large scales
  if (typeof path.toPathData === 'function') {
    return path.toPathData(3)
  }
  // Fallback manual serialization
  return path.commands
    .map((c) => {
      switch (c.type) {
        case 'M':
          return `M${c.x.toFixed(3)} ${c.y.toFixed(3)}`
        case 'L':
          return `L${c.x.toFixed(3)} ${c.y.toFixed(3)}`
        case 'C':
          return `C${c.x1.toFixed(3)} ${c.y1.toFixed(3)} ${c.x2.toFixed(3)} ${c.y2.toFixed(3)} ${c.x.toFixed(3)} ${c.y.toFixed(3)}`
        case 'Q':
          return `Q${c.x1.toFixed(3)} ${c.y1.toFixed(3)} ${c.x.toFixed(3)} ${c.y.toFixed(3)}`
        case 'Z':
          return 'Z'
        default:
          return ''
      }
    })
    .join(' ')
}

async function main() {
  const font = await opentype.load(FONT_PATH)

  const telcoin = buildWordPath(font, 'Telcoin', WORD_LEFTS.Telcoin, BASELINE_Y, FONT_SIZE, LETTER_SPACING_PX)
  const wiki = buildWordPath(font, 'Wiki', WORD_LEFTS.Wiki, BASELINE_Y, FONT_SIZE, LETTER_SPACING_PX)

  const telcoinD = pathToD(telcoin)
  const wikiD = pathToD(wiki)

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="${VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="logoTitle logoDesc">
  <title id="logoTitle">Telcoin Wiki logo</title>
  <desc id="logoDesc">Wordmark showing the Telcoin name in white with Wiki in a bright Telx blue and a swoosh underline.</desc>
  <defs>
    <linearGradient id="wikiGradient" x1="188" y1="10" x2="188" y2="58" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#2DC9FF"/>
      <stop offset="1" stop-color="#0F6BFF"/>
    </linearGradient>
    <linearGradient id="underlineGradient" x1="150" y1="60" x2="236" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#2DC9FF"/>
      <stop offset="1" stop-color="#0F6BFF"/>
    </linearGradient>
  </defs>
  <path d="${telcoinD}" fill="#F4F8FF"/>
  <path d="${wikiD}" fill="url(#wikiGradient)"/>
  <path d="M150 56C166 64 186 66 204 64C214 63 224 60 236 56" stroke="url(#underlineGradient)" stroke-width="6" stroke-linecap="round"/>
</svg>`

  fs.writeFileSync(OUT_PATH, svg)
  console.log(`Wrote outlined logo to ${path.relative(process.cwd(), OUT_PATH)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

