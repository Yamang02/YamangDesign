import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// 커스텀 도메인 사용 시 base는 '/'
export default defineConfig({
  base: '/',
  plugins: [react()],
})
