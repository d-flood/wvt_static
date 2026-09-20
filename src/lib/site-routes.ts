/** The site's internal routes: the link enum offered to editors, and the shape of an Essay path. */

interface ContentMeta {
	title?: unknown;
}

/** The curated navigation, in the order it is presented. */
export const SITE_ROUTES = [
	{ value: '/', label: 'Home' },
	{ value: '/the-teen-center/', label: 'The Teen Center' },
	{ value: '/programs/', label: 'Programs' },
	{ value: '/start-a-teen-center/', label: 'Start a Teen Center' },
	{ value: '/writing/', label: 'Writing' },
	{ value: '/about/', label: 'About' },
	{ value: '/give/', label: 'Give' }
] as const;

// site.json and the image manifest are Content documents that back site-wide
// data rather than a page of their own, so neither is a link target.
const metas = import.meta.glob<ContentMeta>(
	[
		'../../content/**/*.json',
		'!../../content/site.json',
		'!../../content/image-manifest.json'
	],
	{ eager: true, import: 'meta' }
);

function routeFor(path: string): string {
	const slug = path.replace(/^.*\/content\//, '').replace(/\.json$/, '');
	return slug === 'index' ? '/' : `/${slug}/`;
}

const curated = new Set<string>(SITE_ROUTES.map((route) => route.value));

const generated = Object.entries(metas)
	.map(([path, meta]) => ({ value: routeFor(path), label: String(meta?.title ?? routeFor(path)) }))
	.filter((route) => !curated.has(route.value))
	.sort((left, right) => left.value.localeCompare(right.value));

export const LINK_OPTIONS = [
	...SITE_ROUTES,
	...generated,
	{ value: 'external', label: 'External URL' }
];

export const LINK_VALUES = new Set<string>(LINK_OPTIONS.map((option) => option.value));

export function resolveBlockLink(link: string, externalUrl: string): string {
	return link === 'external' ? externalUrl : link;
}

/** An Essay lives one level under /writing/; the Writing index itself does not. */
export function isEssayPath(path: string): boolean {
	return /^writing\/[^/]+$/.test(path.replace(/^\/+|\/+$/g, ''));
}
