import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator } from "@playwright/test";

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

const rgbChannels = (color: string) =>
	(color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);

const effectiveColors = (locator: Locator, selector: string) =>
	locator.locator(selector).evaluate((element) => {
		const foreground = getComputedStyle(element).color;
		let current: Element | null = element;
		let background = "";

		while (current) {
			const candidate = getComputedStyle(current).backgroundColor;
			const channels = candidate.match(/[\d.]+/g)?.map(Number) ?? [];
			if (channels.length === 3 || channels[3] === 1) {
				background = candidate;
				break;
			}
			current = current.parentElement;
		}

		return { foreground, background };
	});

test.describe("home editorial gateways", () => {
	for (const theme of ["light", "dark"] as const) {
		test(`${theme} theme keeps gateway copy at AAA in every state`, async ({
			page,
		}) => {
			await page.emulateMedia({ colorScheme: theme });
			await page.goto("/");

			for (const gateway of await page.locator(".home-gateway").all()) {
				for (const state of ["normal", "hover", "focus"] as const) {
					if (state === "hover") await gateway.hover();
					if (state === "focus") await gateway.focus();

					for (const selector of [
						"h2",
						".home-gateway__eyebrow",
						".home-gateway__description",
						".home-gateway__cta",
					]) {
						const { foreground, background } = await effectiveColors(
							gateway,
							selector,
						);
						expect(
							contrastRatio(rgbChannels(foreground), rgbChannels(background)),
						).toBeGreaterThanOrEqual(7);
					}
				}
			}

			const results = await new AxeBuilder({ page })
				.include(".home-gateways-section")
				.withRules(["color-contrast"])
				.analyze();
			expect(results.violations).toEqual([]);
		});
	}

	test("exposes two keyboard-accessible destinations with a visible focus ring", async ({
		page,
	}) => {
		await page.goto("/");
		const consulting = page.getByRole("link", {
			name: /Consultoria.*Ver áreas de atuação/,
		});
		const academic = page.getByRole("link", {
			name: /Academia.*Explorar Academia/,
		});
		await expect(consulting).toHaveAttribute("href", "/consultoria");
		await expect(academic).toHaveAttribute("href", "/academia");

		await page.locator(".home-hero__actions a").last().focus();
		await page.keyboard.press("Tab");
		await expect(consulting).toBeFocused();
		await expect(consulting).toHaveCSS("outline-color", "rgb(255, 255, 255)");
		await expect(consulting).toHaveCSS("outline-width", "3px");
		await page.keyboard.press("Tab");
		await expect(academic).toBeFocused();
	});

	test("stacks at 320px without clipping or horizontal overflow", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 320, height: 900 });
		await page.goto("/");
		const gateways = page.locator(".home-gateway");
		await expect(gateways).toHaveCount(2);
		const consulting = gateways.nth(0);
		const academic = gateways.nth(1);
		const firstBox = await consulting.boundingBox();
		const secondBox = await academic.boundingBox();

		expect(secondBox?.y).toBeGreaterThan(
			(firstBox?.y ?? 0) + (firstBox?.height ?? 0) - 1,
		);
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= window.innerWidth,
			),
		).toBe(true);
	});

	test("removes gateway motion when reduced motion is requested", async ({
		page,
	}) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/");
		for (const locator of [
			page.locator(".home-gateway").first(),
			page.locator(".home-gateway__cta svg").first(),
		]) {
			const duration = await locator.evaluate((element) =>
				Number.parseFloat(getComputedStyle(element).transitionDuration),
			);
			expect(duration).toBeLessThanOrEqual(0.00001);
		}
	});
});
