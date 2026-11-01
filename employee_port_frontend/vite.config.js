import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // Forward API calls to the CAP backend from the Vite server.
    // The browser only talks to the same origin, so this works with
    // localhost, port forwarding and tunnels (no CORS/mixed-content issues).
    proxy: {
      '/odata': {
        target: 'http://localhost:4004',
        changeOrigin: true,
      },
    },
  },
});
