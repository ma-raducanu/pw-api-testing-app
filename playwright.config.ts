import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '.env') })

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 1,
  reporter: [['html', {open: 'never'}], ['list']], // add the never flag for html so there is no conflict with copilot in the terminal
  use: {
    // extraHTTPHeaders: {
    //   // Authorization: `Token ${process.env.API_TOKEN}` // this will add the Authorization header to all requests, but it can't be removed when you need to test requests without it.
    // }
    // httpCredentials: {
    //   username: process.env.API_USERNAME || '',
    //   password: process.env.API_PASSWORD || ''
    // }
    baseURL: 'https://conduit.bondaracademy.com',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'api-test',
      testDir: './tests/api-tests',
      dependencies: ['api-smoke-test']
    },
    {
      name: 'api-smoke-test',
      testDir: './tests/api-tests',
      testMatch: 'smoke*'
    },
    {
      name: 'ui-smoke-test',
      testDir: './tests/ui-tests',
      use: {
        defaultBrowserType: 'chromium'
      }
    }
  ],
});