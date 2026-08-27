import { expect, test } from "@playwright/test";

const heroPath = "/consultoria/juridica";

test.describe("editorial hero media", () => {
	for (const width of [320, 1023]) {
		test(`stacks the side image after the copy at ${width}px`, async ({
			page,
		}) => {
			await page.setViewportSize({ width, height: 1000 });
			await page.goto(heroPath);
			const copy = await page.locator(".editorial-hero__copy").boundingBox();
			const image = await page
				.locator(".editorial-hero__foreground")
				.boundingBox();
			expect(image?.y).toBeGreaterThan((copy?.y ?? 0) + (copy?.height ?? 0));
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= window.innerWidth,
				),
			).toBe(true);
		});
	}

	for (const width of [1024, 1440]) {
		test(`uses text and image columns at ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 1000 });
			await page.goto(heroPath);
			const copy = await page.locator(".editorial-hero__copy").boundingBox();
			const image = await page
				.locator(".editorial-hero__foreground")
				.boundingBox();
			expect(image?.x).toBeGreaterThan((copy?.x ?? 0) + (copy?.width ?? 0));
			expect(image?.width).toBeCloseTo(image?.height ?? 0, 0);
		});
	}

	test("keeps the eyebrow compact", async ({ page }) => {
		await page.goto(heroPath);
		const badge = page.locator(".editorial-eyebrow");
		const copy = page.locator(".editorial-hero__copy");
		expect((await badge.boundingBox())?.width).toBeLessThan(
			(await copy.boundingBox())?.width ?? 0,
		);
	});

	test("allows 200% text scaling without clipping or horizontal overflow", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 640, height: 1000 });
		await page.goto("/consultoria/ambiental-e-esg");
		await page.locator("html").evaluate((element) => {
			element.style.fontSize = "200%";
		});

		const hero = page.locator(".editorial-hero");
		const heroBox = await hero.boundingBox();
		const innerBox = await hero.locator(".editorial-hero__inner").boundingBox();
		expect((innerBox?.y ?? 0) + (innerBox?.height ?? 0)).toBeLessThanOrEqual(
			(heroBox?.y ?? 0) + (heroBox?.height ?? 0) + 1,
		);
		expect(
			await hero.evaluate(
				(element) => element.scrollWidth <= element.clientWidth,
			),
		).toBe(true);
	});

	test("disables the scroll animation when reduced motion is requested", async ({
		page,
	}) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto(heroPath);
		await expect(page.locator(".editorial-hero__foreground img")).toHaveCSS(
			"animation-name",
			"none",
		);
	});
});
