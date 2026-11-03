import { defineConfig, devices } from '@playwright/test'

const externalUrl = process.env.PLAYWRIGHT_BASE_URL
export default defineConfig({
  testDir: './tests/ui',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: externalUrl ?? 'http://127.0.0.1:3092', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: externalUrl ? undefined : {
    command: 'npm run start -- --hostname 127.0.0.1 --port 3092',
    url: 'http://127.0.0.1:3092', reuseExistingServer: false, timeout: 60_000,
  },
})
