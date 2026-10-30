import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local/Vercel: '/' | GitHub Pages: '/asas/' (set via VITE_BASE_PATH in CI)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
