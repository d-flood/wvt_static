interface EssayDocument {
	meta?: {
		title?: unknown;
		date?: unknown;
		byline?: unknown;
		category?: unknown;
		summary?: unknown;
	};
}

export interface EssaySummary {
	slug: string;
	title: string;
	date: string;
	byline: string;
	category: string;
	summary: string;
}

const documents = import.meta.glob<EssayDocument>('../../content/writing/*.json', {
	eager: true,
	import: 'default'
});

/** Every Essay, newest first — the order every listing presents them in. */
export const essays: EssaySummary[] = Object.entries(documents)
	.map(([path, document]) => ({
		slug: path.split('/').at(-1)?.replace(/\.json$/, '') ?? '',
		title: String(document.meta?.title ?? 'Untitled essay'),
		date: String(document.meta?.date ?? ''),
		byline: String(document.meta?.byline ?? ''),
		category: String(document.meta?.category ?? ''),
		summary: String(document.meta?.summary ?? '')
	}))
	.sort(
		(left, right) => right.date.localeCompare(left.date) || left.title.localeCompare(right.title)
	);

export function selectEssays(mode: string, count: number, slugs: string[]): EssaySummary[] {
	if (mode === 'featured') {
		const bySlug = new Map(essays.map((essay) => [essay.slug, essay]));
		return slugs.flatMap((slug) => {
			const essay = bySlug.get(slug);
			return essay ? [essay] : [];
		}).slice(0, count);
	}

	return essays.slice(0, count);
}
