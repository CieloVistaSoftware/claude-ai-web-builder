import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import Markdown from 'vite-plugin-md';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Markdown({
      // Options for the Markdown plugin
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true
      }
    }),
  ],
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        template: resolve(__dirname, 'website_template_generator.html')
      }
    }
  }
});
