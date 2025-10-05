import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Public directory configuration (default is 'public')
  // Files in /public/ are served at root URL
  // Example: /public/assets/video.mp4 → http://localhost:5173/assets/video.mp4
  publicDir: 'public',
})
