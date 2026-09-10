import { APIRequestContext } from "@playwright/test"
import { APILogger } from "./logger"

export class RequestHandler {
  private request: APIRequestContext
  private requestLogger: APILogger
  private requestUrl: string = ''
  private requestBaseUrl: string | undefined
  private requestPath: string = ''
  private requestParams: object = {}
  private requestHeaders: Record<string, string> = {}
  private requestBody: object = {}

  constructor(request: APIRequestContext, requestUrl: string, logger: APILogger) {
    this.request = request
    this.requestUrl = requestUrl
    this.requestLogger = logger
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
    this.requestLogger.logRequest('GET', url, this.requestHeaders)
    const response = await this.request.get(url, {
      headers: this.requestHeaders
    })
    this.clearRequestData()
    const actualStatus = response.status()
    const responseJson = await response.json()
    this.requestLogger.logResponse(actualStatus, responseJson)
    this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
    return responseJson
  }

  async postRequest(statusCode: number) {
    const url = this.getUrl()
    this.requestLogger.logRequest('POST', url, this.requestHeaders, this.requestBody)
    const response = await this.request.post(url, {
      headers: this.requestHeaders,
      data: this.requestBody
    })
    this.clearRequestData()
    const actualStatus = response.status()
    const responseJson = await response.json()
    this.requestLogger.logResponse(actualStatus, responseJson)
    this.statusCodeValidator(actualStatus, statusCode, this.postRequest)
    return responseJson
  }

  async putRequest(statusCode: number) {
    const url = this.getUrl()
    this.requestLogger.logRequest('PUT', url, this.requestHeaders, this.requestBody)
    const response = await this.request.put(url, {
      headers: this.requestHeaders,
      data: this.requestBody
    })
    this.clearRequestData()
    const actualStatus = response.status()
    const responseJson = await response.json()
    this.requestLogger.logResponse(actualStatus, responseJson)
    this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
    return responseJson
  }

  async deleteRequest(statusCode: number) { // delete does not have a response body
    const url = this.getUrl()
    this.requestLogger.logRequest('DELETE', url, this.requestHeaders)
    const response = await this.request.delete(url, {
      headers: this.requestHeaders
    })
    this.clearRequestData()
    const actualStatus = response.status()
    this.requestLogger.logResponse(actualStatus)
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
      const logs = this.requestLogger.getRecentLogs()
      const error = new Error(`Expected status ${expectedStatus} but received ${actualStatus}\n\nRecent logs:\n${logs}`)
      Error.captureStackTrace(error, callingMethod)
      throw error
    }
  }

  private clearRequestData() { // this method will clear the request so the logs won't contain previous request data
    this.requestBaseUrl = undefined
    this.requestPath = ''
    this.requestParams = {}
    this.requestHeaders = {}
    this.requestBody = {}
  }
}