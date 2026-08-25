import { describe, expect, it } from "vitest";
import { sortPublications } from "../src/lib/publications";

describe("sortPublications", () => {
	it("places explicit editorial priorities before chronological records", () => {
		const result = sortPublications([
			{ id: "newest", year: "2026" },
			{ id: "second", year: "2025", priority: 2 },
			{ id: "first", year: "2024", priority: 1 },
		]);
		expect(result.map(({ id }) => id)).toEqual(["first", "second", "newest"]);
	});

	it("orders unprioritized records by descending year", () => {
		const result = sortPublications([
			{ id: "old", year: "2020" },
			{ id: "new", year: "2026" },
			{ id: "unknown" },
		]);
		expect(result.map(({ id }) => id)).toEqual(["new", "old", "unknown"]);
	});

	it("preserves source order when priority and year are equal", () => {
		const result = sortPublications([
			{ id: "a", year: "2025" },
			{ id: "b", year: "2025" },
			{ id: "c", priority: 1 },
			{ id: "d", priority: 1 },
		]);
		expect(result.map(({ id }) => id)).toEqual(["c", "d", "a", "b"]);
	});
});
