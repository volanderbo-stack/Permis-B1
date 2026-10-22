import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// base: './' — щоб збірка працювала з будь-якого підшляху (GitHub Pages)
export default defineConfig({
  base: './',
  build: {
    rolldownOptions: {
      output: {
        // питання, уроки й бібліотеки — окремими файлами: при оновленні коду
        // телефону не треба заново завантажувати всю базу
        codeSplitting: {
          groups: [
            { name: 'questions', test: /src[\\/]data[\\/]questions/ },
            { name: 'content', test: /src[\\/]data[\\/](courses|driving|glossary|signs)/ },
            { name: 'vendor', test: /node_modules/ },
          ],
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Permis B1 — Code de la route',
        short_name: 'Permis B1',
        description: 'Préparation à l’examen du Code de la route (ETG)',
        lang: 'fr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f4f6fb',
        theme_color: '#1d4ed8',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // усе потрібне для офлайну (включно зі знаками в signs/) — у прекеш
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
        runtimeCaching: [
          {
            // запасні знаки напряму з Wikimedia, якщо локальної копії немає
            urlPattern: ({ url }) => url.hostname.endsWith('wikimedia.org'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'wikimedia-signs',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
