import { expect, test } from "@playwright/test";
import { routeMap } from "../../src/lib/routing";

test.describe("localization metadata", () => {
	for (const [routeKey, localized] of Object.entries(routeMap)) {
		test(`${routeKey} keeps localized metadata coherent`, async ({ page }) => {
			for (const [locale, path] of Object.entries(localized)) {
				await page.goto(path);
				await expect(page.locator("html")).toHaveAttribute("lang", locale);
				await expect(page).toHaveTitle(/.+/);
				await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
					"content",
					"noindex,nofollow",
				);
			}
		});
	}
});
