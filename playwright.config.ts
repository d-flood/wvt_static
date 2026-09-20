import { defineConfig } from '@playwright/test';

const port = process.env.E2E_PORT ?? '41732';

export default defineConfig({
	testDir: 'e2e',
	webServer: {
		command: `pnpm run build && pnpm exec vite dev --host 127.0.0.1 --port ${port}`,
		url: `http://127.0.0.1:${port}/the-teen-center/`,
		timeout: 180_000
	},
	use: { baseURL: `http://127.0.0.1:${port}` }
});
