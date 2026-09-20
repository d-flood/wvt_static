import { readFile, writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const contentPath = 'content/index.json';

/**
 * A list-valued attribute is edited as fields, not as JSON text: the point of
 * `list` in the block registry is that Dave never sees a JSON textarea.
 */
test('a list attribute is edited as per-item fields and reaches the document', async ({ page }) => {
	const original = await readFile(contentPath, 'utf-8');
	const editor = page.locator('uncial-editor');

	try {
		await page.goto('/edit/');
		await editor.locator('.uncial-gutter-label', { hasText: 'Fact band' }).first().click();
		const panel = editor.locator('.uncial-editor-sidebar--overlay');
		await expect(panel).toBeVisible();
		await expect(panel.locator('textarea')).toHaveCount(0);

		const label = panel.locator('.uncial-list-item').first().locator('input').first();
		await expect(label).toHaveValue('Hours');
		await label.fill('Open hours');
		// The edit is written through to the block, so the band re-renders as it will.
		await expect(editor.locator('.fact-band dt').first()).toHaveText('Open hours');

		await page.getByRole('button', { name: 'Save', exact: true }).click();
		await expect.poll(async () => readFile(contentPath, 'utf-8')).toContain('"Open hours"');
	} finally {
		await writeFile(contentPath, original);
	}
});

test('a list of single values offers one control per item', async ({ page }) => {
	const editor = page.locator('uncial-editor');
	await page.goto('/edit/');
	await editor.locator('.uncial-gutter-label', { hasText: 'Essay list' }).first().click();
	const panel = editor.locator('.uncial-editor-sidebar--overlay');
	await expect(panel).toBeVisible();

	await panel.getByRole('button', { name: 'Add essay' }).click();
	const select = panel.locator('.uncial-list-item select');
	await expect(select).toHaveCount(1);
	// The items are the site's own Essays, chosen by title rather than typed.
	const options = await select.locator('option').allTextContents();
	expect(options.length).toBeGreaterThan(1);
	expect(options).toContain('Failure and Frustration Formed a New Foundation');
});
