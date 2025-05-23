import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: "./",
  build: {
    outDir: 'dist-react',
  },
  server: {
    port: 5123,
    strictPort: true
  }
})
