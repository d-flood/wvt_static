import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const sitePath = resolve('content/site.json');
const builtPagePath = resolve('build/the-teen-center/index.html');
let originalSiteDocument: string | undefined;

afterEach(async () => {
	if (originalSiteDocument !== undefined) await writeFile(sitePath, originalSiteDocument);
});

describe('site data propagation', () => {
	it(
		'renders changed hours from site.json into the built footer',
		async () => {
			originalSiteDocument = await readFile(sitePath, 'utf8');
			const siteDocument = JSON.parse(originalSiteDocument);
			const changedHours = 'Propagation test hours: Sunday 1:23–4:56pm';
			siteDocument.meta.hours = changedHours;
			await writeFile(sitePath, `${JSON.stringify(siteDocument, null, '\t')}\n`);

			execFileSync('pnpm', ['run', 'build'], { stdio: 'pipe' });

			await expect(readFile(builtPagePath, 'utf8')).resolves.toContain(changedHours);
		},
		60_000
	);
});
