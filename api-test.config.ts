const processEnv = process.env.TEST_ENV
const env = processEnv || 'dev'
const config = {
  apiUrl: 'https://conduit-api.bondaracademy.com/api',
  userEmail: 'mircea.alexandru.vi.raducanu@gmail.com',
  userPassword: 'Testing123!'
}

if(env === 'qa') {
  config.userEmail = 'qa-mircea.alexandru.vi.raducanu@gmail.com'
  config.userPassword = 'Testing123!'
}
if (env === 'dev') {
  config.userEmail = 'mircea.alexandru.vi.raducanu@gmail.com'
  config.userPassword = 'Testing123!'
}

export { config }