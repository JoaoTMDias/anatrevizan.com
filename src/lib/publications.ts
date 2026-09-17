import { z } from "zod";

export interface Publication {
	sourceId: string;
	orcidPutCode: number;
	title: string;
	journal?: string;
	year?: string;
	type: string;
	doi?: string;
	url?: string;
	source: string;
	language?: string;
	topics?: string[];
	highlight?: string;
	priority?: number;
}

export type PublicationOverlay = Pick<
	Publication,
	"language" | "topics" | "highlight" | "priority"
>;

const valueSchema = z.object({ value: z.string() });
const nullableValueSchema = valueSchema.nullable().optional();
const externalIdSchema = z.object({
	"external-id-type": z.string().min(1),
	"external-id-value": z.string().min(1),
	"external-id-normalized": nullableValueSchema,
	"external-id-url": nullableValueSchema,
});
const externalIdsSchema = z.object({
	"external-id": z.array(externalIdSchema),
});
const workSummarySchema = z.object({
	"put-code": z.number().int().nonnegative(),
	"display-index": z.string().regex(/^\d+$/),
	title: z.object({ title: valueSchema }),
	type: z.string().min(1),
	"publication-date": z
		.object({ year: nullableValueSchema })
		.nullable()
		.optional(),
	"journal-title": nullableValueSchema,
	url: nullableValueSchema,
	"external-ids": externalIdsSchema,
	source: z.object({ "source-name": nullableValueSchema }),
});
const workGroupSchema = z.object({
	"external-ids": externalIdsSchema,
	"work-summary": z.array(workSummarySchema).min(1),
});
export const orcidWorksSchema = z.object({
	group: z.array(workGroupSchema).min(1),
});

export type OrcidWorksResponse = z.infer<typeof orcidWorksSchema>;
type OrcidWorkGroup = OrcidWorksResponse["group"][number];
type OrcidWorkSummary = OrcidWorkGroup["work-summary"][number];

const clean = (value: string | null | undefined) => value?.trim() || undefined;

export function normalizeDoi(
	value: string | null | undefined,
): string | undefined {
	const normalized = clean(value)
		?.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
		.replace(/^doi:\s*/i, "")
		.trim()
		.toLowerCase();
	return normalized?.startsWith("10.") ? normalized : undefined;
}

function externalIds(group: OrcidWorkGroup, summary: OrcidWorkSummary) {
	return [
		...group["external-ids"]["external-id"],
		...summary["external-ids"]["external-id"],
	];
}

function doiFor(group: OrcidWorkGroup, summary: OrcidWorkSummary) {
	for (const id of externalIds(group, summary)) {
		if (id["external-id-type"].toLowerCase() !== "doi") continue;
		const doi = normalizeDoi(
			id["external-id-normalized"]?.value ?? id["external-id-value"],
		);
		if (doi) return doi;
	}
}

function groupExternalId(group: OrcidWorkGroup) {
	return group["external-ids"]["external-id"]
		.map((id) => {
			const type = clean(id["external-id-type"])?.toLowerCase();
			const value = clean(
				id["external-id-normalized"]?.value ?? id["external-id-value"],
			)?.toLowerCase();
			return type && value ? `${type}:${value}` : undefined;
		})
		.filter((value): value is string => Boolean(value))
		.sort()[0];
}

export function selectWorkSummary(group: OrcidWorkGroup): OrcidWorkSummary {
	return [...group["work-summary"]].sort((a, b) => {
		const display =
			Number.parseInt(b["display-index"], 10) -
			Number.parseInt(a["display-index"], 10);
		return display || a["put-code"] - b["put-code"];
	})[0];
}

export function publicationSourceId(
	group: OrcidWorkGroup,
	summary = selectWorkSummary(group),
): string {
	const doi = doiFor(group, summary);
	if (doi) return `doi:${doi}`;
	const externalId = groupExternalId(group);
	return externalId ? `external:${externalId}` : `put:${summary["put-code"]}`;
}

