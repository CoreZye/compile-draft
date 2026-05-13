import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import babel from '@rolldown/plugin-babel'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // This is required to see the manifest in Dev Mode
      },
      manifest: {
        name: 'Compile Draft',
        short_name: 'CPD',
        description: 'Draft tool for the card game Compile',
        theme_color: '#000000c7', // Matches your Rsuite dark theme
        icons: [
          {
            src: 'compile-icon-small.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'compile-icon.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      }
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: true // This tells Vite to trust the localtunnel URL
  },
  server: {
    //host: '0.0.0.0', // This is the magic line
    port: 5173,
    //strictPort: true,
     //allowedHosts: [
      //'wicked-papers-design.loca.lt'
    //],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    },
    headers: {
      "Cross-Origin-Opener-Policy": "unsafe-none",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
})
