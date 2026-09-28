<script lang="ts">
	import { EditorPage } from 'uncial-cms/svelte';
	import { cmsImageSource } from 'uncial-cms';
	import { base } from '$app/paths';
	import { isEssayPath } from '$lib/site-routes.js';
	import { blocks, essaySchema, schema, site } from '../../site.js';

	let { data } = $props();
	const activeSchema = $derived(isEssayPath(data.pagePath) ? essaySchema : schema);
</script>

<svelte:head>
	<title>Edit {data.pagePath} · We Value Teens</title>
</svelte:head>

<main class="editor-main">
	<p class="editor-bar shell">Editing <code>{data.sourcePath}</code></p>
	<EditorPage
		{site}
		{blocks}
		schema={activeSchema}
		sourcePath={data.sourcePath}
		pagePath={data.pagePath}
		imageSource={cmsImageSource(site.config, { base })}
	/>
</main>
