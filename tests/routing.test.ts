import { describe, expect, it } from "vitest";
import {
	alternatePath,
	contactBookingPath,
	editorialLocales,
	pathFor,
	publishedLocales,
	routeKeys,
	routeMap,
} from "../src/lib/routing.ts";

describe("route map", () => {
	it("contains 14 unique and reversible locale routes", () => {
		expect(routeKeys).toHaveLength(14);
		expect(publishedLocales).toEqual(["pt-PT", "pt-BR", "en"]);
		expect(editorialLocales).toContain("es");
		expect(
			new Set(routeKeys.flatMap((key) => Object.values(routeMap[key]))).size,
		).toBe(42);
		for (const key of routeKeys) {
			expect(alternatePath(pathFor(key, "pt-PT"))).toBe(pathFor(key, "pt-BR"));
			expect(pathFor(key, "pt-BR")).toContain("/pt-br");
		}
	});

	it("publishes accessibility and retires launch-only legal routes", () => {
		expect(pathFor("accessibility", "pt-PT")).toBe(
			"/declaracao-de-acessibilidade",
		);
		expect(pathFor("accessibility", "en")).toBe("/en/accessibility-statement");
		expect(routeKeys).not.toContain("terms");
		expect(routeKeys).not.toContain("cookies");
	});

	it("links booking calls to the localized contact section", () => {
		expect(contactBookingPath("pt-PT")).toBe("/contacto#agendar");
		expect(contactBookingPath("en")).toBe("/en/contact#book");
	});
});
