import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Actions cung cấp VITE_BASE_PATH theo tên repository khi deploy Pages.
  // Khi chạy local hoặc dùng custom domain, giữ đường dẫn gốc.
  base: process.env.VITE_BASE_PATH || '/',
})
