import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// GitHub Pages serves a project site under /<repo>; the custom domain serves at /.
		paths: { base: process.env.BASE_PATH ?? '', relative: false },
		prerender: {
			handleUnseenRoutes: 'ignore'
		}
	}
};

export default config;
