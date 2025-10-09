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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap'
          }
          if (id.includes('node_modules/lenis')) {
            return 'vendor-lenis'
          }
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/@remix-run')) {
            return 'vendor-router'
          }
          return undefined
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    passWithNoTests: true,
  },
})
