import { defineConfig } from 'vite';
import { resolve } from 'path';
import Markdown from 'vite-plugin-md';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
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
