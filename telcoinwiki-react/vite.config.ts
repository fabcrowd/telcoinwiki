import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

const isTest = process.env.VITEST === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@scroll': fileURLToPath(new URL('./src/lib/scroll', import.meta.url)),
      ...(isTest
        ? {
            '@studio-freight/lenis': fileURLToPath(new URL('./src/test-utils/mocks/lenis.ts', import.meta.url)),
            'gsap/ScrollTrigger': fileURLToPath(new URL('./src/test-utils/mocks/gsapScrollTrigger.ts', import.meta.url)),
            gsap: fileURLToPath(new URL('./src/test-utils/mocks/gsap.ts', import.meta.url)),
          }
        : {}),
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
