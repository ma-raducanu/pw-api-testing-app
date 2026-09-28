import { test } from '../utils/fixtures'
import { expect } from '../utils/custom-assertions'
import articleRequestPayload from '../request-objects/POST-article.json'
import updateArticleRequestPayload from '../request-objects/PUT-update-article.json'

test('Get articles', async ({ api }) => {
  const articlesResponse = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .clearAuth()
    .getRequest(200)
  await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles') // remember to remove the true flag after generating the schema or your test will always pass
  expect(articlesResponse.articles.length).shouldBeLessThanOrEqual(10)
  expect(articlesResponse.articlesCount).shouldEqual(10)
})

test('Get tags', async ({ api }) => {
  const tagsResponse = await api
    .path('/tags')
    .getRequest(200)
  await expect(tagsResponse).shouldMatchSchema('tags', 'GET_tags')
  expect(tagsResponse.tags[0]).shouldEqual('Test')
  expect(tagsResponse.tags.length).shouldBeLessThanOrEqual(10)
})

test('Create and delete article', async ({ api }) => {
  const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload)) // this method will fix concurrency issues by assigning different values to break the dependency when running parallel execution
  articleRequest.article.title = 'This is an object title' // you can use this method to override the value from the request object
  const articleCreateResponse = await api
    .path('/articles')
    .body(articleRequestPayload)
    .postRequest(201)
  await expect(articleCreateResponse).shouldMatchSchema('articles', 'POST_articles')
  expect(articleCreateResponse.article.title).shouldEqual(articleRequestPayload.article.title)
  const slugId = articleCreateResponse.article.slug
  const articlesResponse1 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse1.articles[0].title).shouldEqual(articleRequestPayload.article.title)
  await api
    .path(`/articles/${slugId}`)
    .deleteRequest(204)
  const articlesResponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse2.articles[0].title).not.shouldEqual(articleRequestPayload.article.title)
})

test('Create, update and delete article', async ({ api }) => {
  const articleCreateResponse = await api
    .path('/articles')
    .body(articleRequestPayload)
    .postRequest(201)
  expect(articleCreateResponse.article.title).shouldEqual(articleRequestPayload.article.title)
  const slugId = articleCreateResponse.article.slug
  const articleUpdateResponse = await api
    .path(`/articles/${slugId}`)
    .body(updateArticleRequestPayload)
    .putRequest(200)
  expect(articleUpdateResponse.article.title).shouldEqual(updateArticleRequestPayload.article.title)
  const updateSlugId = articleUpdateResponse.article.slug
  const articlesResponse1 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse1.articles[0].title).shouldEqual(updateArticleRequestPayload.article.title)
  await api
    .path(`/articles/${updateSlugId}`)
    .deleteRequest(204)
  const articlesResponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(articlesResponse2.articles[0].title).not.shouldEqual(updateArticleRequestPayload.article.title)
})