<script lang="ts">
	import { dev } from '$app/environment';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { mountIndexPage, type UncialCmsSiteConfig } from 'uncial-cms';
	import { blocks, schema, siteConfig } from '../site.js';

	let target: HTMLElement;
	const config: UncialCmsSiteConfig = dev
		? { forge: 'local', contentDir: siteConfig.contentDir }
		: siteConfig;

	onMount(() => {
		const handle = mountIndexPage(target, { config, blocks, schema, basePath: base });
		return () => handle.destroy();
	});
</script>

<svelte:head>
	<title>Site index · We Value Teens</title>
</svelte:head>

<main>
	<h1>Site index</h1>
	<p>
		{#if config.forge === 'github'}
			Editing <code>{config.repo}</code> on <code>{config.branch}</code>.
		{:else}
			Editing the local checkout.
		{/if}
	</p>
	<div bind:this={target}></div>
</main>
