import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages publica este repositorio dentro de /ProjectE/.
  base: '/ProjectE/',
  plugins: [react()],
})
