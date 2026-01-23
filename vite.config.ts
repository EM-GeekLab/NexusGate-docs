import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';

export default defineConfig({
  base: '/docs/',
  server: {
    port: 3002,
  },
  build: {
    outDir: '../backend/docs',
    emptyOutDir: true,
  },
  plugins: [
    mdx(await import('./source.config')),
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          outputPath: 'index.html',
          enabled: true,
          crawlLinks: true,
        },
      },

      pages: [
        {
          path: '/',
        },
        {
          path: '/en',
        },
        {
          path: '/zh',
        },
        {
          path: '/api/search',
        },
      ],
    }),
    react(),
  ],
});
