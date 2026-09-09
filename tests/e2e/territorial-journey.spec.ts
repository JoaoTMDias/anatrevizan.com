import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routeMap } from "../../src/lib/routing";
import { installFakeTurnstile } from "./site";

test.beforeEach(async ({ page }) => installFakeTurnstile(page));
for (const locale of ["pt-PT", "en"] as const) {
	for (const route of ["immigration-mobility", "legal-opinions"] as const) {
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
	test(`${locale}: Portuguese support CTA carries explicit scope and changes clear incompatible requests`, async ({
		page,
	}) => {
		await page.goto(routeMap["portugal-support"][locale]);
		await page.locator(".practice-section a").click();
		const form = page.getByRole("form");
		const scope = form.locator("select[name=scope]");
		const requestType = form.locator("select[name=requestType]");
		await expect(scope).toHaveValue("PT_ADMIN");
		await expect(requestType.locator("option[value=brazil-law]")).toHaveCount(
			0,
		);
		await requestType.selectOption("portugal-administrative");
		await scope.selectOption("BR_LEGAL");
		await expect(requestType).toHaveValue("");
		await expect(
			requestType.locator("option[value=portugal-administrative]"),
		).toHaveCount(0);
		await requestType.selectOption("brazil-law");
		await form.locator("select[name=country]").selectOption("PT");
		await expect(scope).toHaveValue("BR_LEGAL");
	});
}

test("direct contact has no professional scope inferred from language or geography", async ({
	page,
}) => {
	await page.goto("/contacto");
	await expect(page.locator("select[name=scope]")).toHaveValue("");
	await expect(page.locator("select[name=requestType] option")).toHaveCount(1);
});
