#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SOURCE_DIRS = ['assets'];
const OUTPUT_DIR = path.join('assets', 'optimized');
const FORMATS = ['webp', 'avif'];
const TARGET_WIDTHS = [480, 768, 1200];

async function main() {
  try {
    await ensureDir(OUTPUT_DIR);
    const files = await collectImages(SOURCE_DIRS);
    if (!files.length) {
      log('No images to optimise.');
      return;
    }

    let processed = 0;
    for (const file of files) {
      const stats = await optimiseImage(file);
      processed += stats.outputs;
    }

    log(`Optimised ${files.length} image(s) into ${processed} responsive asset(s).`);
  } catch (error) {
    console.error('[optimize-images] Failed:', error);
    process.exitCode = 1;
  }
}

function log(message) {
  process.stdout.write(`${message}\n`);
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function collectImages(directories) {
  const results = [];
  for (const dir of directories) {
    const absolute = path.resolve(dir);
    const entries = await walkDirectory(absolute);
    results.push(...entries);
  }
  return results;
}

async function walkDirectory(current) {
  const entries = await fs.promises.readdir(current, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkDirectory(fullPath)));
    } else if (isRaster(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function isRaster(filename) {
  return /\.(png|jpe?g)$/i.test(filename);
}

async function optimiseImage(filePath) {
  const relativeInput = path.relative(process.cwd(), filePath);
  const buffer = await fs.promises.readFile(filePath);
  const image = sharp(buffer, { failOn: 'none' });
  const metadata = await image.metadata();
  if (!metadata.width) {
    log(`Skipping ${relativeInput}: unable to determine width.`);
    return { outputs: 0 };
  }
  const baseName = path.basename(filePath).replace(/\.[^.]+$/, '');
  const applicableWidths = TARGET_WIDTHS.filter((width) => width <= metadata.width);
  const widths = applicableWidths.length ? applicableWidths : [metadata.width];

  let outputs = 0;
  for (const width of widths) {
    for (const format of FORMATS) {
      const outputName = `${baseName}-${width}.${format}`;
      const outputPath = path.join(OUTPUT_DIR, outputName);
      const alreadyUpToDate = await isUpToDate(filePath, outputPath);
      if (alreadyUpToDate) {
        continue;
      }
      await sharp(buffer)
        .resize({ width, withoutEnlargement: true })
        [format]({ quality: format === 'webp' ? 80 : 50 })
        .toFile(outputPath);
      outputs += 1;
    }
  }
  log(`Optimised ${relativeInput} → ${outputs} variant(s).`);
  return { outputs };
}

async function isUpToDate(sourcePath, outputPath) {
  try {
    const [sourceStat, outputStat] = await Promise.all([
      fs.promises.stat(sourcePath),
      fs.promises.stat(outputPath)
    ]);
    return outputStat.mtimeMs >= sourceStat.mtimeMs;
  } catch (error) {
    return false;
  }
}

main();
