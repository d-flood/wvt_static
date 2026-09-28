import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

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

const failures = [];
const pages = new Map();
for (const htmlPath of htmlFiles) {
	const page = `/${relative(buildDir, dirname(htmlPath))}/`.replace(/^\/\.\/$/, '/');
	pages.set(page, htmlPath);
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

console.log(`assert:clean-pages OK — reading grounds are correct.`);
