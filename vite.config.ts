import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true, // Enable polling for file changes
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],          
          'ui-vendor': ['framer-motion', 'react-icons'],          
          'transformers': ['@huggingface/transformers'],          
          'utils': ['jszip', 'file-saver'],
        },
      },
    },
  },
  plugins: [
    tailwindcss(),
    react(),    
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        "name": "ImageMonster",
        "short_name": "ImageMonster",
        "description": "Free, private, browser-based AI background removal tool. Remove backgrounds from images instantly with no upload to servers. Process multiple images, adjust settings, and download transparent PNGs—all powered by advanced AI models running entirely in your browser for maximum privacy and speed.",
        "start_url": "/",
        "icons": [
          {
            "src": "/icons/maskable_icon_x128.png",
            "sizes": "128x128",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/icons/maskable_icon_x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/icons/maskable_icon_x384.png",
            "sizes": "384x384",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/icons/maskable_icon_x48.png",
            "sizes": "48x48",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/icons/maskable_icon_x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/icons/maskable_icon_x72.png",
            "sizes": "72x72",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/icons/maskable_icon_x96.png",
            "sizes": "96x96",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/icons/maskable_icon_x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
        ],
        "screenshots": [
          {
            "src": "/screenshot-wide.png",
            "sizes": "1919x909",
            "type": "image/png",
            "form_factor": "wide",
          },
          {
            "src": "/screenshot-portrait.png",
            "sizes": "375x908",
            "type": "image/png",
            "form_factor": "narrow",
          }
        ],
        "theme_color": "#001E29",
        "background_color": "#001E29",
        "display": "standalone"
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,wasm}'],
        maximumFileSizeToCacheInBytes: 30000000,
      },
    }),
  ],
})
