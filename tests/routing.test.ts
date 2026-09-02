import { describe, expect, it } from "vitest";
import {
	alternatePath,
	editorialLocales,
	pathFor,
	publishedLocales,
	routeKeys,
	routeMap,
} from "../src/lib/routing.ts";

describe("route map", () => {
	it("contains 18 unique and reversible PT-PT to EN pairs", () => {
		expect(routeKeys).toHaveLength(18);
		expect(publishedLocales).toEqual(["pt-PT", "en"]);
		expect(editorialLocales).toContain("es");
		expect(
			new Set(routeKeys.flatMap((key) => Object.values(routeMap[key]))).size,
		).toBe(36);
		for (const key of routeKeys)
			expect(alternatePath(pathFor(key, "pt-PT"))).toBe(pathFor(key, "en"));
	});
});
