export interface EncodableImage {
	width: number;
	height: number;
	close?: () => void;
}

export interface ImageEncoder {
	decode: (file: Blob) => Promise<EncodableImage>;
	encode: (image: EncodableImage, width: number, height: number, quality: number) => Promise<Blob>;
}

export interface PreparedImage {
	bytes: Uint8Array;
	filename: string;
	contentType: 'image/webp';
	width: number;
	height: number;
}

const MAX_EDGE = 2000;
const INITIAL_QUALITY = 0.82;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.1;
const SIZE_STEP = 0.85;
const MIN_EDGE = 320;
const DEFAULT_MAX_BYTES = 1024 * 1024;

const browserEncoder: ImageEncoder = {
	decode: (file) => createImageBitmap(file),
	encode: async (image, width, height, quality) => {
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext('2d');
		if (!context) throw new Error('This browser cannot prepare images for upload.');
		context.drawImage(image as CanvasImageSource, 0, 0, width, height);
		const blob = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, 'image/webp', quality)
		);
		if (!blob || blob.type !== 'image/webp') {
			throw new Error('This browser cannot encode WebP images for upload.');
		}
		return blob;
	}
};

function dimensionsWithin(width: number, height: number, longestEdge: number): [number, number] {
	const sourceEdge = Math.max(width, height);
	if (sourceEdge <= longestEdge) return [width, height];
	const scale = longestEdge / sourceEdge;
	return [Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale))];
}

export async function downscaleImage(
	file: File,
	options: { maxBytes?: number; encoder?: ImageEncoder } = {}
): Promise<PreparedImage> {
	const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
	const encoder = options.encoder ?? browserEncoder;
	const image = await encoder.decode(file);
	let [width, height] = dimensionsWithin(image.width, image.height, MAX_EDGE);
	let quality = INITIAL_QUALITY;

	try {
		while (true) {
			const blob = await encoder.encode(image, width, height, quality);
			if (blob.size <= maxBytes) {
				const stem = file.name.replace(/\.[^.]*$/, '') || 'image';
				return {
					bytes: new Uint8Array(await blob.arrayBuffer()),
					filename: `${stem}.webp`,
					contentType: 'image/webp',
					width,
					height
				};
			}
			if (quality - QUALITY_STEP >= MIN_QUALITY) {
				quality -= QUALITY_STEP;
				continue;
			}
			const nextEdge = Math.floor(Math.max(width, height) * SIZE_STEP);
			if (nextEdge < MIN_EDGE) break;
			[width, height] = dimensionsWithin(width, height, nextEdge);
			quality = INITIAL_QUALITY;
		}
	} finally {
		image.close?.();
	}

	throw new Error('The image could not be reduced below the upload limit.');
}

export async function uploadDownscaledImageAsset(file: File, mediaDir: string) {
	const { MAX_CONTENT_BYTES, uploadImageAsset } = await import('uncial-cms');
	const prepared = await downscaleImage(file, { maxBytes: MAX_CONTENT_BYTES });
	return uploadImageAsset(
		{
			bytes: prepared.bytes,
			filename: prepared.filename,
			contentType: prepared.contentType
		},
		{ mediaDir }
	);
}
