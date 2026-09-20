<script lang="ts">
	import EditableImage from './EditableImage.svelte';
	import ExternalUrlField from './ExternalUrlField.svelte';
	import { resolveBlockLink } from '$lib/site-routes.js';

	interface Props {
		image?: string;
		alt?: string;
		title?: string;
		blurb?: string;
		link?: string;
		externalUrl?: string;
		updateAttributes?: (attrs: Record<string, unknown>) => void;
	}

	let {
		image = '',
		alt = '',
		title = '',
		blurb = '',
		link = '/',
		externalUrl = '',
		updateAttributes
	}: Props = $props();
	const href = $derived(resolveBlockLink(link, externalUrl));
</script>

<article class="marquee-card">
	<div class="marquee-card__image">
		<EditableImage
			src={image}
			{alt}
			label="card image"
			onUpload={updateAttributes ? (src) => updateAttributes({ image: src }) : undefined}
		/>
	</div>
	<div class="marquee-card__body">
		<h3 class="disp">{title}</h3>
		{#if blurb}<p>{blurb}</p>{/if}
		{#if href}<a class="block-link" {href}>Learn more <span aria-hidden="true">→</span></a>{/if}
		{#if updateAttributes && link === 'external'}
			<ExternalUrlField
				label="External URL"
				value={externalUrl}
				onChange={(url) => updateAttributes?.({ externalUrl: url })}
			/>
		{/if}
	</div>
</article>
