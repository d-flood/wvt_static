import { createEditorHandlers } from 'uncial-cms/sveltekit';
import { blocks, isEditablePage, localContentDir, schema, siteConfig } from '../../site.js';

const handlers = createEditorHandlers({
	config: siteConfig,
	blocks,
	schema,
	localContentDir
});

export const entries = () => handlers.entries().filter(isEditablePage);
export const load = handlers.load;
