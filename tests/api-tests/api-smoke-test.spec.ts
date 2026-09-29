import { test } from '../../utils/fixtures'
import { expect } from '../../utils/custom-assertions'
import { getNewRandomArticle } from '../../utils/data-generator'

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
  const articleRequest = getNewRandomArticle()
  const articleCreateResponse = await api
    .path('/articles')
    .body(articleRequest)
    .postRequest(201)
  await expect(articleCreateResponse).shouldMatchSchema('articles', 'POST_articles')
  expect(articleCreateResponse.article.title).shouldEqual(articleRequest.article.title)
  const slugId = articleCreateResponse.article.slug
  const articlesResponse1 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  await expect(articlesResponse1).shouldMatchSchema('articles', 'GET_articles')
  expect(articlesResponse1.articles[0].title).shouldEqual(articleRequest.article.title)
  await api
    .path(`/articles/${slugId}`)
    .deleteRequest(204)
  const articlesResponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  await expect(articlesResponse2).shouldMatchSchema('articles', 'GET_articles')
  expect(articlesResponse2.articles[0].title).not.shouldEqual(articleRequest.article.title)
})

test('Create, update and delete article', async ({ api }) => {
  const articleRequest1 = getNewRandomArticle()
  const articleCreateResponse = await api
    .path('/articles')
    .body(articleRequest1)
    .postRequest(201)
  await expect(articleCreateResponse).shouldMatchSchema('articles', 'POST_articles')
  expect(articleCreateResponse.article.title).shouldEqual(articleRequest1.article.title)
  const slugId = articleCreateResponse.article.slug
  const articleRequest2 = getNewRandomArticle()
  const articleUpdateResponse = await api
    .path(`/articles/${slugId}`)
    .body(articleRequest2)
    .putRequest(200)
  await expect(articleUpdateResponse).shouldMatchSchema('articles', 'PUT_articles')
  expect(articleUpdateResponse.article.title).shouldEqual(articleRequest2.article.title)
  const updateSlugId = articleUpdateResponse.article.slug
  const articlesResponse1 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  await expect(articlesResponse1).shouldMatchSchema('articles', 'GET_articles')
  expect(articlesResponse1.articles[0].title).shouldEqual(articleRequest2.article.title)
  await api
    .path(`/articles/${updateSlugId}`)
    .deleteRequest(204)
  const articlesResponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  await expect(articlesResponse2).shouldMatchSchema('articles', 'GET_articles')
  expect(articlesResponse2.articles[0].title).not.shouldEqual(articleRequest2.article.title)
})