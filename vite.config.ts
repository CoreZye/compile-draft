import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import babel from '@rolldown/plugin-babel'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      babel({presets: [reactCompilerPreset()]}),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        manifest: {
          name: 'Compile Draft',
          short_name: 'CPD',
          description: 'Draft tool for the card game Compile',
          theme_color: '#000000c7',
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
      allowedHosts: true
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:' + parseInt(env.VITE_PORT || '8080', 10),
          changeOrigin: true,
        }
      },
      headers: {
        "Cross-Origin-Opener-Policy": "unsafe-none",
        "Cross-Origin-Embedder-Policy": "unsafe-none",
      },
    },
  }
})
