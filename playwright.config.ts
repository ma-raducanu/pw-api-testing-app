import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 1,
  reporter: [['html'], ['list']],
  use: {
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: "only-on-failure"
  },
  projects: [
    {
      name: 'api-testing',
    },
  ],
});