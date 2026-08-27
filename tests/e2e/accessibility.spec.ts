import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publishedRoutes } from "./editorial-routes";

test.describe("accessibility and responsive behavior", () => {
	test("ready editorial pages do not display the draft notice", async ({
		page,
	}) => {
		await page.goto("/consultoria/migracao-e-mobilidade");
		await expect(page.getByRole("status")).toHaveCount(0);
	});

	test("primary CTAs keep axe-compliant contrast and 44px targets across interaction states", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto("/");
		const heroCta = page.locator(".home-hero__actions a").first();
		const headerCta = page
			.getByRole("link", { name: /Agendar (?:primeiro )?contacto/ })
			.first();

		for (const control of [heroCta, headerCta]) {
			const box = await control.boundingBox();
			expect(box?.height).toBeGreaterThanOrEqual(44);
			await expect(control).toHaveCSS("font-size", "16px");
			let results = await new AxeBuilder({ page })
				.withRules(["color-contrast"])
				.analyze();
			expect(results.violations).toEqual([]);
			await control.hover();
			results = await new AxeBuilder({ page })
				.withRules(["color-contrast"])
				.analyze();
			expect(results.violations).toEqual([]);
			await control.focus();
			results = await new AxeBuilder({ page })
				.withRules(["color-contrast"])
				.analyze();
			expect(results.violations).toEqual([]);
		}
	});

	test("icon controls expose circular 44px targets", async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 800 });
		await page.goto("/");
		const menu = page.getByRole("button", { name: "Menu principal" });
		const box = await menu.boundingBox();
		expect(box?.width).toBeGreaterThanOrEqual(44);
		expect(box?.height).toBeGreaterThanOrEqual(44);
	});

	for (const width of [320, 1280]) {
		test(`all routes avoid horizontal overflow at ${width}px`, async ({
			page,
		}) => {
			await page.setViewportSize({ width, height: 900 });
			for (const { path } of publishedRoutes) {
				await page.goto(path);
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= window.innerWidth,
					),
				).toBe(true);
			}
		});
	}

	test("reduced motion disables non-essential transitions", async ({
		page,
	}) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/");
		const duration = await page
			.locator("a")
			.first()
			.evaluate((element) => getComputedStyle(element).transitionDuration);
		expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001);
	});
});
