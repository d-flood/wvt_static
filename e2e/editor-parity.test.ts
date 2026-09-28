import { expect, test } from '@playwright/test';

/**
 * The Editor variant exists so Dave sees the page as readers will, which only
 * holds while the editor lays the document out in the reader's own box: the
 * editor must reserve no width for its own affordances.
 */
async function widths(page: import('@playwright/test').Page, path: string) {
	await page.goto(path);
	const column = path.endsWith('/edit/') ? '.uncial-content' : 'article';
	await page.locator(`${column} .fact-band`).first().waitFor();

	return page.evaluate(
		([columnSelector, bandSelector]) => {
			const find = (selector: string) => {
				const element = document.querySelector(selector);
				return element ? Math.round(element.getBoundingClientRect().width) : null;
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
	await page.goto('/the-teen-center/edit/');
	await page.locator('.uncial-content .fact-band').first().waitFor();

	expect(reader.band).toBe(reader.viewport);
	await expect.poll(async () => {
		return page.evaluate(() => ({
			column: Math.round(document.querySelector('.uncial-content')!.getBoundingClientRect().width),
			band: Math.round(document.querySelector('.fact-band')!.getBoundingClientRect().width)
		}));
	}).toEqual({ column: reader.column, band: reader.viewport });
});
