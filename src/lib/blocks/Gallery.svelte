<script lang="ts">
	import { onDestroy } from 'svelte';
	import { responsiveImage } from '$lib/image-manifest.js';

	type GalleryImage = { path: string; caption: string };

	interface Props {
		commentary?: string;
		images?: GalleryImage[];
		updateAttributes?: (attrs: Record<string, unknown>) => void;
	}

	let { commentary = '', images = [], updateAttributes }: Props = $props();
	let busy = $state(false);
	let error = $state<string | null>(null);
	let previews = $state<Record<string, string>>({});

	function updateImage(index: number, partial: Partial<GalleryImage>): void {
		updateAttributes?.({
			images: images.map((image, imageIndex) =>
				imageIndex === index ? { ...image, ...partial } : image
			)
		});
	}

	function removeImage(index: number): void {
		updateAttributes?.({ images: images.filter((_, imageIndex) => imageIndex !== index) });
	}

	async function onFiles(event: Event): Promise<void> {
		const input = event.currentTarget as HTMLInputElement;
		const files = [...(input.files ?? [])];
		if (!files.length) return;
		error = null;
		busy = true;
		let nextImages = [...images];

		try {
			const { uploadDownscaledImageAsset } = await import('$lib/image-upload.js');
			for (const file of files) {
				const preview = URL.createObjectURL(file);
				try {
					const result = await uploadDownscaledImageAsset(file, 'static/uploads');
					const path = `/${result.path.replace(/^static\//, '')}`;
					previews = { ...previews, [path]: preview };
					nextImages = [...nextImages, { path, caption: '' }];
					updateAttributes?.({ images: nextImages });
				} catch (cause) {
					URL.revokeObjectURL(preview);
					throw cause;
				}
			}
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'Upload failed.';
		} finally {
			busy = false;
			input.value = '';
		}
	}

	onDestroy(() => Object.values(previews).forEach((url) => URL.revokeObjectURL(url)));
</script>

<section class="gallery">
	{#if commentary}<p class="gallery__commentary">{commentary}</p>{/if}
	<div class="gallery__grid">
		{#each images as image, index}
			{@const responsive = responsiveImage(image.path)}
			<figure>
				<picture>
					{#if responsive.webpSrcset}
						<source type="image/webp" srcset={responsive.webpSrcset} />
					{/if}
					<img
						src={previews[image.path] ?? responsive.src}
						srcset={responsive.jpegSrcset}
						sizes="(max-width: 52rem) 50vw, 25vw"
						alt={image.caption}
						loading="lazy"
					/>
				</picture>
				{#if image.caption}<figcaption>{image.caption}</figcaption>{/if}
				{#if updateAttributes}
					<div class="gallery__image-editor">
						<label>
							Caption
							<input
								type="text"
								value={image.caption}
								oninput={(event) => updateImage(index, { caption: event.currentTarget.value })}
							/>
						</label>
						<button type="button" onclick={() => removeImage(index)}>Remove</button>
					</div>
				{/if}
			</figure>
		{/each}
	</div>
	{#if updateAttributes}
		<div class="gallery__uploader">
			<label>
				<span>Add photographs</span>
				<input type="file" accept="image/*" multiple disabled={busy} onchange={onFiles} />
			</label>
			{#if busy}<span role="status">Preparing photographs…</span>{/if}
			{#if error}<span role="alert">{error}</span>{/if}
		</div>
	{/if}
</section>
