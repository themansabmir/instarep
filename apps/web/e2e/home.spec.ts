import { expect, test } from "@playwright/test";

test("home page renders hero and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /turn customer feedback/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /pricing/i }).first()).toBeVisible();
});
