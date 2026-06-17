import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 整书阅读展示站。base './' 便于本地直开与子路径/静态部署；HashRouter 兼容。
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5190,
    host: '127.0.0.1',
    // dev：/api 代理到本地 AI 后端（server/，端口 5191）；生产由 server serve dist 同源，相对 /api 直达
    proxy: { '/api': 'http://127.0.0.1:5191' },
  },
})
