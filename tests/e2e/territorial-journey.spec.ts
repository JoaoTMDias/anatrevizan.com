import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routeMap } from "../../src/lib/routing";
import { installFakeTurnstile } from "./site";

test.beforeEach(async ({ page }) => installFakeTurnstile(page));
for (const locale of ["pt-PT", "en"] as const) {
	test(`${locale} immigration-mobility: published page exposes the correct contact path`, async ({
		page,
	}) => {
		await page.goto(routeMap["immigration-mobility"][locale]);
		await expect(page.locator("h1")).toBeVisible();
		await expect(
			page
				.getByRole("link", { name: /Agendar contacto|Book an initial call/ })
				.first(),
		).toBeVisible();
		const results = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
			.analyze();
		expect(results.violations).toEqual([]);
	});
}

test("direct contact has no professional scope inferred from language or geography", async ({
	page,
}) => {
	await page.goto("/contacto");
	await expect(page.locator('input[name="scope"]')).toHaveValue("");
	await expect(page.locator('select[name="requestType"]')).toHaveValue("");
});
