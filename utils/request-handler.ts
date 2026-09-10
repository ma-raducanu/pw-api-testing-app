import { APIRequestContext, expect } from "@playwright/test"

export class RequestHandler {
  private request: APIRequestContext
  private requestUrl: string | undefined
  private requestBaseUrl: string | undefined
  private requestPath: string = ''
  private requestParams: object = {}
  private requestHeaders: Record<string, string> = {}
  private requestBody: object = {}

  constructor(request: APIRequestContext, requestUrl: string) {
    this.request = request
    this.requestUrl = requestUrl
  }

  url(url: string) {
    this.requestUrl = url
    return this // this is called fluent interface design, it allows this method to be accessed by other methods in a chain
  }

  path(path: string) {
    this.requestPath = path
    return this
  }

  params(params: object) {
    this.requestParams = params
    return this
  }

  headers(headers: Record<string, string>) {
    this.requestHeaders = headers
    return this
  }

  body(body: object) {
    this.requestBody = body
    return this
  }

  async getRequest(statusCode: number) {
    const url = this.getUrl()
    const response = await this.request.get(url, {
      headers: this.requestHeaders
    })
    const responseJson = await response.json()
    expect(response.status()).toBe(statusCode)
    return responseJson
  }

  private getUrl() {
    const url = new URL(`${this.requestUrl ?? this.requestBaseUrl}${this.requestPath}`) // if the requestUrl is not set, use the requestBaseUrl
    for (const [key, value] of Object.entries(this.requestParams)) {
      url.searchParams.append(key, value)
    }
    return url.toString()
  }
}