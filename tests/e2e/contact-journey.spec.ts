import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { installFakeTurnstile } from "./site";

const persona = {
	name: "Maria Exemplo",
	email: "maria@example.com",
	whatsapp: "+351 910 000 000",
	message: "Pretendo esclarecer uma questão jurídica numa primeira conversa.",
};

async function fillPortugueseForm(page: import("@playwright/test").Page) {
	const form = page.getByRole("form", { name: "Pedido de contacto" });
	await form.getByLabel("Nome").fill(persona.name);
	await form.getByLabel("E-mail").fill(persona.email);
	await form.getByLabel("WhatsApp (opcional)").fill(persona.whatsapp);
	await form.getByLabel("Tipo de pedido").selectOption("request-1");
	await form.getByLabel("País onde está").selectOption("PT");
	await form.getByRole("textbox", { name: "Mensagem", exact: true }).fill(persona.message);
	return form;
}

test.describe("potential client sends a contact request", () => {
	test.beforeEach(async ({ page }) => installFakeTurnstile(page));

	test("invalid submit exposes a summary and inline errors", async ({
		page,
	}) => {
		await page.goto("/contacto");
		const form = page.getByRole("form", { name: "Pedido de contacto" });
		await form.getByRole("button", { name: "Enviar pedido" }).press("Enter");
		const summary = form
			.getByRole("alert")
			.filter({ hasText: "Corrija os campos" });
		await expect(summary).toBeFocused();
		await expect(form.getByLabel("Nome")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
		const results = await new AxeBuilder({ page })
			.include("form")
			.withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
			.disableRules(["color-contrast"])
			.analyze();
		expect(results.violations).toEqual([]);
	});

	test("successful email submission uses the versioned contract and one-time confirmation", async ({
		page,
	}) => {
		let payload: Record<string, unknown> = {};
		await page.route("**/api/contact", async (route) => {
			payload = route.request().postDataJSON();
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					version: 1,
					ok: true,
					code: "accepted",
					requestId: payload.requestId,
				}),
			});
		});
		await page.goto("/contacto");
		const form = await fillPortugueseForm(page);
		await form.getByRole("button", { name: "Enviar pedido" }).press("Enter");
		await expect(page).toHaveURL(/\/contacto#contact-form-status$/);
		await expect(page.getByRole("status")).toContainText(
			"Mensagem enviada com sucesso",
		);
		expect(payload).toMatchObject({
			locale: "pt-PT",
			email: persona.email,
			country: "PT",
		});
		await page.reload();
		await expect(page.getByText("Mensagem enviada com sucesso")).toHaveCount(0);
	});

	test("unavailable storage preserves data and offers editable WhatsApp fallback", async ({
		page,
	}) => {
		await page.route("**/api/contact", async (route) => {
			const payload = route.request().postDataJSON();
			await route.fulfill({
				status: 503,
				contentType: "application/json",
				body: JSON.stringify({
					version: 1,
					ok: false,
					code: "unavailable",
					requestId: payload.requestId,
				}),
			});
		});
		await page.goto("/contacto");
		const form = await fillPortugueseForm(page);
		await form.getByRole("button", { name: "Enviar pedido" }).press("Enter");
		await expect(form.getByLabel("Nome")).toHaveValue(persona.name);
		await expect(
			form.getByRole("heading", { name: "Continuar pelo WhatsApp" }),
		).toBeVisible();
		await expect(form.getByLabel("Mensagem para o WhatsApp")).toHaveValue(
			new RegExp(persona.email),
		);
	});

	test("WhatsApp channel preserves shared fields and requires explicit continuation", async ({
		page,
	}) => {
		await page.goto("/contacto");
		const form = page.getByRole("form", { name: "Pedido de contacto" });
		await form.getByLabel("Nome").fill(persona.name);
		const whatsappChannel = form.getByRole("radio", {
			name: /Enviar pelo WhatsApp/,
		});
		await whatsappChannel.focus();
		await whatsappChannel.press("Space");
		await form.getByLabel("Tipo de pedido").selectOption("request-1");
		await form.getByLabel("País onde está").selectOption("PT");
		await form.getByRole("textbox", { name: "Mensagem", exact: true }).fill(persona.message);
		await form
			.getByRole("button", { name: "Continuar no WhatsApp" })
			.press("Enter");
		await expect(form.getByLabel("Mensagem para o WhatsApp")).toHaveValue(
			new RegExp(persona.name),
		);
	});
});
