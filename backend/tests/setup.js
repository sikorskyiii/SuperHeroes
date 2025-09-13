import { execSync } from 'node:child_process'

beforeAll(() => {
  process.env.DATABASE_URL ||= 'file:./test.db'
  execSync('npx prisma db push --force-reset', { stdio: 'inherit', cwd: process.cwd() })
})
