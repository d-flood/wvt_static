import { MAX_CONTENT_BYTES } from 'uncial-cms';
import { describe, expect, it, vi } from 'vitest';
import { downscaleImage, type ImageEncoder } from './image-upload.js';

describe('downscaleImage', () => {
	it('reduces a 5.7 MB phone photograph below the upload cap', async () => {
		const source = new File([new Uint8Array(5_700_000)], 'phone-photo.jpg', {
			type: 'image/jpeg'
		});
		const close = vi.fn();
		const encode = vi.fn(async (_image, width: number, height: number, quality: number) => {
			const encodedSize = Math.round(width * height * quality * 0.35);
			return new Blob([new Uint8Array(encodedSize)], { type: 'image/webp' });
		});
		const encoder: ImageEncoder = {
			decode: vi.fn(async () => ({ width: 4032, height: 3024, close })),
			encode
		};

		const result = await downscaleImage(source, { maxBytes: MAX_CONTENT_BYTES, encoder });

		expect(source.size).toBe(5_700_000);
		expect(result.bytes.byteLength).toBeLessThan(MAX_CONTENT_BYTES);
		expect(Math.max(result.width, result.height)).toBeLessThanOrEqual(2000);
		expect(result.filename).toBe('phone-photo.webp');
		expect(result.contentType).toBe('image/webp');
		expect(encode).toHaveBeenCalled();
		expect(close).toHaveBeenCalledOnce();
	});
});
