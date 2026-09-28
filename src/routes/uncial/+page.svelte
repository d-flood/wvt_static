<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { mountIndexPage } from 'uncial-cms';
	import { blocks, schema, site } from '../site.js';

	let target: HTMLElement;

	onMount(() => {
		const handle = mountIndexPage(target, { config: site.config, blocks, schema, basePath: base });
		return () => handle.destroy();
	});
</script>

<svelte:head>
	<title>Site index · We Value Teens</title>
</svelte:head>

<main>
	<h1>Site index</h1>
	<p>
		{#if site.config.forge === 'github'}
			Editing <code>{site.config.repo}</code> on <code>{site.config.branch}</code>.
		{:else}
			Editing the local checkout.
		{/if}
	</p>
	<div bind:this={target}></div>
</main>
