import { expect, test } from "@playwright/test";

test.describe("site navigation", () => {
	test("desktop menus support keyboard interaction and restore focus", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto("/sobre");

		for (const label of ["Consultoria", "Academia"]) {
			const trigger = page.getByRole("button", { name: label, exact: true });
			await trigger.focus();
			await page.keyboard.press("Enter");
			await expect(trigger).toHaveAttribute("aria-expanded", "true");
			await expect(
				page.locator(".nav-dropdown:visible a").first(),
			).toBeVisible();
			await page.keyboard.press("Escape");
			await expect(trigger).toHaveAttribute("aria-expanded", "false");
			await expect(trigger).toBeFocused();
		}
	});

	test("mobile menu behaves as a modal keyboard surface", async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 800 });
		await page.goto("/sobre");
		const trigger = page.locator('button[aria-label="Menu principal"]');
		await trigger.click();
		await expect(trigger).toHaveAttribute("aria-expanded", "true");

		const dialog = page.getByRole("dialog", { name: "Menu principal" });
		await expect(dialog).toBeVisible();
		await expect(
			dialog.getByRole("link", { name: /Agendar (?:primeiro )?contacto/ }),
		).toHaveAttribute("href", "/agendar");

		await page.keyboard.press("Escape");
		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await expect(trigger).toBeFocused();
	});

	test("skip link and configured footer destinations are keyboard accessible", async ({
		page,
	}) => {
		await page.goto("/sobre");
		await page.keyboard.press("Tab");
		const skipLink = page.getByRole("link", { name: "Saltar para o conteúdo" });
		await expect(skipLink).toBeFocused();
		await skipLink.press("Enter");
		await expect(page.locator("#main-content")).toBeFocused();
		await expect(page.locator('footer a[href^="mailto:"]')).toHaveCount(1);
		await expect(page.locator('footer a[href^="https://wa.me/"]')).toHaveCount(
			1,
		);
		for (const profile of ["LinkedIn", "Instagram", "ORCID"])
			await expect(
				page
					.locator("footer")
					.getByRole("link", { name: profile, exact: true }),
			).toBeVisible();
	});
});
