import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// - 프로젝트 사이트 (username.github.io/repo-name/): base = '/repo-name/'
// - 사용자/조직 사이트 (username.github.io): base = '/'
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/YamangDesign/',
  plugins: [react()],
})
