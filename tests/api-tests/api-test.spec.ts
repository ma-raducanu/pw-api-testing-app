import { test, expect } from '@playwright/test'
import loginRequestPayload from '../../request-objects/POST-login.json'
import articleRequestPayload from '../../request-objects/POST-article.json'
import updateArticleRequestPayload from '../../request-objects/PUT-update-article.json'

let authToken: string

test.beforeAll(async ({ request }) => {
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: loginRequestPayload
  })
  const tokenResponseJson = await tokenResponse.json()
  authToken = `Token ${tokenResponseJson.user.token}`
})

test('Get tags', async ({ request }) => { // page is not needed for pure API tests
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJson = await tagsResponse.json()
  expect(tagsResponse.status()).toBe(200)
  expect(tagsResponseJson.tags[0]).toBe('Test')
  expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10)
});

test('Get articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articlesResponseJson = await articlesResponse.json()
  expect(articlesResponse.status()).toBe(200)
  expect(articlesResponseJson.articles[0].title).toContain('Bondar Academy')
  expect(articlesResponseJson.articles.length).toBeLessThanOrEqual(10)
  expect(articlesResponseJson.articlesCount).toBe(10)
})

test('Create and delete article', async ({ request }) => {
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: articleRequestPayload,
    headers: {
      Authorization: authToken
    }
  })
  const newArticleResponseJson = await newArticleResponse.json()
  expect(newArticleResponse.status()).toBe(201)
  expect(newArticleResponseJson.article.title).toBe(articleRequestPayload.article.title)
  expect(newArticleResponseJson.article.description).toBe(articleRequestPayload.article.description)
  expect(newArticleResponseJson.article.body).toBe(articleRequestPayload.article.body)
  expect(newArticleResponseJson.article.tagList).toEqual(articleRequestPayload.article.tagList)
  const slugId = newArticleResponseJson.article.slug
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      Authorization: authToken
    }
  })
  const articlesResponseJson = await articlesResponse.json()
  expect(articlesResponse.status()).toBe(200)
  expect(articlesResponseJson.articles[0].title).toBe(articleRequestPayload.article.title)
  expect(articlesResponseJson.articles[0].description).toBe(articleRequestPayload.article.description)
  expect(articlesResponseJson.articles[0].body).toBe(articleRequestPayload.article.body)
  expect(articlesResponseJson.articles[0].tagList).toEqual(articleRequestPayload.article.tagList)
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: authToken
    }
  })
  expect(deleteArticleResponse.status()).toBe(204)
})

test('Create, update and delete article', async ({ request }) => {
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: articleRequestPayload,
    headers: {
      Authorization: authToken
    }
  })
  const newArticleResponseJson = await newArticleResponse.json()
  expect(newArticleResponse.status()).toBe(201)
  expect(newArticleResponseJson.article.title).toBe(articleRequestPayload.article.title)
  expect(newArticleResponseJson.article.description).toBe(articleRequestPayload.article.description)
  expect(newArticleResponseJson.article.body).toBe(articleRequestPayload.article.body)
  expect(newArticleResponseJson.article.tagList).toEqual(articleRequestPayload.article.tagList)
  const slugId = newArticleResponseJson.article.slug
  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    data: updateArticleRequestPayload,
    headers: {
      Authorization: authToken
    }
  })
  const updateArticleResponseJson = await updateArticleResponse.json()
  expect(updateArticleResponse.status()).toBe(200)
  expect(updateArticleResponseJson.article.description).toBe(updateArticleRequestPayload.article.description)
  expect(updateArticleResponseJson.article.body).toBe(updateArticleRequestPayload.article.body)
  expect(updateArticleResponseJson.article.tagList).toEqual(updateArticleRequestPayload.article.tagList)
  expect(updateArticleResponseJson.article.title).toBe(updateArticleRequestPayload.article.title)
  const updateSlugId = updateArticleResponseJson.article.slug
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      Authorization: authToken
    }
  })
  const articlesResponseJson = await articlesResponse.json()
  expect(articlesResponse.status()).toBe(200)
  expect(articlesResponseJson.articles[0].title).toBe(updateArticleRequestPayload.article.title)
  expect(articlesResponseJson.articles[0].description).toBe(updateArticleRequestPayload.article.description)
  expect(articlesResponseJson.articles[0].body).toBe(updateArticleRequestPayload.article.body)
  expect(articlesResponseJson.articles[0].tagList).toEqual(updateArticleRequestPayload.article.tagList)
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updateSlugId}`, {
    headers: {
      Authorization: authToken
    }
  })
  expect(deleteArticleResponse.status()).toBe(204)
})