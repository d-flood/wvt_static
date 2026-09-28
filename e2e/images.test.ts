import { expect, test } from '@playwright/test';

test('image fields can choose existing uploads', async ({ page }) => {
	await page.goto('/edit/');
	const editor = page.locator('.uncial-editor-shell');
	await editor.locator('.uncial-gutter-label', { hasText: 'Hero' }).first().click();
	const panel = editor.locator('.uncial-editor-sidebar--overlay');
	await panel.getByRole('button', { name: 'Choose existing' }).click();
	const picker = page.getByRole('dialog', { name: 'Choose an image' });
	const tile = picker.locator('.uncial-image-picker__tile').first();
	await expect(tile).toBeVisible();
	const image = await tile.locator('img').getAttribute('src');
	await tile.click();
	await expect(editor.locator('.marquee-hero > img')).toHaveAttribute('src', image!);
});

test('image fields upload through the CMS and preview the result', async ({ page }) => {
	await page.goto('/edit/');
	const editor = page.locator('.uncial-editor-shell');
	await editor.locator('.uncial-gutter-label', { hasText: 'Hero' }).first().click();
	const panel = editor.locator('.uncial-editor-sidebar--overlay');
	await panel.locator('input[type="file"]').setInputFiles(
		'static/uploads/00f48277e0414313499d583b02bb8320.webp'
	);
	await expect(editor.locator('.marquee-hero > img')).toHaveAttribute('src', /^blob:/);
	await panel.getByRole('button', { name: 'Choose existing' }).click();
	await expect(
		page.getByRole('dialog', { name: 'Choose an image' }).getByRole('button', {
			name: '00f48277e0414313499d583b02bb8320.webp'
		})
	).toHaveAttribute('aria-pressed', 'true');
});
