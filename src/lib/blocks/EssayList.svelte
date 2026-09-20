<script lang="ts">
	import { resolve } from '$app/paths';
	import { categorySlug } from '$lib/essay-categories.js';
	import { selectEssays } from '$lib/essay-index.js';

	interface Props {
		mode?: string;
		count?: number;
		slugs?: string[];
	}

	let { mode = 'latest', count = 3, slugs = [] }: Props = $props();
	const selected = $derived(selectEssays(mode, count, slugs));
</script>

<section class="essay-list">
	{#each selected as essay}
		<article class="essay-list__item">
			<p class="essay-list__meta">
				<time datetime={essay.date}>{essay.date}</time>{#if essay.byline} · {essay.byline}{/if}
			</p>
			<h2 class="disp"><a href={resolve(`/writing/${essay.slug}/`)}>{essay.title}</a></h2>
			{#if essay.summary}<p>{essay.summary}</p>{/if}
			{#if essay.category}
				<a class="essay-list__category" href={resolve(`/writing/category/${categorySlug(essay.category)}/`)}>
					{essay.category}
				</a>
			{/if}
		</article>
	{/each}
</section>
