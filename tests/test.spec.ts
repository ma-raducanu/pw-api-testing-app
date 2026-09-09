import { test, expect } from '@playwright/test'
import login from '../test-data/login.json'
import newArticle from '../test-data/new-article.json'
import updatedArticle from '../test-data/updated-article.json'

test('Get Tags', async ({ request }) => { // page is not needed for pure API tests
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJson = await tagsResponse.json()
  expect(tagsResponse.status()).toBe(200)
  expect(tagsResponseJson.tags[0]).toBe('Test')
  expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10)
  console.log(tagsResponseJson)
});

test('Get Articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articlesResponseJson = await articlesResponse.json()
  expect(articlesResponse.status()).toBe(200)
  expect(articlesResponseJson.articles[0].title).toContain('Bondar Academy')
  expect(articlesResponseJson.articles.length).toBeLessThanOrEqual(10)
  expect(articlesResponseJson.articlesCount).toBe(10)
  console.log(articlesResponseJson)
})

test('Create and Delete Article', async ({ request }) => {
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: login
  })
  const tokenResponseJson = await tokenResponse.json()
  const authToken = `Token ${tokenResponseJson.user.token}`
  console.log(authToken)
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: newArticle,
    headers: {
      Authorization: authToken
    }
  })
  const newArticleResponseJson = await newArticleResponse.json()
  expect(newArticleResponse.status()).toBe(201)
  expect(newArticleResponseJson.article.title).toBe(newArticle.article.title)
  expect(newArticleResponseJson.article.description).toBe(newArticle.article.description)
  expect(newArticleResponseJson.article.body).toBe(newArticle.article.body)
  expect(newArticleResponseJson.article.tagList).toEqual(newArticle.article.tagList)
  const slugId = newArticleResponseJson.article.slug
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    data: updatedArticle,
    headers: {
      Authorization: authToken
    }
  })
  const articlesResponseJson = await articlesResponse.json()
  expect(articlesResponse.status()).toBe(200)
  expect(articlesResponseJson.articles[0].title).toBe(newArticle.article.title)
  expect(articlesResponseJson.articles[0].description).toBe(newArticle.article.description)
  expect(articlesResponseJson.articles[0].body).toBe(newArticle.article.body)
  expect(articlesResponseJson.articles[0].tagList).toEqual(newArticle.article.tagList)
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: authToken
    }
  })
  expect(deleteArticleResponse.status()).toBe(204)
  console.log(newArticleResponseJson)
  console.log(articlesResponseJson)
})

test('Create, Update and  Article', async ({ request }) => {
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: login
  })
  const tokenResponseJson = await tokenResponse.json()
  const authToken = `Token ${tokenResponseJson.user.token}`
  console.log(authToken)
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: newArticle,
    headers: {
      Authorization: authToken
    }
  })
  const newArticleResponseJson = await newArticleResponse.json()
  expect(newArticleResponse.status()).toBe(201)
  expect(newArticleResponseJson.article.title).toBe(newArticle.article.title)
  expect(newArticleResponseJson.article.description).toBe(newArticle.article.description)
  expect(newArticleResponseJson.article.body).toBe(newArticle.article.body)
  expect(newArticleResponseJson.article.tagList).toEqual(newArticle.article.tagList)
  const slugId = newArticleResponseJson.article.slug
  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    data: updatedArticle,
    headers: {
      Authorization: authToken
    }
  })
  const updateArticleResponseJson = await updateArticleResponse.json()
  expect(updateArticleResponse.status()).toBe(200)
  expect(updateArticleResponseJson.article.description).toBe(updatedArticle.article.description)
  expect(updateArticleResponseJson.article.body).toBe(updatedArticle.article.body)
  expect(updateArticleResponseJson.article.tagList).toEqual(updatedArticle.article.tagList)
  expect(updateArticleResponseJson.article.title).toBe(updatedArticle.article.title)
  const updatedSlugId = updateArticleResponseJson.article.slug
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      Authorization: authToken
    }
  })
  const articlesResponseJson = await articlesResponse.json()
  expect(articlesResponse.status()).toBe(200)
  expect(articlesResponseJson.articles[0].title).toBe(updatedArticle.article.title)
  expect(articlesResponseJson.articles[0].description).toBe(updatedArticle.article.description)
  expect(articlesResponseJson.articles[0].body).toBe(updatedArticle.article.body)
  expect(articlesResponseJson.articles[0].tagList).toEqual(updatedArticle.article.tagList)
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updatedSlugId}`, {
    headers: {
      Authorization: authToken
    }
  })
  expect(deleteArticleResponse.status()).toBe(204)
  console.log(newArticleResponseJson)
  console.log(articlesResponseJson)
})