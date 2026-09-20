import { expect, test } from '@playwright/test';

test('Pagefind search loads and returns reader pages', async ({ page }) => {
	await page.goto('/search/');

	// The toggle needs Svelte hydration, which lags the first paint on a cold
	// dev server, so keep clicking until the panel is there.
	await expect
		.poll(async () => {
			if ((await page.locator('.search-panel').count()) === 0) {
				await page.locator('.search-toggle').click();
			}
			return page.locator('.search-panel').count();
		})
		.toBe(1);
	await expect(page.locator('.search-panel pagefind-searchbox input')).toBeVisible();
	const input = page.locator('pagefind-input input');
	await expect(input).toBeVisible();
	await input.fill('gospel');

	const result = page.locator('pagefind-results .pf-result-link').first();
	await expect(result).toBeVisible();
	await expect(result).not.toHaveAttribute('href', /\/edit\/|\/uncial\//u);
});
