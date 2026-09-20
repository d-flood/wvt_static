<script lang="ts">
	import { categorySlug } from '$lib/essay-categories.js';

	interface Essay {
		slug: string;
		title: string;
		date: string;
		byline: string;
		category: string;
		summary: string;
	}

	let { essay }: { essay: Essay } = $props();
</script>

<article class="essay-card">
	<p class="essay-card__meta">
		<time datetime={essay.date}>{essay.date}</time>
		{#if essay.byline}<span>By {essay.byline}</span>{/if}
	</p>
	<h2 class="disp"><a href={`/writing/${essay.slug}/`}>{essay.title}</a></h2>
	<p>{essay.summary}</p>
	<a class="essay-card__category" href={`/writing/category/${categorySlug(essay.category)}/`}>
		{essay.category}
	</a>
</article>
