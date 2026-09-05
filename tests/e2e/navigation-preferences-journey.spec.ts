import { expect, type Page, test } from "@playwright/test";
import { installFakeTurnstile } from "./site";

async function tabToHref(page: Page, href: string) {
	for (let index = 0; index < 40; index += 1) {
		await page.keyboard.press("Tab");
		const activeHref = await page.evaluate(() =>
			document.activeElement instanceof HTMLAnchorElement
				? document.activeElement.getAttribute("href")
				: null,
		);
		if (activeHref === href) return;
	}
	throw new Error(`Keyboard could not reach ${href}`);
}

test.describe("visitor navigates and keeps accessibility preferences", () => {
	test.beforeEach(async ({ page }) => installFakeTurnstile(page));

	test("mobile menu closes with Escape, restores focus and locks scroll", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 320, height: 900 });
		await page.goto("/");
		const menu = page.getByRole("button", { name: "Menu principal" });
		await menu.press("Enter");
		await expect(page.getByRole("dialog")).toBeVisible();
		await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
		await page.keyboard.press("Escape");
		await expect(page.getByRole("dialog")).toBeHidden();
		await expect(menu).toBeFocused();
		await menu.press("Enter");
		await page.getByRole("button", { name: "Fechar menu" }).press("Enter");
		await expect(page.getByRole("dialog")).toBeHidden();
		await expect(menu).toBeFocused();
		await menu.press("Enter");
		await page.mouse.click(10, 450);
		await expect(page.getByRole("dialog")).toBeHidden();
		await expect(menu).toBeFocused();
	});

	test("language switch keeps known fragments and removes transient queries", async ({
		page,
	}) => {
		await page.goto("/contacto?status=sent#agendar");
		await page.getByRole("link", { name: "Switch to English" }).press("Enter");
		await expect(page).toHaveURL(/\/en\/contact#book$/);
		await page.goto("/sobre?status=sent#sem-equivalente");
		await page.getByRole("link", { name: "Switch to English" }).press("Enter");
		await expect(page).toHaveURL(/\/en\/about$/);
	});

	test("theme follows the system and still toggles when storage fails", async ({
		browser,
	}) => {
		const context = await browser.newContext({ colorScheme: "dark" });
		const page = await context.newPage();
		await page.addInitScript(() => {
			Storage.prototype.getItem = () => {
				throw new DOMException("blocked");
			};
			Storage.prototype.setItem = () => {
				throw new DOMException("blocked");
			};
		});
		await page.goto("/");
		await expect(page.locator("html")).toHaveClass(/dark/);
		await page.getByRole("button", { name: "Usar tema claro" }).press("Enter");
		await expect(page.locator("html")).not.toHaveClass(/dark/);
		await context.close();
	});

	test("theme preference synchronizes between tabs", async ({ context }) => {
		const first = await context.newPage();
		const second = await context.newPage();
		await first.goto("/");
		await second.goto("/");
		await first
			.getByRole("button", { name: "Usar tema escuro" })
			.press("Enter");
		await expect(second.locator("html")).toHaveClass(/dark/);
	});

	test("keyboard journey reaches a service and contact", async ({ page }) => {
		await page.goto("/");
		await tabToHref(page, "/consultoria/juridica");
		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/\/consultoria\/juridica$/);
		await tabToHref(page, "/contacto");
		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/\/contacto$/);
		const name = page
			.getByRole("form", { name: "Pedido de contacto" })
			.getByLabel("Nome");
		await name.focus();
		await page.keyboard.type("Pessoa Teclado");
		await expect(name).toHaveValue("Pessoa Teclado");
	});
});
