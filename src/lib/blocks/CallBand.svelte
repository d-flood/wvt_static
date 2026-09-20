<script lang="ts">
	import ExternalUrlField from './ExternalUrlField.svelte';
	import { resolveBlockLink } from '$lib/site-routes.js';

	interface Props {
		heading?: string;
		body?: string;
		label?: string;
		link?: string;
		externalUrl?: string;
		updateAttributes?: (attrs: Record<string, unknown>) => void;
	}

	let {
		heading = '',
		body = '',
		label = '',
		link = '/',
		externalUrl = '',
		updateAttributes
	}: Props = $props();
	const href = $derived(resolveBlockLink(link, externalUrl));
</script>

<aside class="call-band">
	<div>
		<h2 class="disp">{heading}</h2>
		{#if body}<p>{body}</p>{/if}
	</div>
	{#if href}<a class="call-band__button" {href}>{label}</a>{/if}
	{#if updateAttributes && link === 'external'}
		<ExternalUrlField
			label="External URL"
			value={externalUrl}
			onChange={(url) => updateAttributes?.({ externalUrl: url })}
		/>
	{/if}
</aside>
