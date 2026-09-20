export const ESSAY_CATEGORIES = [
	'Adolescent mental health & social media',
	'Gospel & mission',
	'Theological tradition & culture',
	'Listening & dialogue',
	'Safeguarding',
	'The teen center'
] as const;

export function categorySlug(category: string): string {
	return category
		.toLowerCase()
		.replaceAll('&', 'and')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
