import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('visible interactive targets are at least 44 by 44 pixels on a phone', async ({ page }) => {
	await page.goto('/the-teen-center/');
	await page.locator('summary').click();

	await expect
		.poll(async () =>
			page.locator('a, button, input, select, textarea, summary, [role="button"]').evaluateAll(
				(elements) =>
					elements.flatMap((element) => {
						const rect = element.getBoundingClientRect();
						const style = getComputedStyle(element);
						if (
							style.display === 'none' ||
							style.visibility === 'hidden' ||
							rect.width === 0 ||
							rect.height === 0
						) {
							return [];
						}

						return rect.width >= 44 && rect.height >= 44
							? []
							: [`${element.tagName.toLowerCase()} "${element.textContent?.trim()}" is ${rect.width}×${rect.height}`];
					})
			)
		)
		.toEqual([]);
});
