import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Vse zahtevke na /api posreduj backendu, zato ni treba nastavljati CORS
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
