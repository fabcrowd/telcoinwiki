#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

type StatusMap = Record<string, number>;

type BumpResult = {
  key: string;
  previous: number;
  next: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadStatus(filePath: string): StatusMap {
  const raw = readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw) as unknown;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('status.json must contain a top-level object.');
  }

  const map: StatusMap = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`status.json field "${key}" must be a finite number.`);
    }
    map[key] = value;
  }

  return map;
}

function saveStatus(filePath: string, data: StatusMap): void {
  const sorted = Object.keys(data)
    .sort((a, b) => a.localeCompare(b))
    .reduce<StatusMap>((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

  const payload = JSON.stringify(sorted, null, 2);
  writeFileSync(filePath, `${payload}\n`, 'utf8');
}

function parseArgs(args: string[]): { key: string; amount: number } {
  const [key, amountArg] = args;
  if (!key) {
    throw new Error('Usage: bump-status <field> [amount]');
  }

  const amount = amountArg ? Number(amountArg) : 1;
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Amount must be a positive number.');
  }
  if (!Number.isInteger(amount)) {
    throw new Error('Amount must be an integer.');
  }

  return { key, amount };
}

function bumpStatus(data: StatusMap, key: string, amount: number): BumpResult {
  if (!(key in data)) {
    throw new Error(`Field "${key}" is not defined in status.json.`);
  }

  const previous = data[key];
  const next = previous + amount;
  if (!Number.isSafeInteger(next)) {
    throw new Error(`Resulting value for "${key}" exceeds safe integer limits.`);
  }

  data[key] = next;
  return { key, previous, next };
}

function main(): void {
  try {
    const { key, amount } = parseArgs(process.argv.slice(2));
    const statusPath = resolve(__dirname, '..', 'status.json');
    const data = loadStatus(statusPath);
    const result = bumpStatus(data, key, amount);
    saveStatus(statusPath, data);
    console.log(`Updated ${result.key}: ${result.previous} → ${result.next}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}

main();
export {};
