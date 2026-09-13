import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  // User site served from the domain root.
  base: '/',

  server: {
    port: 3000,
  },

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            // React changes far less often than site content, so it gets its own cacheable chunk.
            manualChunks: {
              react: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
            },
          },
        },
  },
}));
