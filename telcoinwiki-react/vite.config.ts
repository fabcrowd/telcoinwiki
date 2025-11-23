import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import reactBabel from '@vitejs/plugin-react'

const isVitest = !!process.env.VITEST

// https://vite.dev/config/
export default defineConfig({
  plugins: [isVitest ? reactBabel() : react()],
  server: {
    host: true, // Allow access from network (for mobile testing)
    port: 5173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@scroll': fileURLToPath(new URL('./src/lib/scroll', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Chunk large dependencies for better code splitting
          if (id.includes('node_modules/react-dom')) {
            return 'vendor-react-dom'
          }
          if (id.includes('node_modules/react/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/@remix-run')) {
            return 'vendor-router'
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-query'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer-motion'
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap'
          }
          if (id.includes('node_modules/lenis')) {
            return 'vendor-lenis'
          }
          // Chunk large components
          if (id.includes('DeepDiveFaqSections')) {
            return 'component-deep-dive'
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
