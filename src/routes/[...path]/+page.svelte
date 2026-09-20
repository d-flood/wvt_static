<script lang="ts">
	import { resolve } from '$app/paths';
	import { Renderer } from 'uncial/render';
	import PageMetadata from '$lib/PageMetadata.svelte';
	import { categorySlug } from '$lib/essay-categories.js';
	import { isEssayPath } from '$lib/site-routes.js';
	import {
		canonicalPath,
		defaultSocialImageAlt,
		pageDescription,
		socialImage
	} from '$lib/page-metadata.js';
	import { blocks, essaySchema, schema } from '../site.js';

	let { data } = $props();
	const title = $derived(String(data.meta.title ?? 'Untitled page'));
	const isEssay = $derived(isEssayPath(data.path));
	const activeSchema = $derived(isEssay ? essaySchema : schema);
	const date = $derived(String(data.meta.date ?? ''));
	const byline = $derived(String(data.meta.byline ?? ''));
	const category = $derived(String(data.meta.category ?? ''));
	const summary = $derived(String(data.meta.summary ?? ''));
	const path = $derived(canonicalPath(data.path));
	const description = $derived(pageDescription(path, summary));
	const image = $derived(socialImage(data.document));
	// A page that opens on a hero states its title in the hero's headline; a
	// second one above the photograph would repeat it.
	const leadsWithHero = $derived(data.document?.content?.[0]?.type === 'hero');
</script>

<PageMetadata
	{title}
	{description}
	{path}
	{image}
	imageAlt={defaultSocialImageAlt}
	article={isEssay}
/>

<main
	class:essay-page={isEssay}
	class:leads-with-hero={leadsWithHero}
	class="reader-main shell"
	data-pagefind-body
>
	<article>
		<h1 class="disp" class:visually-hidden={leadsWithHero}>{title}</h1>
		{#if isEssay}
			<p class="essay-byline">
				{#if date}<time datetime={date}>{date}</time>{/if}
				{#if byline}<span>By {byline}</span>{/if}
				{#if category}
					<a href={resolve(`/writing/category/${categorySlug(category)}/`)}>{category}</a>
				{/if}
			</p>
			{#if summary}<p class="essay-summary">{summary}</p>{/if}
		{/if}
		<Renderer content={data.document} {blocks} schema={activeSchema} />
	</article>
</main>
