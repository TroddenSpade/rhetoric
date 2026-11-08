import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Local dev and preview are served from "/". The GitHub Pages workflow in
// .github/workflows/deploy.yml builds with VITE_BASE=/rhetoric/ because the
// project is published as a Pages project site. Set VITE_BASE to override
// (for example "/" when using a custom domain).
const base = process.env.VITE_BASE || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      // The user accepts the update; PwaUpdatePrompt then activates the waiting
      // worker and reloads, so the page is served from the new version.
      registerType: 'prompt',
      injectRegister: null,
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png', 'icons/icon-maskable-512.png'],
      manifest: {
        name: 'Rhetoric — Write with range, precision and structure',
        short_name: 'Rhetoric',
        description:
          'A local-first writing studio: find the precise word, check your spelling, vary your sentences and shape your argument.',
        lang: 'en',
        theme_color: '#8c2a14',
        background_color: '#f6f1e7',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: base,
        start_url: base,
        categories: ['education', 'productivity', 'books'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Open the studio',
            short_name: 'Studio',
            description: 'Write and review a draft',
            url: `${base}write`,
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'Practise',
            short_name: 'Practice',
            description: 'A short drill on words, spelling, clarity and structure',
            url: `${base}practice`,
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'The wordbook',
            short_name: 'Wordbook',
            description: 'Find a more precise word',
            url: `${base}wordbook`,
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Extra synonyms and definitions when the device is online; the
            // curated wordbook is always available offline.
            urlPattern: /^https:\/\/api\.datamuse\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'datamuse',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    // The spellchecker is deliberately a large lazy chunk: it carries the full
    // Hunspell dictionary and is cached by the service worker after first use.
    chunkSizeWarningLimit: 700,
  },
  server: {
    host: true,
    port: 5173,
  },
})
