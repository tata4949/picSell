import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Dockerコンテナ外からアクセスするために必要
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:8000',  // docker-compose のサービス名で解決
        changeOrigin: true,
      },
    },
  },
})
