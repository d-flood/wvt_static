<script lang="ts">
	import { base } from '$app/paths';
	import { resolveImageSrc } from 'uncial/render';
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
		{#if image}<img src={resolveImageSrc(image, base)} {alt} />{/if}
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
