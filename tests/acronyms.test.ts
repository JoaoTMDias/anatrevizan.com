import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	localizeAcronyms,
	segmentAcronyms,
	transformRichTextAcronyms,
} from "../src/lib/acronyms.ts";

const entries = [
	{ acronym: "EU", expansion: "European Union" },
	{ acronym: "EUDR", expansion: "European Union Deforestation Regulation" },
	{ acronym: "NIF", expansion: "Número de Identificação Fiscal" },
];

describe("glossário de siglas", () => {
	it("declara a relação APG e o popover hint nativo", async () => {
		const component = await readFile(
			join(
				process.cwd(),
				"src/components/editorial/Acronym.astro",
			),
			"utf8",
		);
		expect(component).toContain("<abbr");
		expect(component).toContain('tabindex="0"');
		expect(component).toContain("aria-describedby={tooltipId}");
		expect(component).toContain('role="tooltip"');
		expect(component).toContain('popover="hint"');
		expect(component).toContain("id={tooltipId}");
	});

	it("reconhece termos completos, pontuação e todas as ocorrências", () => {
		expect(segmentAcronyms("EUDR, NIF e EUDR.", entries)).toEqual([
			{
				type: "acronym",
				value: "EUDR",
				expansion: "European Union Deforestation Regulation",
			},
			{ type: "text", value: ", " },
			{
				type: "acronym",
				value: "NIF",
				expansion: "Número de Identificação Fiscal",
			},
			{ type: "text", value: " e " },
			{
				type: "acronym",
				value: "EUDR",
				expansion: "European Union Deforestation Regulation",
			},
			{ type: "text", value: "." },
		]);
	});

	it("é sensível a maiúsculas e não substitui dentro de palavras", () => {
		expect(segmentAcronyms("eudr PSEUDR EUDR2", entries)).toEqual([
			{ type: "text", value: "eudr PSEUDR EUDR2" },
		]);
	});

	it("usa a expansão do locale sem fallback", () => {
		const raw = [
			{ acronym: "NIF", expansion: { pt: "Número fiscal", en: "" } },
		];
		expect(localizeAcronyms(raw, "pt-PT")).toEqual([
			{ acronym: "NIF", expansion: "Número fiscal" },
		]);
		expect(localizeAcronyms(raw, "en")).toEqual([]);
	});

	it("preserva estrutura e marcas do rich text", () => {
		const content = {
			type: "root",
			children: [
				{
					type: "p",
					children: [{ type: "text", text: "Sobre EUDR.", bold: true }],
				},
			],
		};
		const transformed = transformRichTextAcronyms(
			content,
			entries,
		) as typeof content;
		expect(transformed.children[0].type).toBe("p");
		expect(transformed.children[0].children).toEqual([
			{ type: "text", text: "Sobre ", bold: true },
			{
				type: "mdxJsxTextElement",
				name: "acronym",
				props: {
					acronym: "EUDR",
					expansion: "European Union Deforestation Regulation",
					bold: true,
				},
				children: [],
			},
			{ type: "text", text: ".", bold: true },
		]);
	});
});
