import { defineConfig } from 'vite';

export default defineConfig({
  base: '/shinobiwan-studio/',
  build: {
    sourcemap: true,
    target: 'es2022',
  },
});
