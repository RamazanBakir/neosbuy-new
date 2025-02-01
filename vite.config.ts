import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/search': {
        target: 'https://ixyuablustlfypjnjhpw.supabase.co/functions/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/search/, '/gemini-product-search'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err)
          })
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url)
          })
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      // This helps with code splitting and optimization
      output: {
        manualChunks: {
          'supabase': ['@supabase/supabase-js'],
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
  define: {
    // Ensure environment variables are properly replaced
    'process.env': process.env
  }
})