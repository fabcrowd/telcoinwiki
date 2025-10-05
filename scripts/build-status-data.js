#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const statusPath = path.join(rootDir, 'status.json');
const outputPath = path.join(rootDir, 'dist', 'status-data.js');

function readStatus() {
  try {
    const raw = fs.readFileSync(statusPath, 'utf8');
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('status.json must contain an object.');
    }
    return data;
  } catch (error) {
    console.error('[build-status-data] Failed to read status.json:', error.message);
    process.exit(1);
  }
}

function writeBundle(data) {
  const payload = `window.__STATUS__ = ${JSON.stringify(data)};\n`;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, payload, 'utf8');
}

function main() {
  const data = readStatus();
  writeBundle(data);
}

main();
