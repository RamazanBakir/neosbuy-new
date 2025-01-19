import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
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
          proxy.on('proxyReq', (req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url)
          })
        }
      }
    }
  }
})
