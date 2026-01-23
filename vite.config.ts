import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Check if we're running as a submodule (../backend exists) or symlinked (../NexusGate/backend exists)
const isSubmodule = existsSync(resolve(__dirname, '../backend'));
const isSymlink = existsSync(resolve(__dirname, '../NexusGate/backend'));

// When running as submodule, build directly to ../backend/docs
// When symlinked, build to local dist/ first (for prerender dependency resolution),
// then copy via build script to ../NexusGate/backend/docs/client/
const outDir = isSubmodule ? '../backend/docs' : 'dist';

export default defineConfig({
  base: '/docs/',
  server: {
    port: 3002,
  },
  build: {
    outDir: 'dist',
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
        { path: '/' },
        { path: '/en' },
        { path: '/zh' },
        { path: '/api/search' },
      ],
    }),
    react(),
  ],
});
