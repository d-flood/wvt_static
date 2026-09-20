<script lang="ts">
	import { asset } from '$app/paths';
	import '../app.css';
	import PagefindAssets from '$lib/PagefindAssets.svelte';
	import SiteFooter from '$lib/SiteFooter.svelte';
	import SiteHeader from '$lib/SiteHeader.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={asset('/favicon.svg')} />
	<script
		defer
		src="https://stats.dflood.org/script.js"
		data-website-id="bc012850-09df-4ac9-a599-5ba1dc721b3c"
	></script>
</svelte:head>

<PagefindAssets />
<SiteHeader site={data.site} />
<div class:reading-ground={data.ground === 'cream'} class="page-frame" data-ground={data.ground}>
	{@render children()}
</div>
<SiteFooter site={data.site} />
