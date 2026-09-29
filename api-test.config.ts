import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '.env') })

const processEnv = process.env.TEST_ENV
const env = processEnv || 'prod'
const config = {
  apiUrl: 'https://conduit-api.bondaracademy.com/api',
  userEmail: 'mircea.alexandru.vi.raducanu@gmail.com',
  userPassword: 'Testing123!'
}

if (env === 'qa') {
  config.userEmail = 'qa-mircea.alexandru.vi.raducanu@gmail.com'
  config.userPassword = 'Testing123!'
}
if (env === 'prod') {
  // if(!process.env.PROD_USERNAME || !process.env.PROD_PASSWORD) {
  //   throw Error('Missing required env variables')
  // }
  config.userEmail = process.env.PROD_USERNAME as string
  config.userPassword = process.env.PROD_PASSWORD as string
}

export { config }