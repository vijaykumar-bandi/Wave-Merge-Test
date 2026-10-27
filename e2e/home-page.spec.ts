import { test, expect } from "@playwright/test"

test("visitor opens the home page and sees the Wave Merge Test heading", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Wave Merge Test" })).toBeVisible()
})
