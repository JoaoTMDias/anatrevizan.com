import { missingLocalizedPaths } from "../src/lib/bilingual";

export function incompleteEnglishWarning(
	values: Record<string, unknown>,
): string | null {
	const missing = missingLocalizedPaths(values, "en");
	if (missing.length === 0) return null;

	const fields = missing.length === 1 ? "1 campo" : `${missing.length} campos`;
	return `A tradução inglesa está incompleta (${fields} por preencher). A página será guardada, mas a versão EN não será publicada até ficar completa.`;
}
