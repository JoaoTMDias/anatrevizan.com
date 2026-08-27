import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const expectNoContrastViolations = async (page: Page) => {
	const results = await new AxeBuilder({ page })
		.withRules(["color-contrast"])
		.analyze();
	expect(results.violations).toEqual([]);
};

test.describe("color theme", () => {
	test("places the theme control beside the desktop CTA and mobile menu", async ({
		page,
	}) => {
		await page.goto("/");
		const toggle = page.locator("header [data-theme-toggle]");
		await expect(toggle).toHaveCount(1);
		await expect(page.locator("footer [data-theme-toggle]")).toHaveCount(0);
		await expect(toggle).toHaveAccessibleName("Usar tema escuro");

		const booking = page
			.getByRole("link", { name: /Agendar contacto/ })
			.first();
		const desktopBookingBox = await booking.boundingBox();
		const desktopToggleBox = await toggle.boundingBox();
		expect(desktopToggleBox?.x).toBeGreaterThan(
			desktopBookingBox ? desktopBookingBox.x + desktopBookingBox.width : 0,
		);

		await page.setViewportSize({ width: 320, height: 720 });
		const menu = page.getByRole("button", { name: "Menu principal" });
		await expect(toggle).toHaveAccessibleName("Usar tema escuro");
		const mobileToggleBox = await toggle.boundingBox();
		const menuBox = await menu.boundingBox();
		expect(mobileToggleBox?.x).toBeGreaterThan(
			menuBox ? menuBox.x + menuBox.width : 0,
		);
	});

	test("follows the operating-system preference when no choice is saved", async ({
		page,
	}) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");

		await expect(page.locator("html")).toHaveClass(/dark/);
		const toggle = page.getByRole("button", { name: "Usar tema claro" });
		await expect(toggle).toHaveAttribute("aria-pressed", "true");
	});

	test("toggles by keyboard and persists an explicit choice", async ({
		page,
	}) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/");
		const toggle = page.locator("[data-theme-toggle]");
		await expect(toggle).toHaveAccessibleName("Usar tema escuro");

		await toggle.focus();
		await page.keyboard.press("Enter");
		await expect(page.locator("html")).toHaveClass(/dark/);
		await expect(toggle).toHaveAttribute("aria-pressed", "true");
		await expect(toggle).toHaveAccessibleName("Usar tema claro");
		expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
			"dark",
		);

		await page.reload();
		await expect(page.locator("html")).toHaveClass(/dark/);
		await expect(
			page.getByRole("button", { name: "Usar tema claro" }),
		).toHaveAttribute("aria-pressed", "true");
	});

	for (const theme of ["light", "dark"] as const) {
		test(`${theme} theme has no axe color-contrast violations`, async ({
			page,
		}) => {
			await page.emulateMedia({ colorScheme: theme });
			await page.goto("/");
			await expectNoContrastViolations(page);

			await page.locator("[data-theme-toggle]").hover();
			await expectNoContrastViolations(page);
		});
	}

	test("dark theme keeps editorial heroes and service pages at AA contrast", async ({
		page,
	}) => {
		await page.emulateMedia({ colorScheme: "dark" });
		for (const path of [
			"/academia",
			"/consultoria/ambiental-e-esg",
			"/contacto",
		]) {
			await page.goto(path);
			await expectNoContrastViolations(page);
		}
	});

	test("dark theme separates neutral actions, copper accents, and wine surfaces", async ({
		page,
	}) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");

		await expect(
			page.getByRole("link", { name: /Agendar contacto/ }).first(),
		).toHaveCSS("background-color", "rgb(244, 237, 225)");
		await expect(page.locator(".home-hero__actions a").first()).toHaveCSS(
			"background-color",
			"rgb(216, 160, 122)",
		);

		await page.goto("/consultoria/ambiental-e-esg");
		await expect(
			page.locator(".consulting-differentiator__credentials"),
		).toHaveCSS("background-color", "rgb(74, 21, 25)");
		await expectNoContrastViolations(page);
	});
});
