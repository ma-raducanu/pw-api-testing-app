import { test } from '../../utils/fixtures'
import { expect } from '../../utils/custom-assertions'
import { getNewRandomArticle, getNewRandomComment } from '../../utils/data-generator'

test('HAR Flow - Article Creation, Duplicate Title Error and Commenting', async ({ api }) => {
  const articlesResponse1 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .clearAuth()
    .getRequest(200)
  await expect(articlesResponse1).shouldMatchSchema('articles', 'GET_articles')

  const tagsResponse1 = await api
    .path('/tags')
    .clearAuth()
    .getRequest(200)
  await expect(tagsResponse1).shouldMatchSchema('tags', 'GET_tags')

  const articlesResponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  await expect(articlesResponse2).shouldMatchSchema('articles', 'GET_articles')

  const tagsResponse2 = await api
    .path('/tags')
    .getRequest(200)
  await expect(tagsResponse2).shouldMatchSchema('tags', 'GET_tags')

  const articleRequest = getNewRandomArticle()
  const createArticleResponse = await api
    .path('/articles')
    .body(articleRequest)
    .postRequest(201)
  await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
  expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title)
  const articleSlug = createArticleResponse.article.slug

  // reuse the same title to trigger the duplicate title validation error
  const duplicateArticleRequest = getNewRandomArticle()
  duplicateArticleRequest.article.title = articleRequest.article.title
  const duplicateTitleResponse = await api
    .path('/articles')
    .body(duplicateArticleRequest)
    .postRequest(422)
  await expect(duplicateTitleResponse).shouldMatchSchema('articles', 'POST_articles_422')
  expect(duplicateTitleResponse.errors.title[0]).shouldEqual('must be unique')

  const getArticleResponse = await api
    .path(`/articles/${articleSlug}`)
    .getRequest(200)
  await expect(getArticleResponse).shouldMatchSchema('articles', 'GET_articles_slug')
  expect(getArticleResponse.article.slug).shouldEqual(articleSlug)

  const getCommentsResponse = await api
    .path(`/articles/${articleSlug}/comments`)
    .getRequest(200)
  await expect(getCommentsResponse).shouldMatchSchema('articles', 'GET_articles_comments')
  expect(getCommentsResponse.comments.length).shouldEqual(0)

  const commentRequest = getNewRandomComment()
  const postCommentResponse = await api
    .path(`/articles/${articleSlug}/comments`)
    .body(commentRequest)
    .postRequest(200)
  await expect(postCommentResponse).shouldMatchSchema('articles', 'POST_articles_comments')
  expect(postCommentResponse.comment.body).shouldEqual(commentRequest.comment.body)

  await api
    .path(`/articles/${articleSlug}`)
    .deleteRequest(204)
})
