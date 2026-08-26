import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/global.css", "utf8");
const pageHero = readFileSync(
	"src/components/editorial/PageHero.astro",
	"utf8",
);
const contactCta = readFileSync(
	"src/components/editorial/ContactCta.astro",
	"utf8",
);
const emptyState = readFileSync(
	"src/components/editorial/EmptyState.astro",
	"utf8",
);
const card = readFileSync("src/components/ui/Card.astro", "utf8");
const consultingService = readFileSync(
	"src/components/editorial/ConsultingServicePage.astro",
	"utf8",
);
const academicHub = readFileSync(
	"src/components/editorial/AcademicHubPage.astro",
	"utf8",
);
const publications = readFileSync(
	"src/components/editorial/PublicationsPage.astro",
	"utf8",
);
const speaking = readFileSync(
	"src/components/editorial/SpeakingPage.astro",
	"utf8",
);
const home = readFileSync("src/components/editorial/HomePage.astro", "utf8");
const contact = readFileSync(
	"src/components/editorial/ContactPage.astro",
	"utf8",
);
const booking = readFileSync(
	"src/components/editorial/BookingPage.astro",
	"utf8",
);
const baseHead = readFileSync("src/components/BaseHead.astro", "utf8");
const socialImage = readFileSync("public/og-default.svg", "utf8");
const header = readFileSync("src/components/Header.astro", "utf8");
const headerMenu = readFileSync("src/components/HeaderMenu.tsx", "utf8");
const footer = readFileSync("src/components/Footer.astro", "utf8");
const iconLink = readFileSync("src/components/IconLink.astro", "utf8");

