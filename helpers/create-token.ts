import { RequestHandler } from "../utils/request-handler"
import { APILogger } from "../utils/logger"
import { config } from "../api-test.config"
import { request } from "@playwright/test"

// export async function createToken(api: RequestHandler, email: string, password: string) {
//   const response = await api
//     .path('/users/login')
//     .body({ "user": { "email": email, "password": password } })
//     .postRequest(200)
//   return `Token ${response.user.token}`
// }

export async function createToken(email: string, password: string) {
  const context = await request.newContext()
  const logger = new APILogger()
  const api = new RequestHandler(context, config.apiUrl, logger)
  try {
    const response = await api
      .path('/users/login')
      .body({ "user": { "email": email, "password": password } })
      .postRequest(200)
    return `Token ${response.user.token}`
  } catch (error) {
    if (error instanceof Object) {
      Error.captureStackTrace(error, createToken)
    }
    throw error
  } finally {
    context.dispose()
  }
}