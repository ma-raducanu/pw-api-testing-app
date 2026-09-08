import { test, expect } from '@playwright/test'

test('Get Tags', async ({ request }) => { // page is not needed for pure API tests
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJson = await tagsResponse.json()
  expect(tagsResponse.status()).toBe(200)
  expect(tagsResponseJson.tags[0]).toBe('Test')
  expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10)
  console.log(tagsResponseJson)
});

test('Get Articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=1&offset=0')
  const articlesResponseJson = await articlesResponse.json()
  expect(articlesResponse.status()).toBe(200)
  expect(articlesResponseJson.articles[0].title).toContain('Bondar Academy')
  expect(articlesResponseJson.articles.length).toBeLessThanOrEqual(10)
  expect(articlesResponseJson.articlesCount).toBe(10)
  console.log(articlesResponseJson)
})