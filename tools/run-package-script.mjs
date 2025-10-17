#!/usr/bin/env node

import { spawn } from 'node:child_process';
import process from 'node:process';

const [, , targetDir, scriptName, ...rawArgs] = process.argv;

if (!targetDir || !scriptName) {
  console.error('Usage: run-package-script.mjs <directory> <script> [args…]');
  process.exit(1);
}

const userAgent = process.env.npm_config_user_agent ?? '';
const execPath = process.env.npm_execpath;
const nodeExecPath = process.env.npm_node_execpath ?? process.execPath;

const managerName = (() => {
  if (userAgent.startsWith('pnpm/')) return 'pnpm';
  if (userAgent.startsWith('yarn/')) return 'yarn';
  return 'npm';
})();

const command = execPath ? nodeExecPath : managerName;
const commandArgs = execPath ? [execPath] : [];

// Preserve explicit argument separator handling.
const separatorIndex = rawArgs.indexOf('--');
const scriptArgs = separatorIndex === -1 ? rawArgs : rawArgs.slice(0, separatorIndex);
const forwardedArgs = separatorIndex === -1 ? [] : rawArgs.slice(separatorIndex);

commandArgs.push('run', scriptName, ...scriptArgs, ...forwardedArgs);

const child = spawn(command, commandArgs, {
  cwd: targetDir,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

