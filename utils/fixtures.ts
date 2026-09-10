import { test as base } from '@playwright/test'
import { RequestHandler } from './request-handler'

export type TestOptions = {
  api: RequestHandler
}

export const test = base.extend<TestOptions>({
  api: async ({ request }, use) => {
    const requestBaseUrl = 'https://conduit-api.bondaracademy.com/api'
    const requestHandler = new RequestHandler(request, requestBaseUrl)
    await use(requestHandler)
  }
})

export { expect } from '@playwright/test'