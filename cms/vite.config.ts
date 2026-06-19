/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog, { type PrerenderContentFile } from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
    alias: {
      "@services": path.resolve(__dirname, './src/app/core/services'),
    }
  },
  plugins: [
    analog({
      // enable content/highlighter
      content: {
        highlighter: 'prism',
      },
      // SSG
      prerender: {
        routes: async () => [
          {
            contentDir: 'src/content/blog-content',
            transform: (file: PrerenderContentFile) => {
              const slug = file.attributes['slug'] || file.name;
              return `/blog/${slug}`;
            },
            outputSourceFile: (file: PrerenderContentFile) => {
              // No exportar archivos markdown para posts en borrador
              if (file.attributes['draft']) {
                return false;
              }
              return file.content;
            },
          },
        ],
      },
    }),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
