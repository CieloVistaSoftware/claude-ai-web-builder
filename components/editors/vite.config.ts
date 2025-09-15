import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      'react': 'https://unpkg.com/react@18/umd/react.development.js',
      'react-dom': 'https://unpkg.com/react-dom@18/umd/react-dom.development.js'
    }
  }
})