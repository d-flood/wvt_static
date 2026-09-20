import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const SENTINEL = 'uncial-cms-runtime-sentinel-v1';
const buildDir = process.argv[2] ?? 'build';

function walk(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		return entry.isDirectory() ? walk(path) : [path];
	});
}

const htmlFiles = walk(buildDir).filter((path) => path.endsWith('index.html'));
if (htmlFiles.length === 0) {
	console.error(`No pages found under "${buildDir}" — build the site first.`);
	process.exit(1);
}

function resolveAppAsset(url) {
	const marker = url.indexOf('_app/');
	return marker === -1 ? null : join(buildDir, url.slice(marker));
}

function scriptClosure(html) {
	const queue = [...html.matchAll(/(?:src|href)="([^"]+\.js)"/g)]
		.map(([, url]) => resolveAppAsset(url))
		.filter(Boolean);
	for (const [, url] of html.matchAll(/import\(?["']([^"']+\.js)["']/g)) {
		const resolved = resolveAppAsset(url);
		if (resolved) queue.push(resolved);
	}
	const seen = new Set();
	while (queue.length > 0) {
		const file = queue.pop();
		if (seen.has(file)) continue;
		seen.add(file);
		let source;
		try {
			source = readFileSync(file, 'utf-8');
		} catch {
			continue;
		}
		for (const [, spec] of source.matchAll(/(?:from|import)\s*["']([^"']+\.js)["']/g)) {
			if (spec.startsWith('.')) queue.push(join(dirname(file), spec));
			else {
				const resolved = resolveAppAsset(spec);
				if (resolved) queue.push(resolved);
			}
		}
	}
	return seen;
}

function pageContainsSentinel(htmlPath) {
	const html = readFileSync(htmlPath, 'utf-8');
	if (html.includes(SENTINEL)) return true;
	for (const file of scriptClosure(html)) {
		if (readFileSync(file, 'utf-8').includes(SENTINEL)) return true;
	}
	return false;
}

const failures = [];
const pages = new Map();
for (const htmlPath of htmlFiles) {
	const page = `/${relative(buildDir, dirname(htmlPath))}/`.replace(/^\/\.\/$/, '/');
	pages.set(page, htmlPath);
	const isEditorPage = page.endsWith('/edit/');
	const isIndexPage = page === '/uncial/';
	const hasSentinel = pageContainsSentinel(htmlPath);

	if (isEditorPage && !hasSentinel) {
		failures.push(`${page} is an editor variant but does not reference the CMS runtime.`);
	} else if (!isEditorPage && !isIndexPage && hasSentinel) {
		failures.push(`${page} is a content page but ships uncial-cms JavaScript.`);
	}
}

const essayPages = [...pages.keys()].filter(
	(page) =>
		/^\/writing\/[^/]+\/$/.test(page) &&
		page !== '/writing/category/' &&
		page !== '/writing/edit/'
);
if (essayPages.length !== 26) {
	failures.push(`expected 26 Essay pages, found ${essayPages.length}.`);
}

for (const page of [...essayPages, '/start-a-teen-center/']) {
	const htmlPath = pages.get(page);
	if (!htmlPath) {
		failures.push(`${page} is missing from the build output.`);
	} else if (!readFileSync(htmlPath, 'utf-8').includes('data-ground="cream"')) {
		failures.push(`${page} does not carry the cream reading ground.`);
	}
}

function groundOf(htmlPath) {
	return readFileSync(htmlPath, 'utf-8').match(/data-ground="(\w+)"/)?.[1];
}

// An Editor variant edits its reader page in place, so it must render on the
// same ground: an Essay is written on the cream it will be read on.
for (const [page, htmlPath] of pages) {
	if (!page.endsWith('/edit/')) continue;
	const readerPage = page.slice(0, -'edit/'.length);
	const readerPath = pages.get(readerPage);
	if (!readerPath) continue;
	if (groundOf(htmlPath) !== groundOf(readerPath)) {
		failures.push(
			`${page} renders the ${groundOf(htmlPath)} ground but ${readerPage} renders ${groundOf(readerPath)}.`
		);
	}
}

const inkExample = pages.get('/the-teen-center/');
if (!inkExample) {
	failures.push('/the-teen-center/ is missing from the build output.');
} else if (!readFileSync(inkExample, 'utf-8').includes('data-ground="ink"')) {
	failures.push('/the-teen-center/ does not carry the ink ground.');
}

if (failures.length > 0) {
	console.error('assert:clean-pages FAILED');
	for (const failure of failures) console.error(`  - ${failure}`);
	process.exit(1);
}

console.log(
	`assert:clean-pages OK — ${htmlFiles.length} pages checked, content pages are sentinel-free and reading grounds are correct.`
);
