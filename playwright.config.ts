import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 1,
  reporter: [['html'], ['list']],
  use: {
    // extraHTTPHeaders: {
    //   // Authorization: `Token ${process.env.API_TOKEN}` // this will add the Authorization header to all requests, but it can't be removed when you need to test requests without it.
    // }
    // httpCredentials: {
    //   username: process.env.API_USERNAME || '',
    //   password: process.env.API_PASSWORD || ''
    // }
  },
  projects: [
    {
      name: 'api-test',
      testMatch: 'api*',
      dependencies: ['smoke-test']
    },
    {
      name: 'smoke-test',
      testMatch: 'smoke*'
    },
  ],
});