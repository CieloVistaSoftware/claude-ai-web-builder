import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: false // Set to a specific file if you want auto-open
  },
  build: {
    outDir: 'dist'
  }
});
