import { base } from '$app/paths';
import siteDocument from '../../content/site.json';
import type { SiteData } from '$lib/site-data.js';
import { isEssayPath } from '$lib/site-routes.js';

// An Editor variant is the same page as its reader route with `/edit/` appended,
// so it takes the ground of the page it is editing: the editor sees the essay on
// the cream it will be read on, and the Writing index on ink.
function readingGround(pathname: string): boolean {
	const path = pathname.replace(/^\/+|\/+$/g, '').replace(/(^|\/)edit$/, '');
	return path === 'start-a-teen-center' || isEssayPath(path);
}

export const load = ({ url }) => ({
	site: siteDocument.meta satisfies SiteData,
	ground: readingGround(url.pathname.slice(base.length)) ? 'cream' : 'ink'
});
