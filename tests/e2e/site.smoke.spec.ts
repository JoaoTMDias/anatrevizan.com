import { expect, test } from "@playwright/test";

const routes = [
	{
		path: "/sobre",
		canonical: "https://anatrevizan.com/sobre",
		language: "pt-PT",
	},
	{
		path: "/en/about",
		canonical: "https://anatrevizan.com/en/about",
		language: "en",
	},
] as const;

test.describe("localized draft pages", () => {
	for (const route of routes) {
		test(`${route.language} route has safe metadata and no browser errors`, async ({
			page,
		}) => {
			const consoleErrors: string[] = [];
			page.on("console", (message) => {
				if (message.type() === "error") consoleErrors.push(message.text());
			});

			await page.goto(route.path);
			await expect(page).toHaveTitle(/.+/);
			expect(
				await page.locator('link[rel="canonical"]').getAttribute("href"),
			).toBe(route.canonical);
			expect(
				await page.locator('meta[name="robots"]').getAttribute("content"),
			).toBe("noindex,nofollow");
			expect(await page.locator('link[hreflang="x-default"]').count()).toBe(0);
			expect(consoleErrors).toEqual([]);
		});
	}

	test("draft pages do not advertise an unavailable language switch", async ({
		page,
	}) => {
		await page.goto("/sobre");
		expect(
			await page
				.getByRole("link", { name: /switch to english|english/i })
				.count(),
		).toBe(0);
	});

	test("Home reproduces the reference hero typography and CTA hierarchy", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1270, height: 900 });
		await page.goto("/");
		const heroHeading = page.locator(".home-hero h1");
		await expect(heroHeading).toHaveCSS("font-family", /Playfair Display/);
		await expect(heroHeading).toHaveCSS("font-size", "60px");
		await expect(heroHeading).toHaveCSS("line-height", "60px");
		await expect(page.locator(".home-hero__actions a").first()).toHaveCSS(
			"background-color",
			"oklch(0.45 0.14 140)",
		);
		await expect(page.locator(".editorial-cta a")).toHaveCount(1);
	});

	test("consulting and academic menus are keyboard accessible", async ({
		page,
	}) => {
		await page.goto("/sobre");
		for (const label of ["Consultoria", "Academia"]) {
			const menu = page.locator("details.nav-menu").filter({ hasText: label });
			const summary = menu.locator("summary");
			await summary.focus();
			expect(
				await summary.evaluate((element) => document.activeElement === element),
			).toBe(true);
			await page.keyboard.press("Enter");
			await expect(menu.locator("a").first()).toBeVisible();
			await page.keyboard.press("Escape");
			expect(await menu.getAttribute("open")).toBe(null);
		}
	});

	test("desktop dropdown keeps current items readable and visually restrained", async ({
		page,
	}) => {
		await page.goto("/consultoria/migracao-e-mobilidade");
		const menu = page.locator("details.nav-menu").filter({
			hasText: "Consultoria",
		});
		await menu.locator("summary").click();
		const dropdown = menu.locator(".nav-dropdown");
		await expect(dropdown).toBeVisible();
		await expect(dropdown).toHaveCSS("width", "320px");
		const current = dropdown.locator('[aria-current="page"]');
		await expect(current).toContainText("Migração e Mobilidade");
		const colors = await current.evaluate((element) => {
			const style = getComputedStyle(element);
			return { background: style.backgroundColor, foreground: style.color };
		});
		expect(colors.background).not.toBe("rgb(22, 163, 74)");
		expect(colors.background).not.toBe(colors.foreground);
	});

	test("mobile navigation behaves as a modal keyboard surface", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 320, height: 800 });
		await page.goto("/sobre");
		const menu = page.locator("details.mobile-nav");
		const trigger = menu.locator(":scope > summary");
		await trigger.focus();
		await page.keyboard.press("Enter");
		await expect(trigger).toHaveAttribute("aria-expanded", "true");
		const dialog = menu.getByRole("dialog");
		await expect(dialog).toBeVisible();
		await expect(
			dialog.getByRole("link", { name: "Dra. Ana Trevizan", exact: true }),
		).toBeVisible();
		await expect(
			dialog.getByRole("link", { name: "Agendar primeiro contacto" }),
		).toHaveAttribute("href", "/agendar");
		const close = dialog.getByRole("button", { name: "Fechar menu" });
		await expect(close).toBeVisible();
		const layerBox = await menu.locator("[data-mobile-layer]").boundingBox();
		const panelBox = await dialog.boundingBox();
		expect(layerBox).toEqual({ x: 0, y: 0, width: 320, height: 800 });
		expect(panelBox?.width).toBe(272);
		expect(panelBox?.height).toBe(800);
		expect(await page.locator("footer").getAttribute("inert")).not.toBeNull();
		await close.click();
		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await trigger.focus();
		await page.keyboard.press("Enter");
		await page.keyboard.press("Escape");
		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		expect(await page.locator("footer").getAttribute("inert")).toBeNull();
		expect(
			await trigger.evaluate((node) => node === document.activeElement),
		).toBe(true);
	});

	test("shared shell exposes visible focus and real configured destinations", async ({
		page,
	}) => {
		await page.goto("/sobre");
		const logo = page
			.getByRole("link", { name: "Dra. Ana Trevizan", exact: true })
			.first();
		await logo.focus();
		expect(
			await logo.evaluate((node) => getComputedStyle(node).outlineStyle),
		).not.toBe("none");
		expect(await page.locator('a[href="#"]').count()).toBe(0);
		await expect(page.locator('footer a[href^="mailto:"]')).toHaveCount(1);
		await expect(page.locator('footer a[href^="https://wa.me/"]')).toHaveCount(1);
		for (const profile of ["LinkedIn", "Instagram", "ORCID"])
			await expect(
				page.locator("footer").getByRole("link", { name: profile, exact: true }),
			).toBeVisible();
		await expect(page.locator("footer")).toContainText("🇵🇹 Portugal · 🇧🇷 Brasil");
		await expect(page.locator("footer")).toContainText("Idiomas: PT · EN · ES");
		await expect(page.locator(".footer-legal")).toContainText(
			"Dra. Ana Flávia Trevizan · OAB nº [reservado]",
		);
		await expect(page.locator(".footer-legal")).toContainText(
			"Este site tem caráter meramente informativo e não constitui aconselhamento jurídico.",
		);
		await expect(page.locator(".footer-legal")).toContainText(
			"Todos os direitos reservados.",
		);
	});

	test("Portuguese Home renders the complete dedicated template", async ({
		page,
	}) => {
		await page.goto("/");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			/Transformo complexidade jurídica/,
		);
		for (const heading of [
			"Por que a Dra. Ana Trevizan?",
			"Áreas de Consultoria",
			"Credenciais e vínculos",
			"Marque uma conversa inicial",
		])
			await expect(
				page.getByRole("heading", { name: heading, exact: true }),
			).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Academia", exact: true }),
		).toHaveCount(2);
		expect(await page.locator('a[href="#"]').count()).toBe(0);
		expect(await page.locator("h1").count()).toBe(1);
	});

	test("Home exposes the migrated institutional visual structures", async ({
		page,
	}) => {
		await page.goto("/");
		await expect(page.locator(".home-hero")).toBeVisible();
		await expect(page.locator(".home-gateway")).toHaveCount(2);
		await expect(page.locator(".home-difference")).toHaveCount(4);
		await expect(page.locator(".home-service-card")).toHaveCount(5);
		await expect(page.locator(".home-publication")).toHaveCount(3);
		await expect(page.locator(".home-hero")).toHaveCSS("height", "640px");
		const homeVisuals = await page.evaluate(() => ({
			heroBackground: getComputedStyle(
				document.querySelector(".home-hero") as HTMLElement,
			).backgroundImage,
			serviceColumns: getComputedStyle(
				document.querySelector(".home-services") as HTMLElement,
			).gridTemplateColumns.split(" ").length,
		}));
		expect(homeVisuals.heroBackground).toContain("hero-home.webp");
		expect(homeVisuals.serviceColumns).toBe(3);
	});

	test("Portuguese About renders ordered editorial sections", async ({
		page,
	}) => {
		await page.goto("/sobre");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"Dra. Ana Flávia Trevizan",
		);
		for (const heading of [
			"Marcos do percurso",
			"Onde atuo hoje",
			"O que orienta o meu trabalho",
			"Redes e vínculos de investigação",
			"Falamos?",
		])
			await expect(
				page.getByRole("heading", { name: heading, exact: true }),
			).toBeVisible();
		expect(await page.locator("h1").count()).toBe(1);
		expect(await page.locator('a[href="#"]').count()).toBe(0);
	});

	test("English previews never expose the copied Portuguese page content", async ({
		page,
	}) => {
		for (const route of ["/en", "/en/about"]) {
			await page.goto(route);
			await expect(
				page.getByText(
					"This draft has not been translated or approved for publication.",
				),
			).toBeVisible();
			await expect(
				page.getByText(/Transformo complexidade jurídica|Marcos do percurso/),
			).toHaveCount(0);
		}
	});

	for (const viewport of [
		{ width: 320, height: 800 },
		{ width: 1280, height: 800 },
	]) {
		test(`Home has no horizontal overflow at ${viewport.width}px`, async ({
			page,
		}) => {
			await page.setViewportSize(viewport);
			await page.goto("/");
			expect(
				await page.evaluate(
					() =>
						document.documentElement.scrollWidth <=
						document.documentElement.clientWidth,
				),
			).toBe(true);
		});
	}

	test("Home reflows at the 320 CSS px equivalent of 400% zoom", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 320, height: 800 });
		await page.goto("/");
		expect(
			await page.evaluate(
				() =>
					document.documentElement.scrollWidth <=
					document.documentElement.clientWidth,
			),
		).toBe(true);
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});

	test("reduced motion disables non-essential transitions", async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/");
		const duration = await page.locator("a").first().evaluate(
			(element) => getComputedStyle(element).transitionDuration,
		);
		expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001);
	});

	test("Portuguese consulting hub exposes five localized service destinations", async ({
		page,
	}) => {
		const errors: string[] = [];
		page.on("console", (message) => {
			if (message.type() === "error") errors.push(message.text());
		});
		await page.goto("/consultoria");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"Consultoria",
		);
		await expect(page.locator("[data-consulting-areas] > article")).toHaveCount(
			5,
		);
		await expect(page.getByRole("button", { name: "Ver tudo" })).toHaveCSS(
			"background-color",
			"oklch(0.4 0.13 18)",
		);
		await expect(
			page.getByRole("button", { name: "Estou em Portugal" }),
		).toHaveCSS("border-top-width", "0px");
		await page.getByRole("button", { name: "Estou em Portugal" }).focus();
		await page.keyboard.press("Space");
		await expect(
			page.getByRole("heading", { name: "Ambiental e ESG" }),
		).toBeHidden();
		await page.getByRole("button", { name: "Ver tudo" }).click();
		await expect(
			page.getByRole("heading", { name: "Ambiental e ESG" }),
		).toBeVisible();
		expect(await page.locator('a[href="#"]').count()).toBe(0);
		expect(errors).toEqual([]);
	});

	test("shared editorial hero exposes breadcrumbs and both CTA destinations", async ({
		page,
	}) => {
		await page.goto("/consultoria/juridica");
		const breadcrumbs = page.getByRole("navigation", { name: "Breadcrumb" });
		await expect(
			breadcrumbs.getByRole("link", { name: "Início" }),
		).toHaveAttribute("href", "/");
		await expect(
			breadcrumbs.getByRole("link", { name: "Consultoria" }),
		).toHaveAttribute("href", "/consultoria");
		await expect(breadcrumbs.getByText("Consultoria Jurídica")).toHaveAttribute(
			"aria-current",
			"page",
		);
		await expect(
			page.locator(".editorial-cta").getByRole("link", {
				name: "Agendar primeiro contacto",
			}),
		).toHaveAttribute("href", "/agendar");
		await expect(
			page.getByRole("link", { name: "Falar sobre o meu caso" }),
		).toHaveAttribute("href", "/contacto");
	});

	for (const [route, heading] of [
		["/consultoria/migracao-e-mobilidade", "Migração e Mobilidade"],
		["/consultoria/juridica", "Consultoria Jurídica"],
		["/consultoria/ambiental-e-esg", "Consultoria Ambiental e ESG"],
		["/consultoria/politicas-publicas", "Políticas Públicas e Governança"],
		["/consultoria/pareceres", "Pareceres e Notas Técnicas"],
	] as const) {
		test(`${heading} renders its dedicated consulting service structure`, async ({
			page,
		}) => {
			const errors: string[] = [];
			page.on("console", (message) => {
				if (message.type() === "error") errors.push(message.text());
			});
			await page.goto(route);
			await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
			expect(await page.locator("h1").count()).toBe(1);
			expect(await page.locator('a[href="#"]').count()).toBe(0);
			await expect(
				page.getByText(
					"Conteúdo aprovado editorialmente; publicação ainda pendente.",
				),
			).toBeVisible();
			expect(errors).toEqual([]);
		});
	}

	test("immigration trust cross-link follows the approved Next reference", async ({
		page,
	}) => {
		await page.goto("/consultoria/migracao-e-mobilidade");
		await expect(
			page.getByRole("link", { name: "Conhecer o percurso" }),
		).toHaveAttribute("href", "/sobre");
	});

	test("consulting pages reflow without horizontal overflow at 320px", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 320, height: 800 });
		for (const route of ["/consultoria", "/consultoria/ambiental-e-esg"]) {
			await page.goto(route);
			expect(
				await page.evaluate(
					() =>
						document.documentElement.scrollWidth <=
						document.documentElement.clientWidth,
				),
			).toBe(true);
		}
	});

	test("Environmental and ESG alone receives the consulting accent hero", async ({
		page,
	}) => {
		await page.goto("/consultoria/ambiental-e-esg");
		await expect(page.locator("header.editorial-hero--accent")).toHaveCount(1);
		await page.goto("/consultoria/juridica");
		await expect(page.locator("header.editorial-hero--accent")).toHaveCount(0);
	});

	test("English consulting previews do not expose Portuguese source content", async ({
		page,
	}) => {
		for (const route of [
			"/en/consulting",
			"/en/consulting/immigration-mobility",
			"/en/consulting/legal",
			"/en/consulting/environmental-esg",
			"/en/consulting/public-policy",
			"/en/consulting/legal-opinions",
		]) {
			await page.goto(route);
			await expect(
				page.getByText(
					/Onde precisa de apoio|Atuação preventiva|O que posso fazer/,
				),
			).toHaveCount(0);
		}
	});

	test("Portuguese academic hub links all five academic areas", async ({
		page,
	}) => {
		await page.goto("/academia");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"Academia",
		);
		for (const heading of [
			"Mentorias e Apoio Académico",
			"Publicações",
			"Eventos e Palestras",
			"Palestras e Convites",
			"Cursos e Formações",
		])
			await expect(
				page.getByRole("heading", { name: heading, exact: true }),
			).toBeVisible();
		expect(await page.locator('a[href="#"]').count()).toBe(0);
	});

	for (const [route, heading] of [
		["/academia/mentorias", "Mentorias e Apoio Académico"],
		["/academia/formacoes", "Cursos e Formações"],
		["/academia/publicacoes", "Publicações"],
		["/academia/eventos", "Eventos e Palestras"],
		["/academia/palestras", "Palestras e Convites"],
	] as const) {
		test(`${heading} renders without fake links or console errors`, async ({
			page,
		}) => {
			const errors: string[] = [];
			page.on("console", (message) => {
				if (message.type() === "error") errors.push(message.text());
			});
			await page.goto(route);
			await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
			expect(await page.locator('a[href="#"]').count()).toBe(0);
			expect(errors).toEqual([]);
		});
	}

	test("publications preserve 25 records without linking inherited placeholders", async ({
		page,
	}) => {
		await page.goto("/academia/publicacoes");
		await expect(page.locator("[data-publications] > article")).toHaveCount(25);
		await expect(page.locator(".publication-card h2").nth(0)).toHaveText(
			"Exploring the Brussels Effect",
		);
		await expect(page.locator(".publication-card h2").nth(1)).toHaveText(
			"Forest Trade on the Amazon Frontier and Its Interaction with the EUDR",
		);
		await expect(page.locator(".publication-card h2").nth(2)).toHaveText(
			"The European Union’s forest diplomacy: A path toward ostensible environmental sustainability",
		);
		expect(
			(await page.locator(".publication-card__meta").allTextContents()).join(" "),
		).not.toMatch(/journal-article|preprint|report|book-chapter/);
		await expect(page.getByText("Ligação não disponível.")).toHaveCount(2);
		await page.locator('select[name="year"]').selectOption("2026");
		await expect(page.locator("[data-publication-count]")).toHaveText(
			/\d+ publicaç(ão|ões)/,
		);
		await page.getByRole("button", { name: "Limpar filtros" }).click();
		await expect(
			page.locator("[data-publications] > article:visible"),
		).toHaveCount(25);
	});

	test("academic pages expose the migrated visual structures", async ({
		page,
	}) => {
		await page.goto("/academia");
		await expect(page.locator("a.academic-hub-card")).toHaveCount(5);
		await page.goto("/academia/mentorias");
		await expect(page.locator(".academic-service-card")).toHaveCount(6);
		await page.goto("/academia/publicacoes");
		await expect(page.locator(".publication-card")).toHaveCount(25);
		await page.goto("/academia/eventos");
		await expect(page.locator(".academic-empty")).toBeVisible();
		await page.goto("/academia/palestras");
		await expect(page.locator(".speaking-kit-card")).toHaveCount(3);
	});

	test("events expose an honest empty state and speaking has no fake download", async ({
		page,
	}) => {
		await page.goto("/academia/eventos");
		await expect(
			page.getByRole("heading", { name: "Journal em consolidação" }),
		).toBeVisible();
		await page.goto("/academia/palestras");
		await expect(
			page.getByText(
				/Descarregar kit de palestrante: ficheiro ainda não disponível/,
			),
		).toBeVisible();
		expect(
			await page.getByRole("link", { name: /Descarregar kit/ }).count(),
		).toBe(0);
	});

	test("academic pages reflow at 320px", async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 800 });
		for (const route of [
			"/academia",
			"/academia/mentorias",
			"/academia/publicacoes",
			"/academia/eventos",
			"/academia/palestras",
			"/academia/formacoes",
		]) {
			await page.goto(route);
			expect(
				await page.evaluate(
					() =>
						document.documentElement.scrollWidth <=
						document.documentElement.clientWidth,
				),
			).toBe(true);
		}
	});

	test("English academic previews never expose copied Portuguese content", async ({
		page,
	}) => {
		for (const route of [
			"/en/academic",
			"/en/academic/mentoring",
			"/en/academic/publications",
			"/en/academic/events",
			"/en/academic/speaking",
			"/en/academic/training",
		]) {
			await page.goto(route);
			await expect(
				page.getByText(
					/Uma trajetória rica|Sei onde a escrita|Journal em consolidação/,
				),
			).toHaveCount(0);
		}
	});

	test("Contact renders its inactive form and confirmed contact destinations", async ({
		page,
	}) => {
		const errors: string[] = [];
		page.on("console", (message) => {
			if (message.type() === "error") errors.push(message.text());
		});
		await page.goto("/contacto");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"Vamos falar",
		);
		await expect(
			page.getByRole("heading", { name: "Formulário de contacto" }),
		).toBeVisible();
		await expect(
			page.locator("#main-content").getByText("af.trevizan@gmail.com"),
		).toBeVisible();
		await expect(page.locator("form fieldset")).toHaveAttribute("disabled", "");
		await expect(page.locator('form input[name="name"]')).toBeDisabled();
		await expect(page.locator("form input")).toHaveCount(4);
		await expect(page.locator("form textarea")).toHaveCount(1);
		await expect(page.locator("form select")).toHaveCount(1);
		const contactContent = page.locator("#main-content");
		await expect(
			contactContent.locator('a[href="mailto:af.trevizan@gmail.com"]'),
		).toBeVisible();
		await expect(
			contactContent.locator('a[href="https://wa.me/351926430792"]'),
		).toBeVisible();
		await expect(
			contactContent.getByRole("link", { name: "LinkedIn" }),
		).toBeVisible();
		await expect(
			contactContent.getByRole("link", { name: "Instagram" }),
		).toBeVisible();
		await expect(
			contactContent.getByRole("link", { name: "ORCID" }),
		).toBeVisible();
		expect(await page.locator('a[href="#"]').count()).toBe(0);
		expect(errors).toEqual([]);
	});

	test("institutional and legal pages expose their migrated visual structures", async ({
		page,
	}) => {
		await page.goto("/sobre");
		await expect(page.locator(".about-timeline")).toBeVisible();
		await page.goto("/contacto");
		await expect(page.locator(".contact-layout")).toBeVisible();
		await page.goto("/agendar");
		await expect(page.locator(".booking-panel")).toBeVisible();
		await page.goto("/politica-de-privacidade");
		await expect(page.locator(".legal-review-notice")).toBeVisible();
	});

	test("contact and booking retain their desktop two-column composition", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1270, height: 900 });
		for (const [route, primary, secondary] of [
			["/contacto", ".contact-layout > :first-child", ".contact-methods"],
			["/agendar", ".booking-panel", ".booking-notes"],
		] as const) {
			await page.goto(route);
			const primaryBox = await page.locator(primary).boundingBox();
			const secondaryBox = await page.locator(secondary).boundingBox();
			if (!primaryBox || !secondaryBox) {
				throw new Error(`Missing layout column on ${route}`);
			}
			expect(Math.abs(primaryBox.y - secondaryBox.y)).toBeLessThan(2);
			expect(primaryBox.x + primaryBox.width).toBeLessThan(secondaryBox.x);
			expect(primaryBox.width).toBeGreaterThan(secondaryBox.width);
		}
	});

	test("Booking exposes the confirmed Calendly link without an embed", async ({
		page,
	}) => {
		const errors: string[] = [];
		page.on("console", (message) => {
			if (message.type() === "error") errors.push(message.text());
		});
		await page.goto("/agendar");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"Agende uma conversa inicial",
		);
		await expect(
			page.getByRole("link", { name: "Abrir calendário de agendamento" }),
		).toHaveAttribute("href", "https://calendly.com/dratrevizan");
		expect(await page.locator('script[src*="calendly"]').count()).toBe(0);
		expect(await page.locator('a[href*="calendly.com"]').count()).toBe(1);
		expect(errors).toEqual([]);
	});

	test("Contact and Booking reflow at 320px", async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 800 });
		for (const route of ["/contacto", "/agendar"]) {
			await page.goto(route);
			expect(
				await page.evaluate(
					() =>
						document.documentElement.scrollWidth <=
						document.documentElement.clientWidth,
				),
			).toBe(true);
		}
	});

	test("English Contact and Booking previews expose no Portuguese fallback", async ({
		page,
	}) => {
		for (const route of ["/en/contact", "/en/book-a-call"]) {
			await page.goto(route);
			await expect(
				page.getByText(
					/Vamos falar|Conte-me a sua situação|Agende uma conversa inicial|Fuso de Portugal/,
				),
			).toHaveCount(0);
		}
	});

	for (const [route, heading] of [
		["/politica-de-privacidade", "Política de privacidade"],
		["/termos", "Termos de utilização"],
		["/cookies", "Política de cookies"],
	] as const) {
		test(`${heading} exposes review requirements without invented legal copy`, async ({
			page,
		}) => {
			const errors: string[] = [];
			page.on("console", (message) => {
				if (message.type() === "error") errors.push(message.text());
			});
			await page.goto(route);
			await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
			await expect(
				page.getByText(/contém apenas um placeholder/),
			).toBeVisible();
			await expect(
				page.getByText(/Lista interna de revisão; não constitui/),
			).toBeVisible();
			expect(await page.locator("h1").count()).toBe(1);
			expect(await page.locator('a[href="#"]').count()).toBe(0);
			expect(errors).toEqual([]);
		});
	}

	test("legal pages reflow at 320px", async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 800 });
		for (const route of ["/politica-de-privacidade", "/termos", "/cookies"]) {
			await page.goto(route);
			expect(
				await page.evaluate(
					() =>
						document.documentElement.scrollWidth <=
						document.documentElement.clientWidth,
				),
			).toBe(true);
		}
	});

	test("English legal previews expose no Portuguese placeholder or requirements", async ({
		page,
	}) => {
		for (const route of ["/en/privacy-policy", "/en/terms", "/en/cookies"]) {
			await page.goto(route);
			await expect(
				page.getByText(
					/Página em construção|Responsável pelo tratamento|Finalidade informativa|Cookies essenciais/,
				),
			).toHaveCount(0);
		}
	});
});
