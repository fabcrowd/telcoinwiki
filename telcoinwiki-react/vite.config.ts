import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import reactBabel from '@vitejs/plugin-react'

const isVitest = !!process.env.VITEST

// https://vite.dev/config/
export default defineConfig({
  plugins: [isVitest ? reactBabel() : react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@scroll': fileURLToPath(new URL('./src/lib/scroll', import.meta.url)),
    },
  },
})
