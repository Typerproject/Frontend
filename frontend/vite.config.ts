import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/analyst': {
        target: 'https://consensus.hankyung.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/analyst/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received response from target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('pdf.worker.js')) {
            return 'pdf.worker';
          }
        },
      },
    },
  },
});
