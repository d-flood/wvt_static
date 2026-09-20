import manifestData from '../../content/image-manifest.json';

interface ManifestSource {
	src: string;
	width: number;
	type: string;
}

interface ManifestImage {
	srcset: ManifestSource[];
}

export interface ResponsiveImage {
	src: string;
	webpSrcset?: string;
	jpegSrcset?: string;
}

const manifest = manifestData as ManifestImage[];

export function responsiveImage(path: string): ResponsiveImage {
	const image = manifest.find((entry) => entry.srcset.some((source) => source.src === path));
	if (!image) return { src: path };

	const sources = (type: string) =>
		image.srcset
			.filter((source) => source.type === type)
			.map((source) => `${source.src} ${source.width}w`)
			.join(', ');
	const jpegSources = image.srcset.filter((source) => source.type === 'image/jpeg');

	return {
		src: jpegSources.at(-1)?.src ?? path,
		webpSrcset: sources('image/webp') || undefined,
		jpegSrcset: sources('image/jpeg') || undefined
	};
}