describe("Phase 3 visual foundation", () => {
	it("defines the approved typography and core palette", () => {
		expect(css).toContain('@import "@fontsource/fira-sans/400.css"');
		expect(css).toContain('@import "@fontsource/fira-sans/700.css"');
		expect(css).toContain('url("/fonts/playfair-display-variable.woff2")');
		expect(css).toContain('--font-sans: "Fira Sans", system-ui, sans-serif');
		expect(statSync("public/fonts/playfair-display-variable.woff2").size).toBe(
			38_460,
		);
		expect(css).toContain("--font-heading:");
		expect(css).toContain("--primary: oklch(0.4 0.13 18)");
		expect(css).toContain("--accent: oklch(0.45 0.14 140)");
		expect(css).not.toContain("text-wrap: balance");
	});

	it("exposes every 50–950 reference color scale", () => {
		for (const family of [
			"primary",
			"accent",
			"secondary",
			"background",
			"foreground",
		]) {
			for (const shade of [
				50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
			]) {
				expect(css).toContain(`--${family}-${shade}:`);
				expect(css).toContain(`--color-${family}-${shade}:`);
			}
		}
	});

	it("provides constrained containers and explicit user preference rules", () => {
		expect(css).toContain("max-width: 80rem");
		expect(css).toContain("@media (prefers-reduced-motion: reduce)");
		expect(css).toContain("@media (forced-colors: active)");
	});

	it("uses a readable dedicated desktop navigation dropdown", () => {
		expect(header).toContain("<HeaderMenu");
		expect(header).toContain("client:load");
		expect(headerMenu).toContain("nav-dropdown__item");
		expect(headerMenu).not.toContain("nav-dropdown__hub");
		expect(css).toContain('.nav-dropdown__item[aria-current="page"]');
		expect(css).toContain(
			"background: color-mix(in oklab, var(--primary) 9%, var(--background))",
		);
	});

	it("renders the approved Home hero artwork and reference grid proportions", () => {
		expect(css).toContain('url("/hero-home.webp") center / cover no-repeat');
		expect(css).toContain(".home-services");
		expect(css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
	});

	it("matches the reference dimensions and media for internal heroes", () => {
		expect(css).toContain("height: 42.5rem");
		expect(css).toContain("height: 35rem");
		expect(css).toContain(
			"var(--hero-image) var(--hero-position) / cover no-repeat",
		);
		expect(css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
	});
});

describe("Phase 3 consulting visual family", () => {
	it("reserves the approved accent treatment for Environmental and ESG", () => {
		expect(consultingService).toContain(
			"const accent = data.routeKey === 'environmental-esg'",
		);
		expect(consultingService).toContain("tone={accent ? 'accent' : 'primary'}");
		expect(consultingService).toContain(
			"media={accent ? '/hero-ambiental.webp' : undefined}",
		);
		expect(css).toContain(".editorial-hero--accent");
	});

	it("provides explicit filter selection and responsive process steps", () => {
		expect(css).toContain('.consulting-filters [aria-pressed="true"]');
		expect(css).toContain(".consulting-steps");
		expect(css).toContain(
			"grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr))",
		);
	});
});

describe("Phase 3 academic visual family", () => {
	it("uses linked accent cards and dedicated academic icon treatments", () => {
		expect(academicHub).toContain("academic-hub-card");
		expect(academicHub).toContain("academic-hub-card--highlight");
		expect(css).toContain(".academic-icon");
		expect(css).toContain(".academic-service-card");
	});

	it("provides compact publication filters and responsive list cards", () => {
		expect(publications).toContain("publication-filters");
		expect(publications).toContain("publication-card");
		expect(css).toContain(".publication-card__meta");
		expect(css).toContain(".publication-filters select");
	});

	it("preserves unavailable speaker media without creating a fake download", () => {
		expect(speaking).toContain("speaking-kit-notice");
		expect(speaking).toContain("speaking-topic");
		expect(speaking).not.toContain('href="#"');
	});
});

describe("Phase 3 institutional visual family", () => {
	it("migrates the complete Home presentation with the approved static media", () => {
		expect(home).toContain("home-hero");
		expect(home).toContain("home-gateways");
		expect(home).toContain("home-differences");
		expect(home).toContain("home-publications");
		expect(home).not.toContain("<video");
	});

	it("keeps contact and booking presentation safe and non-embedded", () => {
		expect(contact).toContain("contact-form-notice");
		expect(contact).toContain("<fieldset disabled>");
		expect(booking).toContain("booking-panel");
		expect(booking).not.toContain("<iframe");
	});

	it("provides the approved typographic social-image placeholder", () => {
		expect(baseHead).toContain("/og-default.svg");
		expect(baseHead).toContain('name="twitter:card"');
		expect(socialImage).toContain('width="1200" height="630"');
		expect(socialImage).toContain("Dra. Ana Trevizan");
	});
});

describe("Phase 3 shared editorial structures", () => {
	it("provides static localized heroes with semantic breadcrumbs", () => {
		expect(pageHero).toContain("<Breadcrumbs items={items} />");
		expect(pageHero).toContain("<h1>{title}</h1>");
		expect(pageHero).not.toContain("<video");
	});

	it("provides shared conversion and empty states without fake links", () => {
		expect(contactCta).toContain("pathFor('booking', locale)");
		expect(contactCta).toContain("pathFor('contact', locale)");
		expect(emptyState).toContain("href && linkLabel");
		expect(`${contactCta}${emptyState}`).not.toContain('href="#"');
		expect(contactCta).toContain("Falar sobre o meu caso");
	});

	it("renders editable footer identity and valid accessible profile links", () => {
		expect(footer).toContain("professionalRegistration");
		expect(footer).toContain("serviceLanguages");
		expect(footer).toContain("<IconLink");
		expect(iconLink).toContain("title: string");
		expect(iconLink).toContain("link: string");
		expect(iconLink).not.toContain("?? '#'");
	});

	it("preserves article semantics for independent editorial cards", () => {
		expect(card).toContain("as?: 'article' | 'div'");
		expect(card).toContain("<Tag class=");
	});

	it("uses the reference hero heights and explicit responsive grids", () => {
		expect(css).toContain("height: 35rem");
		expect(css).toContain("height: 42.5rem");
		expect(css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
		expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
	});
});
