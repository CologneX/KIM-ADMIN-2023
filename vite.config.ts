import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CORS 
  server: {
    proxy: {
      '/api': {
        target: 'https://kopdisu.store',
        changeOrigin: true,

      },
      '/usercontent': {
        target: 'https://kopdisu.store',
        changeOrigin: true,
      }
    }
  }
})
