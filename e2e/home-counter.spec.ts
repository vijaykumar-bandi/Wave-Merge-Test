import { test, expect } from "@playwright/test"

test("developer opens the home page and sees the heading and a counter at 0", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Wave Merge Test" })).toBeVisible()
  await expect(page.locator("#counter")).toHaveText("0")
  await expect(page.getByRole("button", { name: "Increment" })).toBeVisible()
})

test("developer clicks Increment three times and sees 3", async ({ page }) => {
  await page.goto("/")
  const increment = page.getByRole("button", { name: "Increment" })
  await increment.click()
  await expect(page.locator("#counter")).toHaveText("1")
  await increment.click()
  await increment.click()
  await expect(page.locator("#counter")).toHaveText("3")
})

test("developer refreshes the page and the counter is back to 0", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Increment" }).click()
  await expect(page.locator("#counter")).toHaveText("1")
  await page.reload()
  await expect(page.locator("#counter")).toHaveText("0")
})

test("developer increases the counter with the keyboard alone", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("#counter")).toHaveText("0")
  await page.keyboard.press("=")
  await expect(page.locator("#counter")).toHaveText("1")
})
