import { test } from "@playwright/test"
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
  private defaultAuthToken: string = ''
  private clearAuthFlag: boolean = false

  constructor(request: APIRequestContext, requestUrl: string, logger: APILogger, authToken: string = '') {
    this.request = request
    this.requestUrl = requestUrl
    this.requestLogger = logger
    this.defaultAuthToken = authToken
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

  clearAuth() {
    this.clearAuthFlag = true
    return this
  }

  async getRequest(statusCode: number) {
    let responseJson: any
    const url = this.getUrl()
    await test.step(`GET request to: ${url}`, async () => {
      this.requestLogger.logRequest('GET', url, this.getHeaders())
      const response = await this.request.get(url, {
        headers: this.getHeaders()
      })
      this.clearRequestData()
      const actualStatus = response.status()
      responseJson = await response.json()
      this.requestLogger.logResponse(actualStatus, responseJson)
      this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
    })
    return responseJson
  }

  async postRequest(statusCode: number) {
    let responseJson: any
    const url = this.getUrl()
    await test.step(`POST request to: ${url}`, async () => {
      this.requestLogger.logRequest('POST', url, this.getHeaders(), this.requestBody)
      const response = await this.request.post(url, {
        headers: this.getHeaders(),
        data: this.requestBody
      })
      this.clearRequestData()
      const actualStatus = response.status()
      responseJson = await response.json()
      this.requestLogger.logResponse(actualStatus, responseJson)
      this.statusCodeValidator(actualStatus, statusCode, this.postRequest)
    })
    return responseJson
  }

  async putRequest(statusCode: number) {
    let responseJson: any
    const url = this.getUrl()
    await test.step(`PUT request to: ${url}`, async () => {
      this.requestLogger.logRequest('PUT', url, this.getHeaders(), this.requestBody)
      const response = await this.request.put(url, {
        headers: this.getHeaders(),
        data: this.requestBody
      })
      this.clearRequestData()
      const actualStatus = response.status()
      responseJson = await response.json()
      this.requestLogger.logResponse(actualStatus, responseJson)
      this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
    })
    return responseJson
  }

  async deleteRequest(statusCode: number) { // delete does not have a response body
    const url = this.getUrl()
    await test.step(`DELETE request to: ${url}`, async () => {
      this.requestLogger.logRequest('DELETE', url, this.getHeaders())
      const response = await this.request.delete(url, {
        headers: this.getHeaders()
      })
      this.clearRequestData()
      const actualStatus = response.status()
      this.requestLogger.logResponse(actualStatus)
      this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
    })
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

  private getHeaders() {
    if (!this.clearAuthFlag) {
      this.requestHeaders['Authorization'] = this.requestHeaders['Authorization'] || this.defaultAuthToken
    }
    return this.requestHeaders
  }

  private clearRequestData() { // this method will clear the request so the logs won't contain previous request data
    this.requestBaseUrl = undefined
    this.requestPath = ''
    this.requestParams = {}
    this.requestHeaders = {}
    this.requestBody = {}
    this.clearAuthFlag = false
  }
}