import { createContentHandlers } from 'uncial-cms/sveltekit';
import { isEssayPath } from '$lib/site-routes.js';
import { blocks, essaySchema, isReaderPage, schema, site } from '../site.js';

const handlers = createContentHandlers({
	site,
	blocks,
	schema: (path) => (isEssayPath(path) ? essaySchema : schema),
	exclude: ({ path }) => !isReaderPage({ path })
});

export const entries = handlers.entries;
export const load = handlers.load;
