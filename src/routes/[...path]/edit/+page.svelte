<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { mountEditorPage, type UncialCmsSiteConfig } from 'uncial-cms';
	import { isEssayPath } from '$lib/site-routes.js';
	import { blocks, essaySchema, schema, siteConfig } from '../../site.js';

	let { data } = $props();
	let target: HTMLElement;
	const activeSchema = $derived(isEssayPath(data.pagePath) ? essaySchema : schema);
	const config: UncialCmsSiteConfig = dev
		? { forge: 'local', contentDir: siteConfig.contentDir }
		: siteConfig;

	onMount(() => {
		const handle = mountEditorPage(target, {
			config,
			sourcePath: data.sourcePath,
			pagePath: data.pagePath,
			blocks,
			schema: activeSchema,
			// The Editor variant is the page: the document is laid out in the
			// reader's own column and grounds, so a block bleeds and wraps here
			// exactly as it will once saved.
			presentation: 'bare',
			attributesPanel: 'overlay'
		});
		return () => handle.destroy();
	});
</script>

<svelte:head>
	<title>Edit {data.pagePath} · We Value Teens</title>
</svelte:head>

<main class="editor-main">
	<p class="editor-bar shell">Editing <code>{data.sourcePath}</code></p>
	<div bind:this={target}></div>
</main>
