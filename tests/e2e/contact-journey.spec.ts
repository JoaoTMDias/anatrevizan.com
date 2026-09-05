import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { installFakeTurnstile } from "./site";

const persona = {
	name: "Maria Exemplo",
	email: "maria@example.com",
	whatsapp: "+351 910 000 000",
	message: "Pretendo esclarecer uma questão jurídica numa primeira conversa.",
};

const englishPersona = {
	name: "Alex Example",
	email: "alex@example.com",
	message: "I need guidance about an international legal matter.",
};

async function fillPortugueseForm(page: import("@playwright/test").Page) {
	const form = page.getByRole("form", { name: "Pedido de contacto" });
	await form.getByLabel("Nome").fill(persona.name);
	await form.getByLabel("E-mail").fill(persona.email);
	await form.getByLabel("WhatsApp (opcional)").fill(persona.whatsapp);
	await form.getByLabel("Tipo de pedido").selectOption("request-1");
	await form.getByLabel("País onde está").selectOption("PT");
	await form
		.getByRole("textbox", { name: "Mensagem", exact: true })
		.fill(persona.message);
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
		await form.getByLabel("Nome").fill(persona.name);
		await expect(form.getByLabel("Nome")).not.toHaveAttribute(
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
		await form
			.getByRole("textbox", { name: "Mensagem", exact: true })
			.fill(persona.message);
		await form
			.getByRole("button", { name: "Continuar no WhatsApp" })
			.press("Enter");
		await expect(form.getByLabel("Mensagem para o WhatsApp")).toHaveValue(
			new RegExp(persona.name),
		);
	});

	test("network failure preserves entries and retries with the same request id", async ({
		page,
	}) => {
		const requestIds: string[] = [];
		let attempt = 0;
		await page.route("**/api/contact", async (route) => {
			const payload = route.request().postDataJSON();
			requestIds.push(payload.requestId);
			attempt += 1;
			if (attempt === 1) return route.abort("connectionfailed");
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
		const submit = form.getByRole("button", { name: "Enviar pedido" });
		await submit.press("Enter");
		await expect(form.getByRole("alert").last()).toContainText(
			"Não foi possível enviar",
		);
		await expect(form.getByLabel("Nome")).toHaveValue(persona.name);
		await submit.press("Enter");
		await expect(page).toHaveURL(/contacto#contact-form-status$/);
		expect(requestIds).toHaveLength(2);
		expect(new Set(requestIds).size).toBe(1);
	});

	test("a pending submission disables duplicate submits", async ({ page }) => {
		let requests = 0;
		let completeRequest: (() => void) | undefined;
		const pendingRequest = new Promise<void>((resolve) => {
			completeRequest = resolve;
		});
		await page.route("**/api/contact", async (route) => {
			requests += 1;
			const payload = route.request().postDataJSON();
			await pendingRequest;
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
		const submit = form.getByRole("button", { name: "Enviar pedido" });
		await submit.focus();
		await page.keyboard.press("Enter");
		await expect.poll(() => requests).toBe(1);
		await expect(
			form.getByRole("button", { name: "A enviar…" }),
		).toBeDisabled();
		await page.keyboard.press("Enter");
		completeRequest?.();
		await expect(page).toHaveURL(/contacto#contact-form-status$/);
		expect(requests).toBe(1);
	});

	test("English client completes the essential localized journey", async ({
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
		await page.goto("/en/contact");
		const form = page.getByRole("form", { name: "Contact request" });
		await form.getByLabel("Name").fill(englishPersona.name);
		await form
			.getByRole("textbox", { name: "Email", exact: true })
			.fill(englishPersona.email);
		await form.getByLabel("Type of request").selectOption("request-1");
		await form.getByLabel("Country").selectOption("PT");
		await form
			.getByRole("textbox", { name: "Message", exact: true })
			.fill(englishPersona.message);
		await form.getByRole("button", { name: "Send request" }).press("Enter");
		await expect(page).toHaveURL(/\/en\/contact#contact-form-status$/);
		await expect(page.getByRole("status")).toContainText("sent successfully");
		expect(payload).toMatchObject({
			locale: "en",
			email: englishPersona.email,
		});
	});

	test("client timeout keeps data available for retry", async ({ page }) => {
		test.setTimeout(40_000);
		await page.route("**/api/contact", async () => {
			await new Promise(() => undefined);
		});
		await page.goto("/contacto");
		const form = await fillPortugueseForm(page);
		await form.getByRole("button", { name: "Enviar pedido" }).press("Enter");
		await expect(form.getByRole("alert").last()).toContainText(
			"Não foi possível enviar",
			{ timeout: 20_000 },
		);
		await expect(form.getByLabel("Nome")).toHaveValue(persona.name);
	});

	test("oversized WhatsApp URL is blocked and popup failure leaves manual data", async ({
		page,
	}) => {
		await page.addInitScript(() => {
			window.open = () => null;
		});
		await page.goto("/contacto");
		const form = page.getByRole("form", { name: "Pedido de contacto" });
		await form.getByLabel("Nome").fill(persona.name);
		await form
			.getByRole("radio", { name: /Enviar pelo WhatsApp/ })
			.press("Space");
		await form.getByLabel("Tipo de pedido").selectOption("request-1");
		await form.getByLabel("País onde está").selectOption("PT");
		await form
			.getByRole("textbox", { name: "Mensagem", exact: true })
			.fill("x".repeat(2_100));
		await form
			.getByRole("button", { name: "Continuar no WhatsApp" })
			.press("Enter");
		const preview = form.getByLabel("Mensagem para o WhatsApp");
		await form
			.getByRole("button", { name: "Continuar no WhatsApp" })
			.last()
			.press("Enter");
		await expect(form.getByRole("alert").last()).toContainText(
			"Reduza a mensagem",
		);
		await preview.fill(persona.message);
		await form
			.getByRole("button", { name: "Continuar no WhatsApp" })
			.last()
			.press("Enter");
		await expect(form.getByText("copie manualmente")).toBeVisible();
		await expect(form.locator("pre")).toContainText(persona.message);
	});
});
