import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/llama-api': {
        target: 'https://api.cloud.llamaindex.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/llama-api/, ''),
        secure: true,
      }
    }
  }
});
