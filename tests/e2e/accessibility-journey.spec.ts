import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { installFakeTurnstile, publishedPaths } from "./site";

const templatePaths = [
	"/",
	"/sobre",
	"/consultoria/juridica",
	"/academia/publicacoes",
	"/academia/eventos",
	"/contacto",
	"/politica-de-privacidade",
	"/declaracao-de-acessibilidade",
];

async function expectNoViolations(page: Page) {
	// Cross-origin widgets (Turnstile) are third-party boundaries and can never be
	// audited reliably by our CI. Legacy mode audits the complete same-origin DOM
	// without waiting for those frames to answer axe's frame messenger.
	const results = await new AxeBuilder({ page })
		.withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
		// axe-core 4.13 loops indefinitely while resolving this project's OKLCH
		// color-mix tokens in Chromium. Keep contrast in the release checklist
		// until upstream can complete the rule deterministically.
		.disableRules(["color-contrast"])
		.analyze();
	expect(results.violations).toEqual([]);
}

test.describe("visitor uses accessibility preferences", () => {
	test.beforeEach(async ({ page }) => installFakeTurnstile(page));
	test("every published page passes axe in light mode", async ({
		page,
		request,
	}) => {
		await page.emulateMedia({ colorScheme: "light" });
		for (const path of await publishedPaths(request)) {
			await page.goto(path);
			await expectNoViolations(page);
		}
	});

	test("every template passes axe in dark mode", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "dark" });
		for (const path of templatePaths) {
			await page.goto(path);
			await expectNoViolations(page);
		}
	});

	test("all routes reflow at 320px, equivalent to 400% zoom at 1280px", async ({ page, request }) => {
		await page.setViewportSize({ width: 320, height: 900 });
		for (const path of await publishedPaths(request)) {
			await page.goto(path);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= window.innerWidth,
				),
				path,
			).toBe(true);
		}
	});

	test("representative templates reflow on tablet and desktop", async ({
		page,
	}) => {
		for (const width of [768, 1440]) {
			await page.setViewportSize({ width, height: 1000 });
			for (const path of templatePaths) {
				await page.goto(path);
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= window.innerWidth,
					),
					`${width}: ${path}`,
				).toBe(true);
			}
		}
	});

	test("acronym tooltip opens with focus and closes with Escape", async ({
		page,
	}) => {
		await page.goto("/consultoria/ambiental-e-esg");
		const acronym = page.locator("[data-acronym-trigger]").first();
		await acronym.focus();
		const tooltip = page.getByRole("tooltip").first();
		await expect(tooltip).toBeVisible();
		await expectNoViolations(page);
		await page.keyboard.press("Escape");
		await expect(tooltip).toBeHidden();
	});

	test("content remains useful without JavaScript", async ({ browser }) => {
		const context = await browser.newContext({ javaScriptEnabled: false });
		const page = await context.newPage();
		for (const path of templatePaths) {
			await page.goto(path);
			await expect(page.getByRole("main")).toBeVisible();
			await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		}
		await context.close();
	});
});
