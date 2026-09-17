import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { installFakeTurnstile, publishedPaths } from "./site";

const templatePaths = [
	"/",
	"/sobre",
	"/atuacao/advocacia-brasil",
	"/academia/publicacoes",
	"/academia/eventos",
	"/contacto",
	"/politica-de-privacidade",
	"/declaracao-de-acessibilidade",
];

const axeBatchCount = 2;

async function expectNoViolations(page: Page) {
	const results = await new AxeBuilder({ page })
		.withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
		.analyze();
	expect(results.violations).toEqual([]);
}

test.describe("visitor uses accessibility preferences", () => {
	test.beforeEach(async ({ page }) => installFakeTurnstile(page));
	for (const colorScheme of ["light", "dark"] as const) {
		for (let batchIndex = 0; batchIndex < axeBatchCount; batchIndex += 1) {
			test(`pages have no a11y violations: ${colorScheme} mode (batch ${batchIndex + 1})`, async ({
				page,
				request,
			}) => {
				test.setTimeout(60_000);
				await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });

				const paths = await publishedPaths(request);
				const batchSize = Math.ceil(paths.length / axeBatchCount);
				const batchPaths = paths.slice(
					batchIndex * batchSize,
					(batchIndex + 1) * batchSize,
				);

				for (const path of batchPaths) {
					await page.goto(path);
					await expectNoViolations(page);
				}
			});
		}
	}

	test("all routes reflow at 320px, equivalent to 400% zoom at 1280px", async ({
		page,
		request,
	}) => {
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
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/atuacao/esg-politicas-publicas-sustentabilidade");
		const acronym = page.locator("[data-acronym-trigger]").first();
		await acronym.focus();
		const tooltip = page.getByRole("tooltip").first();
		await expect(tooltip).toBeVisible();
		await expectNoViolations(page);
		await page.keyboard.press("Escape");
		await expect(tooltip).toBeHidden();
	});

	test("portraits and milestones remain readable while scrolling", async ({
		page,
	}) => {
		for (const reducedMotion of ["no-preference", "reduce"] as const) {
			await page.emulateMedia({ reducedMotion });
			for (const [path, selector] of [
				["/", ".home-hero__foreground"],
				["/sobre", ".about-timeline__item"],
			]) {
				await page.goto(path);
				const content = page.locator(selector).first();
				await content.evaluate((element) => {
					const box = element.getBoundingClientRect();
					window.scrollTo(0, window.scrollY + box.top + box.height * 0.65);
				});
				await expect(content).toHaveCSS("opacity", "1");
				await expect(content).toHaveCSS("filter", "none");
			}
		}
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
