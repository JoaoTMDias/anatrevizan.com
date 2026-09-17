import { describe, expect, it } from "vitest";
import {
	type Publication,
	selectHomePublications,
	sortPublications,
} from "../src/lib/publications";

const publication = (
	sourceId: string,
	year: string,
	priority?: number,
): Publication => ({
	sourceId,
	orcidPutCode: Number(sourceId.replace(/\D/g, "")) || 1,
	title: sourceId,
	year,
	type: "journal-article",
	source: "ORCID",
	priority,
});

describe("sortPublications", () => {
	it("places explicit editorial priorities before chronological records", () => {
		const result = sortPublications([
			publication("newest", "2026"),
			publication("second", "2025", 2),
			publication("first", "2024", 1),
		]);
		expect(result.map(({ sourceId }) => sourceId)).toEqual([
			"first",
			"second",
			"newest",
		]);
	});

	it("orders unprioritized records by descending year", () => {
		const result = sortPublications([
			publication("old", "2020"),
			publication("new", "2026"),
			publication("unknown", ""),
		]);
		expect(result.map(({ sourceId }) => sourceId)).toEqual([
			"new",
			"old",
			"unknown",
		]);
	});

	it("preserves source order when priority and year are equal", () => {
		const result = sortPublications([
			publication("a", "2025"),
			publication("b", "2025"),
			publication("c", "2024", 1),
			publication("d", "2024", 1),
		]);
		expect(result.map(({ sourceId }) => sourceId)).toEqual([
			"c",
			"d",
			"a",
			"b",
		]);
	});
});

describe("selectHomePublications", () => {
	it("uses the newest work followed by the two best priorities without duplicates", () => {
		const result = selectHomePublications([
			publication("priority-one", "2024", 1),
			publication("priority-two", "2025", 2),
			publication("newest", "2026"),
			publication("older", "2023"),
		]);
		expect(result.map(({ sourceId }) => sourceId)).toEqual([
			"newest",
			"priority-one",
			"priority-two",
		]);
	});

	it("does not duplicate the newest work when it is also prioritized", () => {
		const result = selectHomePublications([
			publication("newest-priority", "2026", 1),
			publication("other-priority", "2024", 2),
			publication("fallback", "2025"),
		]);
		expect(result.map(({ sourceId }) => sourceId)).toEqual([
			"newest-priority",
			"other-priority",
			"fallback",
		]);
	});

	it("fills empty priority slots with the next newest works", () => {
		const result = selectHomePublications([
			publication("old", "2023"),
			publication("newest", "2026"),
			publication("middle", "2025"),
		]);
		expect(result.map(({ sourceId }) => sourceId)).toEqual([
			"newest",
			"middle",
			"old",
		]);
	});
});
