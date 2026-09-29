import articleRequestPayload from '../request-objects/POST-article.json'
import commentRequestPayload from '../request-objects/POST-comment.json'
import { faker } from "@faker-js/faker";

export function getNewRandomArticle() {
  const articleRequest = structuredClone(articleRequestPayload)
  articleRequest.article.title = faker.lorem.sentence(3)
  articleRequest.article.description = faker.lorem.sentence(5)
  articleRequest.article.body = faker.lorem.paragraph(7)
  return articleRequest
}

export function getNewRandomComment() {
  const commentRequest = structuredClone(commentRequestPayload)
  commentRequest.comment.body = faker.lorem.sentence(5)
  return commentRequest
}