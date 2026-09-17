import siteConfig from "../content/config/site.json";
import type { PublishedLocale } from "./routing";

export interface AcronymEntry {
	acronym: string;
	expansion: string;
}

interface RawAcronymEntry {
	acronym?: unknown;
	expansion?: { pt?: unknown; en?: unknown };
}

export interface TextSegment {
	type: "text" | "acronym";
	value: string;
	expansion?: string;
}

export function localizeAcronyms(
	entries: readonly RawAcronymEntry[] | null | undefined,
	locale: PublishedLocale,
): AcronymEntry[] {
	return (entries ?? []).flatMap((entry) => {
		const acronym =
			typeof entry.acronym === "string" ? entry.acronym.trim() : "";
		const localized =
			locale === "en" ? entry.expansion?.en : entry.expansion?.pt;
		const expansion = typeof localized === "string" ? localized.trim() : "";
		return acronym && expansion ? [{ acronym, expansion }] : [];
	});
}

export function configuredAcronyms(locale: PublishedLocale): AcronymEntry[] {
	return localizeAcronyms(
		(siteConfig as { acronyms?: RawAcronymEntry[] }).acronyms,
		locale,
	);
}

function isWordCharacter(character: string | undefined): boolean {
	return Boolean(character && /[\p{L}\p{N}_]/u.test(character));
}

export function segmentAcronyms(
	text: string,
	entries: readonly AcronymEntry[],
): TextSegment[] {
	const ordered = [...entries]
		.filter(({ acronym, expansion }) => acronym && expansion)
		.sort((a, b) => b.acronym.length - a.acronym.length);
	if (!text || !ordered.length) return [{ type: "text", value: text }];

	const segments: TextSegment[] = [];
	let cursor = 0;
	while (cursor < text.length) {
		const entry = ordered.find(({ acronym }) => {
			if (!text.startsWith(acronym, cursor)) return false;
			const before = text[cursor - 1];
			const after = text[cursor + acronym.length];
			return !isWordCharacter(before) && !isWordCharacter(after);
		});
		if (!entry) {
			const previous = segments.at(-1);
			if (previous?.type === "text") previous.value += text[cursor];
			else segments.push({ type: "text", value: text[cursor] });
			cursor += 1;
			continue;
		}
		segments.push({
			type: "acronym",
			value: entry.acronym,
			expansion: entry.expansion,
		});
		cursor += entry.acronym.length;
	}
	return segments;
}

type RichNode = Record<string, unknown> & {
	type?: string;
	children?: RichNode[];
};

export function transformRichTextAcronyms(
	content: unknown,
	entries: readonly AcronymEntry[],
): unknown {
	const transform = (node: unknown): unknown => {
		if (Array.isArray(node)) return node.flatMap(transform);
		if (!node || typeof node !== "object") return node;
		const richNode = node as RichNode;
		if (richNode.type === "mdxJsxTextElement" && richNode.name === "acronym")
			return richNode;
		if (richNode.type === "text" && typeof richNode.text === "string") {
			const marks = Object.fromEntries(
				Object.entries(richNode).filter(
					([key]) => key !== "type" && key !== "text",
				),
			);
			return segmentAcronyms(richNode.text, entries).map((segment) =>
				segment.type === "text"
					? { type: "text", text: segment.value, ...marks }
					: {
							type: "mdxJsxTextElement",
							name: "acronym",
							props: {
								acronym: segment.value,
								expansion: segment.expansion,
								...marks,
							},
							children: [],
						},
			);
		}
		return richNode.children
			? { ...richNode, children: richNode.children.flatMap(transform) }
			: richNode;
	};
	return transform(content);
}
