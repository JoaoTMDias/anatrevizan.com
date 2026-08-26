import { expect, test, type Locator } from "@playwright/test";
import { routeMap } from "../../src/lib/routing";

const relativeLuminance = ([red, green, blue]: number[]) => {
	const channels = [red, green, blue].map((value) => {
		const channel = value / 255;
		return channel <= 0.04045
			? channel / 12.92
			: ((channel + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const rgb = (value: string) =>
	(value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);

const contrast = async (locator: Locator) => {
	const colors = await locator.evaluate((element) => {
		const style = getComputedStyle(element);
		return { background: style.backgroundColor, foreground: style.color };
	});
	const light = Math.max(
		relativeLuminance(rgb(colors.background)),
		relativeLuminance(rgb(colors.foreground)),
	);
	const dark = Math.min(
		relativeLuminance(rgb(colors.background)),
		relativeLuminance(rgb(colors.foreground)),
	);
	return (light + 0.05) / (dark + 0.05);
};

test.describe("accessibility and responsive behavior", () => {
	test("primary CTAs keep 6:1 contrast and 44px targets across interaction states", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto("/");
		const heroCta = page.locator(".home-hero__actions a").first();
		const headerCta = page
			.getByRole("link", { name: "Agendar primeiro contacto" })
			.first();

		for (const control of [heroCta, headerCta]) {
			const box = await control.boundingBox();
			expect(box?.height).toBeGreaterThanOrEqual(44);
			await expect(control).toHaveCSS("font-size", "16px");
			expect(await contrast(control)).toBeGreaterThanOrEqual(6);
			await control.hover();
			expect(await contrast(control)).toBeGreaterThanOrEqual(6);
			await control.focus();
			expect(await contrast(control)).toBeGreaterThanOrEqual(6);
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
			for (const localized of Object.values(routeMap)) {
				for (const path of Object.values(localized)) {
					await page.goto(path);
					expect(
						await page.evaluate(
							() => document.documentElement.scrollWidth <= window.innerWidth,
						),
					).toBe(true);
				}
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
