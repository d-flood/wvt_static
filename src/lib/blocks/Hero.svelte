<script lang="ts">
	import EditableImage from './EditableImage.svelte';
	import ExternalUrlField from './ExternalUrlField.svelte';
	import { resolveBlockLink } from '$lib/site-routes.js';

	interface Props {
		image?: string;
		alt?: string;
		eyebrow?: string;
		headline?: string;
		lede?: string;
		primaryLabel?: string;
		primaryLink?: string;
		primaryExternalUrl?: string;
		secondaryLabel?: string;
		secondaryLink?: string;
		secondaryExternalUrl?: string;
		updateAttributes?: (attrs: Record<string, unknown>) => void;
	}

	let {
		image = '',
		alt = '',
		eyebrow = '',
		headline = '',
		lede = '',
		primaryLabel = '',
		primaryLink = '/',
		primaryExternalUrl = '',
		secondaryLabel = '',
		secondaryLink = '/',
		secondaryExternalUrl = '',
		updateAttributes
	}: Props = $props();

	const primaryHref = $derived(resolveBlockLink(primaryLink, primaryExternalUrl));
	const secondaryHref = $derived(resolveBlockLink(secondaryLink, secondaryExternalUrl));
</script>

<section class="marquee-hero">
	<EditableImage
		src={image}
		{alt}
		label="hero image"
		onUpload={updateAttributes ? (src) => updateAttributes({ image: src }) : undefined}
	/>
	<div class="marquee-hero__scrim"></div>
	<div class="marquee-hero__content shell">
		{#if eyebrow}<p class="block-eyebrow">{eyebrow}</p>{/if}
		<h2 class="disp">{headline}</h2>
		{#if lede}<p class="marquee-hero__lede">{lede}</p>{/if}
	</div>
	<div class="marquee-hero__actions shell">
		<div class="block-actions">
			{#if primaryLabel && primaryHref}<a class="block-button" href={primaryHref}>{primaryLabel}</a
				>{/if}
			{#if secondaryLabel && secondaryHref}<a
					class="block-button block-button--ghost"
					href={secondaryHref}>{secondaryLabel}</a
				>{/if}
		</div>
		{#if updateAttributes && primaryLink === 'external'}
			<ExternalUrlField
				label="Primary external URL"
				value={primaryExternalUrl}
				onChange={(url) => updateAttributes?.({ primaryExternalUrl: url })}
			/>
		{/if}
		{#if updateAttributes && secondaryLink === 'external'}
			<ExternalUrlField
				label="Secondary external URL"
				value={secondaryExternalUrl}
				onChange={(url) => updateAttributes?.({ secondaryExternalUrl: url })}
			/>
		{/if}
	</div>
</section>
