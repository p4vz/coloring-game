import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

const page = (p) => fileURLToPath(new URL(p, import.meta.url))

// Relative base so the built site works from any path, including when
// Capacitor serves it from the app's local filesystem in Phase 2.
export default defineConfig({
  base: './',
  build: {
    target: 'es2018', // broad support for older tablet browsers
    assetsInlineLimit: 8192,
    rollupOptions: {
      input: {
        main: page('index.html'),
        coloring: page('coloring/index.html'),
        dressup: page('dressup/index.html'),
      },
    },
  },
})
