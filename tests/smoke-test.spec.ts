import { test, expect } from '../utils/fixtures'
import newArticle1 from '../test-data/new-article-1.json'
import updatedArticle from '../test-data/updated-article.json'

let authToken: string

test.beforeAll(async ({ api }) => {
  const response = await api
    .path('/users/login')
    .body({ user: { email: 'mircea.alexandru.vi.raducanu@gmail.com', password: 'Testing123!' } })
    .postRequest(200)
  authToken = `Token ${response.user.token}`
})

test('Get articles', async ({ api }) => {
  const articlesResponse = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse.articles.length).toBeLessThanOrEqual(10)
  expect(articlesResponse.articlesCount).toBe(10)
  console.log(articlesResponse)
})

test('Get tags', async ({ api }) => {
  const tagsResponse = await api
    .path('/tags')
    .getRequest(200)
  expect(tagsResponse.tags.length).toBeGreaterThan(0)
  console.log(tagsResponse)
})

test('Create and delete article', async ({ api }) => {
  const articleCreateResponse = await api
    .path('/articles')
    .headers({ Authorization: authToken })
    .body(newArticle1)
    .postRequest(201)
  expect(articleCreateResponse.article.title).toEqual(newArticle1.article.title)
  const slugId = articleCreateResponse.article.slug

  const articlesResponse1 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse1.articles[0].title).toEqual(newArticle1.article.title)

  await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204)
    
  const articlesResponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse2.articles[0].title).not.toEqual(newArticle1.article.title)
})

test('Create update and delete article', async ({ api }) => {
  const articleCreateResponse = await api
    .path('/articles')
    .headers({ Authorization: authToken })
    .body(newArticle1)
    .postRequest(201)
  expect(articleCreateResponse.article.title).toEqual(newArticle1.article.title)
  const slugId = articleCreateResponse.article.slug

  const articleUpdateResponse = await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .body(updatedArticle)
    .putRequest(200)
  expect(articleUpdateResponse.article.title).toEqual(updatedArticle.article.title)
  const updatedSlugId = articleUpdateResponse.article.slug

  const articlesResponse1 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse1.articles[0].title).toEqual(updatedArticle.article.title)

  await api
    .path(`/articles/${updatedSlugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204)

  const articlesResponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse2.articles[0].title).not.toEqual(updatedArticle.article.title)
})