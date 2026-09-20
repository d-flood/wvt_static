import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { MAX_CONTENT_BYTES } from 'uncial-cms';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const uploads = resolve(root, 'static/uploads');
const manifestPath = resolve(root, 'content/image-manifest.json');

describe('ported images', () => {
	it('stays within the repository and per-file budgets', () => {
		const files = readdirSync(uploads).map((name) => resolve(uploads, name));
		const sizes = files.map((file) => statSync(file).size);

		expect(JSON.parse(readFileSync(manifestPath, 'utf8'))).toHaveLength(274);
		expect(sizes.every((size) => size <= MAX_CONTENT_BYTES)).toBe(true);
		expect(sizes.reduce((total, size) => total + size, 0)).toBeLessThan(40 * 1024 * 1024);
	});
});
