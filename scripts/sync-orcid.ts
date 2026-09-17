import { createHash } from "node:crypto";
import {
	mkdir,
	readdir,
	readFile,
	rename,
	rm,
	writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse, stringify } from "yaml";
import {
	applyPublicationOverlays,
	type Publication,
	type PublicationOverlay,
	publicationsFromOrcid,
} from "../src/lib/publications.ts";

const ORCID_ID = "0000-0003-4365-6053";
const TOKEN_URL = "https://orcid.org/oauth/token";
const WORKS_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;
const targetDirectory = resolve("src/content/publications");
const args = new Set(process.argv.slice(2));
const mode = args.has("--mode=strict") ? "strict" : "build";
const allowAnonymous = args.has("--allow-anonymous");
const statsArgument = process.argv.find((argument) =>
	argument.startsWith("--stats-file="),
);

export interface SyncStats {
	added: number;
	updated: number;
	removed: number;
	withoutUrl: number;
	total: number;
}

const frontmatter = (source: string) => {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	if (!match)
		throw new Error("Markdown publication is missing YAML frontmatter");
	return parse(match[1]) as Record<string, unknown>;
};

const overlayFrom = (value: Record<string, unknown>): PublicationOverlay => ({
	...(typeof value.language === "string" && value.language
		? { language: value.language }
		: {}),
	...(Array.isArray(value.topics) &&
	value.topics.every((topic) => typeof topic === "string")
		? { topics: value.topics as string[] }
		: {}),
	...(typeof value.highlight === "string" && value.highlight
		? { highlight: value.highlight }
		: {}),
	...(typeof value.priority === "number" ? { priority: value.priority } : {}),
});

async function existingMarkdown(directory = targetDirectory) {
	const files = await readdir(directory).catch(() => [] as string[]);
	const entries = await Promise.all(
		files
			.filter((file) => file.endsWith(".md"))
			.map(
				async (file) =>
					[file, await readFile(join(directory, file), "utf8")] as const,
			),
	);
	return new Map(entries);
}

async function loadOverlays(existing: Map<string, string>) {
	const overlays = new Map<string, PublicationOverlay>();
	for (const source of existing.values()) {
		const data = frontmatter(source);
		if (typeof data.sourceId !== "string")
			throw new Error("Existing publication has no sourceId");
		overlays.set(data.sourceId, overlayFrom(data));
	}
	return overlays;
}

const filenameFor = (publication: Publication) => {
	const hash = createHash("sha256")
		.update(publication.sourceId)
		.digest("hex")
		.slice(0, 10);
	return `orcid-${hash}.md`;
};

export function renderPublication(publication: Publication) {
	const data = {
		sourceId: publication.sourceId,
		orcidPutCode: publication.orcidPutCode,
		title: publication.title,
		...(publication.journal ? { journal: publication.journal } : {}),
		...(publication.year ? { year: publication.year } : {}),
		type: publication.type,
		...(publication.doi ? { doi: publication.doi } : {}),
		...(publication.url ? { url: publication.url } : {}),
		source: publication.source,
		...(publication.language ? { language: publication.language } : {}),
		...(publication.topics?.length ? { topics: publication.topics } : {}),
		...(publication.highlight ? { highlight: publication.highlight } : {}),
		...(publication.priority != null ? { priority: publication.priority } : {}),
	};
	return `---\n${stringify(data, { lineWidth: 0 }).trimEnd()}\n---\n`;
}

async function token() {
	const clientId = process.env.ORCID_CLIENT_ID;
	const clientSecret = process.env.ORCID_CLIENT_SECRET;
	if (!clientId || !clientSecret) return undefined;
	const response = await fetch(TOKEN_URL, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: "client_credentials",
			scope: "/read-public",
		}),
		signal: AbortSignal.timeout(15_000),
	});
	if (!response.ok)
		throw new Error(`ORCID token request failed (${response.status})`);
	const payload = (await response.json()) as { access_token?: unknown };
	if (typeof payload.access_token !== "string" || !payload.access_token)
		throw new Error("ORCID token response is invalid");
	return payload.access_token;
}

async function fetchWorks(accessToken?: string) {
	const response = await fetch(WORKS_URL, {
		headers: {
			Accept: "application/vnd.orcid+json",
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
		},
		signal: AbortSignal.timeout(20_000),
	});
	if (!response.ok)
		throw new Error(`ORCID works request failed (${response.status})`);
	return response.json();
}

function statsFor(
	current: Map<string, string>,
	next: Map<string, string>,
	publications: Publication[],
): SyncStats {
	let added = 0;
	let updated = 0;
	for (const [file, source] of next) {
		if (!current.has(file)) added++;
		else if (current.get(file) !== source) updated++;
	}
	return {
		added,
		updated,
		removed: [...current.keys()].filter((file) => !next.has(file)).length,
		withoutUrl: publications.filter(({ url }) => !url).length,
		total: publications.length,
	};
}

export async function replaceSnapshotAtomically(
	files: ReadonlyMap<string, string>,
	directory = targetDirectory,
) {
	const parent = dirname(directory);
	const temporary = join(parent, `.publications-${process.pid}.tmp`);
	const backup = join(parent, `.publications-${process.pid}.backup`);
	await rm(temporary, { recursive: true, force: true });
	await rm(backup, { recursive: true, force: true });
	await mkdir(temporary, { recursive: true });
	for (const [file, source] of files)
		await writeFile(join(temporary, file), source, "utf8");
	let hadTarget = true;
	try {
		await rename(directory, backup);
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
		hadTarget = false;
	}
	try {
		await rename(temporary, directory);
	} catch (error) {
		if (hadTarget) await rename(backup, directory);
		throw error;
	}
	if (hadTarget) await rm(backup, { recursive: true, force: true });
}

async function writeStats(stats: SyncStats) {
	const message = `ORCID sync: ${stats.added} added, ${stats.updated} updated, ${stats.removed} removed, ${stats.withoutUrl} without URL (${stats.total} total).`;
	console.log(message);
	if (statsArgument)
		await writeFile(
			resolve(statsArgument.split("=").slice(1).join("=")),
			`${JSON.stringify(stats, null, 2)}\n`,
			"utf8",
		);
}

export async function synchronize() {
	const existing = await existingMarkdown();
	const accessToken = await token();
	if (!accessToken && !allowAnonymous)
		throw new Error("ORCID_CLIENT_ID and ORCID_CLIENT_SECRET are required");
	const publications = publicationsFromOrcid(await fetchWorks(accessToken));
	const overlays = await loadOverlays(existing);
	const merged = applyPublicationOverlays(publications, overlays);
	const files = new Map(
		merged.map((publication) => [
			filenameFor(publication),
			renderPublication(publication),
		]),
	);
	if (files.size !== publications.length)
		throw new Error("Generated publication filename collision");
	const stats = statsFor(existing, files, merged);
	await replaceSnapshotAtomically(files);
	await writeStats(stats);
	return stats;
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	try {
		await synchronize();
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (mode === "build")
			console.warn(`[orcid] ${message}; using committed Markdown snapshot.`);
		else {
			console.error(`[orcid] ${message}`);
			process.exitCode = 1;
		}
	}
}
