import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
  optimizeDeps: {
    include: ['monaco-editor', '@monaco-editor/react', 'yjs', 'y-monaco', 'y-socket.io'],
  },
  worker: {
    format: 'es',
  },
})
