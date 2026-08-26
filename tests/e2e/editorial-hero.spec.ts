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

	test("supports the editor-selectable 4:3 crop", async ({ page }) => {
		await page.goto(heroPath);
		const image = page.locator(".editorial-hero__foreground");
		await image.evaluate((element) => {
			element.classList.remove("editorial-hero__foreground--square");
			element.classList.add("editorial-hero__foreground--landscape");
		});
		const box = await image.boundingBox();
		expect((box?.width ?? 0) / (box?.height ?? 1)).toBeCloseTo(4 / 3, 1);
	});

	test("keeps the eyebrow compact and the placeholder decorative", async ({
		page,
	}) => {
		await page.goto(heroPath);
		const badge = page.locator(".editorial-eyebrow");
		const copy = page.locator(".editorial-hero__copy");
		expect((await badge.boundingBox())?.width).toBeLessThan(
			(await copy.boundingBox())?.width ?? 0,
		);
		await expect(
			page.locator(".editorial-hero__foreground img"),
		).toHaveAttribute("alt", "");
	});

	test("uses the CMS background and focal point", async ({ page }) => {
		await page.goto("/consultoria");
		await expect(page.locator(".editorial-hero")).toHaveCSS(
			"background-position",
			/50% 0%/,
		);
	});

	test("scales the image on the hero exit scroll timeline", async ({
		page,
	}) => {
		await page.emulateMedia({ reducedMotion: "no-preference" });
		await page.goto(heroPath);
		await expect(page.locator(".editorial-hero__foreground img")).toHaveCSS(
			"animation-name",
			"editorial-hero-foreground-exit",
		);
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
