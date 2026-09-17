import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const config = defineCollection({
	loader: glob({ pattern: "**/*.json", base: "src/content/config" }),
});

const publications = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "src/content/publications" }),
	schema: z.object({
		sourceId: z.string().min(1),
		orcidPutCode: z.number().int().nonnegative(),
		title: z.string().min(1),
		journal: z.string().optional(),
		year: z
			.string()
			.regex(/^\d{4}$/)
			.optional(),
		type: z.string().min(1),
		doi: z.string().optional(),
		url: z.url().optional(),
		source: z.string().min(1),
		language: z.string().optional(),
		topics: z.array(z.string()).optional(),
		highlight: z.string().optional(),
		priority: z.number().int().positive().optional(),
	}),
});

export const collections = { config, publications };
