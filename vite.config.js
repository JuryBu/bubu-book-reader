import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 整书阅读展示站。base './' 便于本地直开与子路径/静态部署；HashRouter 兼容。
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5190,
    host: '127.0.0.1',
  },
})
