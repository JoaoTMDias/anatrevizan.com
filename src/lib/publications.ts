export interface OrderablePublication {
	priority?: number | null;
	year?: string | null;
}

const numericYear = (year: string | null | undefined) => {
	const parsed = Number.parseInt(year ?? "", 10);
	return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Applies the editorial overlay used by the reference implementation.
 * Prioritized records come first, followed by descending year; ties preserve
 * the source order so a future ORCID snapshot remains deterministic.
 */
export function sortPublications<T extends OrderablePublication>(
	publications: readonly T[],
): T[] {
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
