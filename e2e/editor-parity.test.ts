import { expect, test } from '@playwright/test';

/**
 * The Editor variant exists so Dave sees the page as readers will, which only
 * holds while the editor lays the document out in the reader's own box: the
 * editor must reserve no width for its own affordances.
 */
async function widths(page: import('@playwright/test').Page, path: string) {
	await page.goto(path);
	const column = path.endsWith('/edit/') ? '.uncial-content' : 'article';
	// The editor fetches its document after mount, so the blocks arrive late.
	await page.waitForFunction((selector) => {
		const roots: (Document | ShadowRoot)[] = [document];
		for (const el of document.querySelectorAll('*')) {
			if (el.shadowRoot) roots.push(el.shadowRoot);
		}
		return roots.some((root) => root.querySelector(selector));
	}, `${column} .fact-band`);

	return page.evaluate(
		([columnSelector, bandSelector]) => {
			const roots: (Document | ShadowRoot)[] = [document];
			for (const el of document.querySelectorAll('*')) {
				if (el.shadowRoot) roots.push(el.shadowRoot);
			}
			const find = (selector: string) => {
				for (const root of roots) {
					const el = root.querySelector(selector);
					if (el) return Math.round(el.getBoundingClientRect().width);
				}
				return null;
			};
			return {
				column: find(columnSelector),
				band: find(bandSelector),
				viewport: window.innerWidth
			};
		},
		[column, '.fact-band'] as const
	);
}

test('the Editor variant lays the document out in the reader page\'s box', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	const reader = await widths(page, '/the-teen-center/');
	const editor = await widths(page, '/the-teen-center/edit/');

	expect(reader.band).toBe(reader.viewport);
	expect(editor.column).toBe(reader.column);
	expect(editor.band).toBe(editor.viewport);
});
