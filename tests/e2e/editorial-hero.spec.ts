import { expect, test } from "@playwright/test";

const heroPath = "/consultoria/juridica";

const relativeLuminance = ([red, green, blue]: number[]) => {
	const channels = [red, green, blue].map((value) => {
		const channel = value / 255;
		return channel <= 0.04045
			? channel / 12.92
			: ((channel + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrastRatio = (foreground: number[], background: number[]) => {
	const lighter = Math.max(
		relativeLuminance(foreground),
		relativeLuminance(background),
	);
	const darker = Math.min(
		relativeLuminance(foreground),
		relativeLuminance(background),
	);
	return (lighter + 0.05) / (darker + 0.05);
};

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

	test("keeps white hero copy above a contrast-safe decorative overlay", async ({
		page,
	}) => {
		await page.goto("/consultoria/ambiental-e-esg");
		const hero = page.locator(".editorial-hero--media");
		const overlay = hero.locator(":scope > .editorial-hero__overlay");
		const inner = hero.locator(":scope > .editorial-hero__inner");

		await expect(overlay).toHaveCSS("position", "absolute");
		await expect(inner).toHaveCSS("position", "relative");

		const overlayColor = await overlay.evaluate(
			(element) => getComputedStyle(element).backgroundColor,
		);
		const [red, green, blue, alpha] = (overlayColor.match(/[\d.]+/g) ?? []).map(
			Number,
		);
		const worstCaseBackground = [red, green, blue].map(
			(channel) => channel * alpha + 255 * (1 - alpha),
		);
		expect(
			contrastRatio([255, 255, 255], worstCaseBackground),
		).toBeGreaterThanOrEqual(4.5);

		for (const selector of [
			"h1",
			".editorial-hero__subtitle",
			".editorial-breadcrumbs",
		]) {
			await expect(hero.locator(selector)).toHaveCSS(
				"color",
				"rgb(255, 255, 255)",
			);
		}
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
