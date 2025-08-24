import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  hookTimeout: 30000,
  testTimeout: 30000,
  pool: 'threads',
  poolOptions:{ threads:{ maxThreads:1, minThreads:1 } },
    coverage: {
      enabled: false,
    }
  },
  resolve:{
    alias:{ '@': path.resolve(__dirname,'.') }
  }
});
