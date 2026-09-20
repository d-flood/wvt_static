import { createContentHandlers } from 'uncial-cms/sveltekit';
import { isEssayPath } from '$lib/site-routes.js';
import { blocks, essaySchema, isReaderPage, localContentDir, schema, siteConfig } from '../site.js';

const handlers = createContentHandlers({ config: siteConfig, blocks, schema, localContentDir });
const essayHandlers = createContentHandlers({
	config: siteConfig,
	blocks,
	schema: essaySchema,
	localContentDir
});

export const entries = () => handlers.entries().filter(isReaderPage);
export const load = async (event) => {
	const page = await (isEssayPath(event.params.path) ? essayHandlers : handlers).load(event);
	return { ...page, path: event.params.path };
};
