import { test, expect } from '../utils/fixtures'

test('Get articles', async ({ api }) => {
  const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(response.articles.length).toBeLessThanOrEqual(10)
  expect(response.articlesCount).toBe(10)
  console.log(response)
})

test('Get tags', async ({ api }) => {
  const response = await api
    .path('/tags')
    .getRequest(200)
  expect(response.tags.length).toBeGreaterThan(0)
  console.log(response)
})