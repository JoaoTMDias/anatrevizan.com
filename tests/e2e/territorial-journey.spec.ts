import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routeMap } from "../../src/lib/routing";
import { installFakeTurnstile } from "./site";

test.beforeEach(async ({ page }) => installFakeTurnstile(page));
for (const locale of ["pt-PT", "en"] as const) {
	for (const route of ["immigration-mobility"] as const) {
		test(`${locale} ${route}: explicit keyboard choice controls the complete scope`, async ({
			page,
		}) => {
			await page.goto(routeMap[route][locale]);
			const radios = page.locator("country-choice input[type=radio]");
			await expect(radios.locator(":checked")).toHaveCount(0);
			await expect(page.locator("#scope-pt")).toBeHidden();
			await expect(page.locator("#scope-br")).toBeHidden();
			await radios.first().focus();
			await page.keyboard.press("Space");
			await expect(radios.first()).toBeChecked();
			await expect(page.locator("#scope-pt")).toBeVisible();
			await expect(page.locator("#scope-br")).toBeHidden();
			await expect(page.locator("#scope-pt")).toContainText(
				locale === "en" ? "representation" : "representação",
			);
			const results = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
				.analyze();
			expect(results.violations).toEqual([]);
			await page.keyboard.press("ArrowRight");
			await expect(radios.last()).toBeChecked();
			await expect(page.locator("#scope-br")).toBeVisible();
			await expect(page.locator("#scope-pt")).toBeHidden();
			await expect(page.locator("#scope-br")).toContainText("330.386");
			await expect(page.locator("#scope-br a")).toHaveAttribute(
				"href",
				`${routeMap.contact[locale]}?scope=BR_LEGAL`,
			);
			await page.reload();
			await expect(page.locator("country-choice input:checked")).toHaveCount(0);
			await expect(page.locator("#scope-br")).toBeHidden();
		});
	}
}

test("direct contact has no professional scope inferred from language or geography", async ({
	page,
}) => {
	await page.goto("/contacto");
	await expect(page.locator('input[name="scope"]')).toHaveValue("");
	await expect(
		page.locator('select[name="requestType"] option:checked'),
	).toHaveValue("");
});
