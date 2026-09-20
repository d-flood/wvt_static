import { base } from '$app/paths';
import { env } from '$env/dynamic/public';

// The canonical origin the built pages are served from. Overridden in CI so a
// deploy to the default GitHub Pages URL does not claim the custom domain.
const origin = env.PUBLIC_SITE_ORIGIN || 'https://www.wevalueteens.com';

const descriptions: Record<string, string> = {
	'/': 'A free, supervised place for teenagers in Edgerton, Wisconsin, serving the community since 1993.',
	'/the-teen-center/': 'Visit the free Edgerton Teen Center for supervised Friday and Saturday evenings for ages 13 and up.',
	'/programs/': 'Explore the six free Programs available to teenagers through We Value Teens.',
	'/start-a-teen-center/': 'Practical guidance drawn from more than thirty years of building and running a community teen center.',
	'/writing/': 'Twenty-six Essays by Dave Flood on adolescence, ministry, culture, and the work of the Edgerton Teen Center.',
	'/about/': 'Meet the people behind We Value Teens and learn about its mission, history, board, and volunteers.',
	'/give/': 'Support the free Programs and supervised weekends at the Edgerton Teen Center.',
	'/search/': 'Search We Value Teens pages and Essays.'
};

export const defaultSocialImage = '/uploads/dbfa6f2de87d04cf68f66580b716498b.webp';
export const defaultSocialImageAlt =
	'Teenagers playing games during a Halloween event at the Edgerton Teen Center';

export function canonicalPath(value: unknown): string {
	const path = String(value ?? '').replace(/^\/+|\/+$/g, '');
	return path === '' || path === 'index' ? '/' : `/${path}/`;
}

export function pageDescription(path: string, summary: unknown): string {
	const essaySummary = String(summary ?? '').trim();
	return essaySummary || descriptions[path] || `Learn more about ${path.replaceAll('/', ' ').trim()} from We Value Teens.`;
}

function findSocialImage(document: unknown): string | undefined {
	if (Array.isArray(document)) {
		for (const item of document) {
			const found = findSocialImage(item);
			if (found) return found;
		}
		return undefined;
	}
	if (!document || typeof document !== 'object') return undefined;
	const value = document as Record<string, unknown>;
	for (const key of ['image', 'portrait']) {
		if (typeof value[key] === 'string' && value[key].startsWith('/uploads/')) return value[key];
	}
	for (const child of Object.values(value)) {
		const found = findSocialImage(child);
		if (found) return found;
	}
	return undefined;
}

export function socialImage(document: unknown): string {
	return findSocialImage(document) ?? defaultSocialImage;
}

export function absoluteUrl(path: string): string {
	return `${origin}${base}${path}`;
}
