<script lang="ts">
	import { responsiveImage } from '$lib/image-manifest.js';

	type GalleryImage = { path: string; caption: string };

	interface Props {
		commentary?: string;
		images?: GalleryImage[];
	}

	let { commentary = '', images = [] }: Props = $props();
</script>

<section class="gallery">
	{#if commentary}<p class="gallery__commentary">{commentary}</p>{/if}
	<div class="gallery__grid">
		{#each images as image}
			{@const responsive = responsiveImage(image.path)}
			<figure>
				<picture>
					{#if responsive.webpSrcset}
						<source type="image/webp" srcset={responsive.webpSrcset} />
					{/if}
					<img
						src={responsive.src}
						srcset={responsive.jpegSrcset}
						sizes="(max-width: 52rem) 50vw, 25vw"
						alt={image.caption}
						loading="lazy"
					/>
				</picture>
				{#if image.caption}<figcaption>{image.caption}</figcaption>{/if}
			</figure>
		{/each}
	</div>
</section>
