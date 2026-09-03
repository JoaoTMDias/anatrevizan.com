import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
	test("switches channels without losing shared fields and validates accessibly", async ({
		page,
	}) => {
		await page.goto("/contacto");
		const form = page.locator(".contact-form");
		await form.getByLabel("Nome").fill("Maria Silva");
		await form.getByLabel("Enviar pelo WhatsApp").check();

		await expect(form.getByLabel("Nome")).toHaveValue("Maria Silva");
		await expect(form.getByLabel("E-mail")).toHaveCount(0);
		await expect(form.getByLabel("WhatsApp (opcional)")).toHaveCount(0);
		const submit = form.getByRole("button", { name: "Continuar no WhatsApp" });
		await expect(submit).toBeDisabled();
		await form.getByLabel("Tipo de pedido").selectOption({ index: 1 });
		await form.getByLabel("País onde está").selectOption({ index: 1 });
		await form
			.getByLabel("Mensagem")
			.fill("Gostaria de explicar este pedido com mais detalhe.");
		await expect(submit).toBeDisabled();
		await form.getByLabel(/Li e aceito/).check();
		await expect(submit).toBeEnabled();

		const results = await new AxeBuilder({ page })
			.include(".contact-form")
			.analyze();
		expect(results.violations).toEqual([]);
	});

	test("localizes fields and optional labels in English", async ({ page }) => {
		await page.goto("/en/contact");
		const form = page.locator(".contact-form");
		await expect(form.getByLabel("Email")).toBeVisible();
		await expect(form.getByLabel("WhatsApp (optional)")).toBeVisible();
		await form.getByLabel("Send through WhatsApp").check();
		await expect(
			form.getByRole("button", { name: "Continue to WhatsApp" }),
		).toBeVisible();
	});
});
