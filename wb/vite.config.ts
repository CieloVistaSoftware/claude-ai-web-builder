import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WebsiteBuilder',
      fileName: (format) => `wb.${format}.js`,
      formats: ['es', 'umd', 'cjs']
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.ts'),
        builder: resolve(__dirname, 'src/core/builder.ts'),
        components: resolve(__dirname, 'src/components/index.ts')
      },
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      external: ['canvas-confetti']
    },
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    }
  },

  // Development server
  server: {
    port: 3000,
    host: true,
    open: true,
    hmr: {
      overlay: true
    }
  },

  // Preview server
  preview: {
    port: 4173,
    host: true
  },

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/core': resolve(__dirname, 'src/core'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/api': resolve(__dirname, 'src/api')
    }
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  },

  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },

  // Optimization
  optimizeDeps: {
    include: ['zustand']
  },

  // Testing with Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
});