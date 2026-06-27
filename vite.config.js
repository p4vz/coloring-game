import { defineConfig } from 'vite'

// Relative base so the built site works from any path, including when
// Capacitor serves it from the app's local filesystem in Phase 2.
export default defineConfig({
  base: './',
  build: {
    target: 'es2018', // broad support for older tablet browsers
    assetsInlineLimit: 8192,
  },
})
