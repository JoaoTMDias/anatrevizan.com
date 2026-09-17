import { mkdir, mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	renderPublication,
	replaceSnapshotAtomically,
} from "../scripts/sync-orcid";
import {
	applyPublicationOverlays,
	normalizeDoi,
	publicationsFromOrcid,
	selectWorkSummary,
} from "../src/lib/publications";

const externalId = (type: string, value: string) => ({
	"external-id-type": type,
	"external-id-value": value,
});

const summary = (overrides: Record<string, unknown> = {}) => ({
	"put-code": 42,
	"display-index": "0",
	title: { title: { value: "A valid work" } },
	type: "journal-article",
	"publication-date": { year: { value: "2026" } },
	"journal-title": { value: "Journal" },
	url: { value: "https://example.com/work" },
	"external-ids": { "external-id": [] },
	source: { "source-name": { value: "Researcher" } },
	...overrides,
});

const response = (
	groups: Array<Record<string, unknown>> = [
		{
			"external-ids": { "external-id": [] },
			"work-summary": [summary()],
		},
	],
) => ({ group: groups });

describe("ORCID publication transformation", () => {
	it("normalizes DOI identity and always prefers its canonical HTTPS URL", () => {
		const input = response([
			{
				"external-ids": {
					"external-id": [externalId("doi", "HTTPS://DOI.ORG/10.1000/ABC")],
				},
				"work-summary": [
					summary({ url: { value: "https://elsewhere.example/work" } }),
				],
			},
		]);
		expect(normalizeDoi("doi: 10.1000/ABC")).toBe("10.1000/abc");
		expect(publicationsFromOrcid(input)[0]).toMatchObject({
			sourceId: "doi:10.1000/abc",
			doi: "10.1000/abc",
			url: "https://doi.org/10.1000/abc",
		});
	});

	it("falls back to a group external identifier and then put-code", () => {
		const withExternal = publicationsFromOrcid(
			response([
				{
					"external-ids": {
						"external-id": [externalId("source-work-id", "ABC-1")],
					},
					"work-summary": [summary()],
				},
			]),
		)[0];
		const withPutCode = publicationsFromOrcid(response())[0];
		expect(withExternal.sourceId).toBe("external:source-work-id:abc-1");
		expect(withPutCode.sourceId).toBe("put:42");
	});

	it("selects duplicate summaries by display-index and deterministic put-code", () => {
		const group = response([
			{
				"external-ids": { "external-id": [] },
				"work-summary": [
					summary({
						"put-code": 90,
						"display-index": "1",
						title: { title: { value: "Later put-code" } },
					}),
					summary({
						"put-code": 12,
						"display-index": "1",
						title: { title: { value: "Chosen" } },
					}),
					summary({ "put-code": 1, "display-index": "0" }),
				],
			},
		]).group[0];
		expect(selectWorkSummary(group as never)["put-code"]).toBe(12);
		expect(publicationsFromOrcid({ group: [group] })[0].title).toBe("Chosen");
	});

	it("accepts every non-empty ORCID work type and rejects malformed or empty snapshots", () => {
		expect(publicationsFromOrcid(response())[0].type).toBe("journal-article");
		expect(() => publicationsFromOrcid({ group: [] })).toThrow();
		expect(() =>
			publicationsFromOrcid({
				group: [{ "external-ids": { "external-id": [] }, "work-summary": [] }],
			}),
		).toThrow();
		expect(() =>
			publicationsFromOrcid(
				response([
					{
						"external-ids": { "external-id": [] },
						"work-summary": [summary({ title: null })],
					},
				]),
			),
		).toThrow();
	});

	it("rejects stable identity collisions before files can be updated", () => {
		const duplicated = {
			"external-ids": { "external-id": [externalId("doi", "10.1000/same")] },
			"work-summary": [summary()],
		};
		expect(() =>
			publicationsFromOrcid(response([duplicated, duplicated])),
		).toThrow(/collision/);
	});

	it("accepts only HTTPS fallback URLs and omits invalid links", () => {
		const [http, invalid] = publicationsFromOrcid(
			response([
				{
					"external-ids": { "external-id": [] },
					"work-summary": [
						summary({ "put-code": 1, url: { value: "http://example.com" } }),
					],
				},
				{
					"external-ids": { "external-id": [] },
					"work-summary": [
						summary({ "put-code": 2, url: { value: "not a URL" } }),
					],
				},
			]),
		);
		expect(http.url).toBeUndefined();
		expect(invalid.url).toBeUndefined();
	});

	it("preserves only the optional editorial overlay by sourceId", () => {
		const base = publicationsFromOrcid(response());
		const result = applyPublicationOverlays(
			base,
			new Map([
				[
					"put:42",
					{
						language: "EN",
						topics: ["EUDR"],
						highlight: "Reviewed",
						priority: 2,
					},
				],
			]),
		);
		expect(result[0]).toMatchObject({
			language: "EN",
			topics: ["EUDR"],
			highlight: "Reviewed",
			priority: 2,
		});
		expect(result[0].title).toBe("A valid work");
	});

	it("generates deterministic Markdown with an empty body", () => {
		const publication = {
			...publicationsFromOrcid(response())[0],
			language: "EN",
			priority: 1,
		};
		const first = renderPublication(publication);
		expect(renderPublication(publication)).toBe(first);
		expect(first).toContain("sourceId: put:42");
		expect(first.endsWith("---\n")).toBe(true);
	});

	it("replaces a complete snapshot atomically and removes stale files", async () => {
		const root = await mkdtemp(join(tmpdir(), "orcid-atomic-"));
		const directory = join(root, "publications");
		await mkdir(directory);
		await writeFile(join(directory, "stale.md"), "stale", "utf8");
		await replaceSnapshotAtomically(
			new Map([
				["one.md", "one"],
				["two.md", "two"],
			]),
			directory,
		);
		expect((await readdir(directory)).sort()).toEqual(["one.md", "two.md"]);
		expect(await readFile(join(directory, "one.md"), "utf8")).toBe("one");
	});
});
