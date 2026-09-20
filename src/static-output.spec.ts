import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { legacyRoutes } from '../scripts/legacy-routes.mjs';

const root = resolve(import.meta.dirname, '..');
const build = resolve(root, 'build');

function builtPage(route: string): string {
	return route === '/' ? join(build, 'index.html') : join(build, route.slice(1), 'index.html');
}

function builtHtmlFiles(): string[] {
	return readdirSync(build, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
		.map((entry) => join(entry.parentPath, entry.name));
}

describe('static cutover output', () => {
	// Both assertions read the prerendered output, which no other spec is
	// obliged to have produced first.
	beforeAll(() => {
		if (!existsSync(build)) execFileSync('pnpm', ['run', 'build'], { stdio: 'pipe' });
	}, 120_000);

	it('resolves every live Wagtail URL to its canonical built page', () => {
		const routes = legacyRoutes();
		expect(routes.length).toBeGreaterThan(0);

		for (const { source, target } of routes) {
			expect(existsSync(builtPage(target)), `missing canonical target ${target}`).toBe(true);
			if (source === target) continue;

			const redirect = readFileSync(builtPage(source), 'utf8');
			expect(redirect).toContain(`http-equiv="refresh" content="0; url=${target}"`);
			expect(redirect).toContain(
				`rel="canonical" href="https://www.wevalueteens.com${target}"`
			);
		}
	});

	it('indexes reader pages without indexing Editor variants or /uncial/', () => {
		const excludedPages = builtHtmlFiles().filter((path) =>
			/(?:^|\/)uncial\/|\/edit\//u.test(path.slice(build.length + 1))
		);
		expect(excludedPages.length).toBeGreaterThan(0);
		for (const path of excludedPages) {
			expect(readFileSync(path, 'utf8')).not.toContain('data-pagefind-body');
		}

		const fragments = readdirSync(join(build, 'pagefind', 'fragment'));
		expect(fragments.length).toBeGreaterThan(0);
		const indexedContent = fragments
			.map((name) => gunzipSync(readFileSync(join(build, 'pagefind', 'fragment', name))).toString())
			.join('\n');
		expect(indexedContent).not.toMatch(/"url":"\/uncial\//u);
		expect(indexedContent).not.toMatch(/"url":"\/[^"]*\/edit\//u);
	});
});
