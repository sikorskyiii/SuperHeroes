import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.js'],
    pool: 'forks',                 // стабільніше з Prisma
    coverage: { reporter: ['text', 'html'] },
  },
})
