import { test } from '../utils/fixtures'
import { expect } from '../utils/custom-assertions'
import login from '../test-data/login.json'
import newArticle1 from '../test-data/new-article-1.json'
import updatedArticle from '../test-data/updated-article.json'

let authToken: string

test.beforeAll(async ({ api }) => {
  const response = await api
    .path('/users/login')
    .body(login)
    .postRequest(200)
  authToken = `Token ${response.user.token}`
})

test('Get articles', async ({ api }) => {
  const articlesResponse = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse.articles.length).shouldBeLessThanOrEqual(10)
  expect(articlesResponse.articlesCount).shouldEqual(10)
})

test('Get tags', async ({ api }) => {
  const tagsResponse = await api
    .path('/tags')
    .getRequest(200)
  expect(tagsResponse.tags.length).shouldBeLessThanOrEqual(10)
})

test('Create and delete article', async ({ api }) => {
  const articleCreateResponse = await api
    .path('/articles')
    .headers({ Authorization: authToken })
    .body(newArticle1)
    .postRequest(201)
  expect(articleCreateResponse.article.title).shouldEqual(newArticle1.article.title)
  const slugId = articleCreateResponse.article.slug

  const articlesResponse1 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse1.articles[0].title).shouldEqual(newArticle1.article.title)

  await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204)

  const articlesResponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse2.articles[0].title).not.shouldEqual(newArticle1.article.title)
})

test('Create update and delete article', async ({ api }) => {
  const articleCreateResponse = await api
    .path('/articles')
    .headers({ Authorization: authToken })
    .body(newArticle1)
    .postRequest(201)
  expect(articleCreateResponse.article.title).shouldEqual(newArticle1.article.title)
  const slugId = articleCreateResponse.article.slug

  const articleUpdateResponse = await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .body(updatedArticle)
    .putRequest(200)
  expect(articleUpdateResponse.article.title).shouldEqual(updatedArticle.article.title)
  const updatedSlugId = articleUpdateResponse.article.slug

  const articlesResponse1 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse1.articles[0].title).shouldEqual(updatedArticle.article.title)

  await api
    .path(`/articles/${updatedSlugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204)

  const articlesResponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse2.articles[0].title).not.shouldEqual(updatedArticle.article.title)
})