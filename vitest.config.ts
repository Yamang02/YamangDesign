import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@app': path.resolve(__dirname, './src/app'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
  },
});
