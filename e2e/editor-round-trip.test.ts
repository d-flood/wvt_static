import { readFile, unlink, writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const contentPath = 'content/the-teen-center.json';
const createdPath = 'content/e2e-round-trip.json';

test('the editor and site index round-trip Content documents through the local checkout', async ({
	page
}) => {
	const original = await readFile(contentPath, 'utf-8');
	page.on('dialog', (dialog) => void dialog.accept());

	try {
		await page.goto('/the-teen-center/edit/');
		await page.getByLabel('Edit document metadata').click();
		const title = page.getByLabel('title', { exact: true });
		await expect(title).toHaveValue('The Teen Center');
		await title.fill('Edgerton Teen Center');
		await page.getByRole('button', { name: 'Save Metadata' }).click();
		await page.getByRole('button', { name: 'Save', exact: true }).click();

		await expect
			.poll(async () => readFile(contentPath, 'utf-8'))
			.toContain('"title": "Edgerton Teen Center"');

		await page.goto('/uncial/');
		await expect(page.locator('.uncial-cms-status')).toContainText('the local checkout');
		await page.getByLabel('New page path').fill('e2e-round-trip');
		await page.getByRole('button', { name: 'Create page' }).click();
		await expect(page).toHaveURL(/#\/e2e-round-trip\/$/);
		await expect.poll(async () => readFile(createdPath, 'utf-8')).toContain('"version": 2');

		await page.getByRole('link', { name: '← Back to index' }).click();
		const row = page.locator('li', { hasText: '/e2e-round-trip/' });
		await expect(row).toBeVisible();
		await row.getByRole('button', { name: 'Delete' }).click();
		await expect(row).toHaveCount(0);
		await expect
			.poll(async () => readFile(createdPath, 'utf-8').then(() => true).catch(() => false))
			.toBe(false);
	} finally {
		await writeFile(contentPath, original);
		await unlink(createdPath).catch(() => undefined);
	}
});
