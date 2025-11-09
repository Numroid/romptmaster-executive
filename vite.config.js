import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Allow external connections (Replit requirement)
    strictPort: false,
    hmr: {
      clientPort: 443 // Replit uses port 443 for WebSocket
    },
    allowedHosts: [
      '.replit.dev', // Allow all Replit subdomains
      'localhost',
      '127.0.0.1'
    ]
  },
  build: {
    outDir: 'dist'
  }
})