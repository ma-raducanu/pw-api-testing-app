import { test, expect, request } from '@playwright/test'

test('Create article', async ({ page }) => {
  await page.goto('/')
  await page.getByText('Sign in').click()
  await page.getByPlaceholder('Email').fill(process.env.PROD_USERNAME!)
  await page.getByPlaceholder('Password').fill(process.env.PROD_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()
})