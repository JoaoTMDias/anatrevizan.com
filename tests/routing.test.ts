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
	it("contains 17 unique and reversible PT-PT to EN pairs", () => {
		expect(routeKeys).toHaveLength(17);
		expect(publishedLocales).toEqual(["pt-PT", "en"]);
		expect(editorialLocales).toContain("es");
		expect(
			new Set(routeKeys.flatMap((key) => Object.values(routeMap[key]))).size,
		).toBe(34);
		for (const key of routeKeys)
			expect(alternatePath(pathFor(key, "pt-PT"))).toBe(pathFor(key, "en"));
	});

	it("links booking calls to the localized contact section", () => {
		expect(contactBookingPath("pt-PT")).toBe("/contacto#agendar");
		expect(contactBookingPath("en")).toBe("/en/contact#book");
	});
});
