import { APIRequestContext } from "@playwright/test"
import { APILogger } from "./logger"

export class RequestHandler {
  private request: APIRequestContext
  private requestUrl: string | undefined
  private requestBaseUrl: string | undefined
  private requestPath: string = ''
  private requestParams: object = {}
  private requestHeaders: Record<string, string> = {}
  private requestBody: object = {}
  private logger: APILogger

  constructor(request: APIRequestContext, requestUrl: string, logger: APILogger) {
    this.request = request
    this.requestUrl = requestUrl
    this.logger = logger
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
    this.logger.logRequest('GET', url, this.requestHeaders)
    const response = await this.request.get(url, {
      headers: this.requestHeaders
    })
    const actualStatus = response.status()
    const responseJson = await response.json()
    this.logger.logResponse(actualStatus, responseJson)
    this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
    return responseJson
  }

  async postRequest(statusCode: number) {
    const url = this.getUrl()
    this.logger.logRequest('POST', url, this.requestHeaders, this.requestBody)
    const response = await this.request.post(url, {
      headers: this.requestHeaders,
      data: this.requestBody
    })
    const actualStatus = response.status()
    const responseJson = await response.json()
    this.logger.logResponse(actualStatus, responseJson)
    this.statusCodeValidator(actualStatus, statusCode, this.postRequest)
    return responseJson
  }

  async putRequest(statusCode: number) {
    const url = this.getUrl()
    this.logger.logRequest('PUT', url, this.requestHeaders, this.requestBody)
    const response = await this.request.put(url, {
      headers: this.requestHeaders,
      data: this.requestBody
    })
    const actualStatus = response.status()
    const responseJson = await response.json()
    this.logger.logResponse(actualStatus, responseJson)
    this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
    return responseJson
  }

  async deleteRequest(statusCode: number) { // delete does not have a response body
    const url = this.getUrl()
    this.logger.logRequest('DELETE', url, this.requestHeaders)
    const response = await this.request.delete(url, {
      headers: this.requestHeaders
    })
    const actualStatus = response.status()
    this.logger.logResponse(actualStatus)
    this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
  }

  private getUrl() {
    const url = new URL(`${this.requestUrl ?? this.requestBaseUrl}${this.requestPath}`) // if the requestUrl is not set, use the requestBaseUrl
    for (const [key, value] of Object.entries(this.requestParams)) {
      url.searchParams.append(key, value)
    }
    return url.toString()
  }

  private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function) {
    if (actualStatus !== expectedStatus) {
      const logs = this.logger.getRecentLogs()
      const error = new Error(`Expected status ${expectedStatus} but received ${actualStatus}\n\nRecent logs:\n${logs}`)
      Error.captureStackTrace(error, callingMethod)
      throw error
    }
  }
}