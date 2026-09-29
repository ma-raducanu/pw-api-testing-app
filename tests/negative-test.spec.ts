import { test } from '../utils/fixtures'
import { expect } from '../utils/custom-assertions'

[
  {
    username: 'aa', usernameErrorMessage: 'is too short (minimum is 3 characters)'
  },
  {
    username: 'aaa', usernameErrorMessage: ''
  },
  {
    username: 'aaaaaaaaaaaaaaaaaaaa', usernameErrorMessage: ''
  },
  {
    username: 'aaaaaaaaaaaaaaaaaaaaa', usernameErrorMessage: 'is too long (maximum is 20 characters)'
  },
].forEach(({ username, usernameErrorMessage }) => {
  test(`Error message validation for ${username}`, async ({ api }) => {
    const newUserResponse = await api
      .path('/users')
      .body({
        "user": {
          "email": "a",
          "password": "a",
          "username": username
        }
      })
      .clearAuth()
      .postRequest(422)
    if (username.length == 3 || username.length == 20) {
      expect(newUserResponse.errors).not.toHaveProperty('username')
    } else {
      expect(newUserResponse.errors.username[0]).shouldEqual(usernameErrorMessage)
    }
  })
})