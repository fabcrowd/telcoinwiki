import { readdir, stat, readFile, writeFile } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import sharp from 'sharp'

const DEEP_DIVE_DIR = 'public/media/deep-dive'
const QUALITY = {
  jpg: 85,
  png: 90,
  webp: 85,
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase().slice(1)
  
  if (!['jpg', 'jpeg', 'png'].includes(ext)) {
    console.log(`Skipping ${filePath} (not a supported format)`)
    return false
  }

  try {
    const stats = await stat(filePath)
    const originalSize = stats.size
    const buffer = await readFile(filePath)
    
    let optimized
    if (ext === 'jpg' || ext === 'jpeg') {
      optimized = await sharp(buffer)
        .jpeg({ quality: QUALITY.jpg, mozjpeg: true })
        .toBuffer()
    } else if (ext === 'png') {
      optimized = await sharp(buffer)
        .png({ quality: QUALITY.png, compressionLevel: 9 })
        .toBuffer()
    }

    if (optimized.length < originalSize) {
      await writeFile(filePath, optimized)
      const saved = ((originalSize - optimized.length) / originalSize * 100).toFixed(1)
      console.log(`✓ ${filePath}: ${(originalSize / 1024).toFixed(1)}KB → ${(optimized.length / 1024).toFixed(1)}KB (${saved}% saved)`)
      return true
    } else {
      console.log(`- ${filePath}: already optimized`)
      return false
    }
  } catch (error) {
    console.error(`✗ Error optimizing ${filePath}:`, error.message)
    return false
  }
}

async function processDirectory(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath)
    } else if (entry.isFile()) {
      await optimizeImage(fullPath)
    }
  }
}

async function main() {
  console.log('Optimizing images in deep-dive directory...\n')
  await processDirectory(DEEP_DIVE_DIR)
  console.log('\nOptimization complete!')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