export function publicationUrl(
	group: OrcidWorkGroup,
	summary = selectWorkSummary(group),
): string | undefined {
	const doi = doiFor(group, summary);
	if (doi) return `https://doi.org/${doi}`;
	const candidate = clean(summary.url?.value);
	if (!candidate) return undefined;
	try {
		const url = new URL(candidate);
		return url.protocol === "https:" ? url.toString() : undefined;
	} catch {
		return undefined;
	}
}

export function publicationsFromOrcid(input: unknown): Publication[] {
	const { group } = orcidWorksSchema.parse(input);
	const publications = group.map((item) => {
		const summary = selectWorkSummary(item);
		const sourceId = publicationSourceId(item, summary);
		const doi = doiFor(item, summary);
		const title = summary.title.title.value.trim();
		if (!title)
			throw new Error(`ORCID work ${summary["put-code"]} has an empty title`);
		return {
			sourceId,
			orcidPutCode: summary["put-code"],
			title,
			journal: clean(summary["journal-title"]?.value),
			year: clean(summary["publication-date"]?.year?.value),
			type: summary.type,
			doi,
			url: publicationUrl(item, summary),
			source: clean(summary.source["source-name"]?.value) ?? "ORCID",
		} satisfies Publication;
	});
	const ids = new Set<string>();
	for (const publication of publications) {
		if (ids.has(publication.sourceId))
			throw new Error(`ORCID sourceId collision: ${publication.sourceId}`);
		ids.add(publication.sourceId);
	}
	return publications;
}

export function applyPublicationOverlays(
	publications: readonly Publication[],
	overlays: ReadonlyMap<string, PublicationOverlay>,
): Publication[] {
	return publications.map((publication) => ({
		...publication,
		...overlays.get(publication.sourceId),
	}));
}

const numericYear = (year: string | null | undefined) => {
	const parsed = Number.parseInt(year ?? "", 10);
	return Number.isFinite(parsed) ? parsed : 0;
};

export function sortPublications<
	T extends Pick<Publication, "priority" | "year">,
>(publications: readonly T[]): T[] {
	return publications
		.map((publication, index) => ({ publication, index }))
		.sort((a, b) => {
			const aPriority = a.publication.priority;
			const bPriority = b.publication.priority;
			if (aPriority != null && bPriority != null)
				return aPriority - bPriority || a.index - b.index;
			if (aPriority != null) return -1;
			if (bPriority != null) return 1;
			return (
				numericYear(b.publication.year) - numericYear(a.publication.year) ||
				a.index - b.index
			);
		})
		.map(({ publication }) => publication);
}

export function selectHomePublications<T extends Publication>(
	publications: readonly T[],
	limit = 3,
): T[] {
	if (limit <= 0) return [];
	const newest = [...publications]
		.map((publication, index) => ({ publication, index }))
		.sort(
			(a, b) =>
				numericYear(b.publication.year) - numericYear(a.publication.year) ||
				b.publication.orcidPutCode - a.publication.orcidPutCode ||
				a.index - b.index,
		)
		.map(({ publication }) => publication);
	const selected = newest.slice(0, 1);
	const selectedIds = new Set(selected.map(({ sourceId }) => sourceId));
	const prioritized = publications
		.filter(
			({ priority, sourceId }) =>
				priority != null && !selectedIds.has(sourceId),
		)
		.map((publication, index) => ({ publication, index }))
		.sort(
			(a, b) =>
				(a.publication.priority ?? 0) - (b.publication.priority ?? 0) ||
				a.index - b.index,
		)
		.map(({ publication }) => publication);
	for (const publication of prioritized) {
		if (selected.length >= limit) break;
		selected.push(publication);
		selectedIds.add(publication.sourceId);
	}
	for (const publication of newest) {
		if (selected.length >= limit) break;
		if (!selectedIds.has(publication.sourceId)) selected.push(publication);
	}
	return selected;
}
