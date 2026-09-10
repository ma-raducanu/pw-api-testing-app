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
    expect(response.status()).toBe(statusCode)
    const responseJson = await response.json()
    return responseJson
  }

  async postRequest(statusCode: number) {
    const url = this.getUrl()
    const response = await this.request.post(url, {
      headers: this.requestHeaders,
      data: this.requestBody
    })
    expect(response.status()).toBe(statusCode)
    const responseJson = await response.json()
    return responseJson
  }

  async putRequest(statusCode: number) {
    const url = this.getUrl()
    const response = await this.request.put(url, {
      headers: this.requestHeaders,
      data: this.requestBody
    })
    expect(response.status()).toBe(statusCode)
    const responseJson = await response.json()
    return responseJson
  }

  async deleteRequest(statusCode: number) { // delete does not have a response body
    const url = this.getUrl()
    const response = await this.request.delete(url, {
      headers: this.requestHeaders
    })
    expect(response.status()).toBe(statusCode)
  }

  private getUrl() {
    const url = new URL(`${this.requestUrl ?? this.requestBaseUrl}${this.requestPath}`) // if the requestUrl is not set, use the requestBaseUrl
    for (const [key, value] of Object.entries(this.requestParams)) {
      url.searchParams.append(key, value)
    }
    return url.toString()
  }
}