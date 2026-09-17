import { getCollection } from "astro:content";
import type { Publication } from "./publications";

export async function getPublications(): Promise<Publication[]> {
	const entries = await getCollection("publications");
	return entries
		.sort((a, b) => a.id.localeCompare(b.id))
		.map(({ data }) => ({
			sourceId: data.sourceId,
			orcidPutCode: data.orcidPutCode,
			title: data.title,
			journal: data.journal,
			year: data.year,
			type: data.type,
			doi: data.doi,
			url: data.url,
			source: data.source,
			language: data.language,
			topics: data.topics,
			highlight: data.highlight,
			priority: data.priority,
		}));
}
