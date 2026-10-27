import { test, expect } from "@playwright/test"

test("developer opens the home page and sees the heading and a counter at 0", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Wave Merge Test" })).toBeVisible()
  await expect(page.locator("#counter")).toHaveText("0")
})

test("developer clicks Increment once and sees 1", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("#counter")).toHaveText("0")
  await page.getByRole("button", { name: "Increment" }).click()
  await expect(page.locator("#counter")).toHaveText("1")
})

test("developer clicks Increment three times and sees 3", async ({ page }) => {
  await page.goto("/")
  const increment = page.getByRole("button", { name: "Increment" })
  await increment.click()
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

test("the counter stays in the open page without storage or server calls", async ({ page }) => {
  const requests: string[] = []
  page.on("request", (request) => requests.push(request.url()))
  await page.goto("/")
  requests.length = 0
  await page.getByRole("button", { name: "Increment" }).click()
  await expect(page.locator("#counter")).toHaveText("1")
  const storage = await page.evaluate(() => ({
    local: localStorage.length,
    session: sessionStorage.length,
    cookie: document.cookie,
  }))
  expect(storage).toEqual({ local: 0, session: 0, cookie: "" })
  expect(requests).toEqual([])
})
