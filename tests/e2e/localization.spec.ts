import { expect, test } from "@playwright/test";
import { publishedRoutes } from "./editorial-routes";

test.describe("localization metadata", () => {
	for (const { locale, path } of publishedRoutes) {
		test(`${locale} ${path || "/"} keeps metadata coherent`, async ({ page }) => {
			await page.goto(path);
			await expect(page.locator("html")).toHaveAttribute("lang", locale);
			await expect(page).toHaveTitle(/.+/);
			await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
		});
	}
});
