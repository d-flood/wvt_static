import { createEditorHandlers } from 'uncial-cms/sveltekit';
import { blocks, isEditablePage, schema, site } from '../../site.js';

const handlers = createEditorHandlers({
	site,
	blocks,
	schema,
	exclude: ({ path }) => !isEditablePage({ path })
});

export const entries = handlers.entries;
export const load = handlers.load;
