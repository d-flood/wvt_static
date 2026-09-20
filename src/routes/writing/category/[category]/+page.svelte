<script lang="ts">
	import EssayCard from '$lib/EssayCard.svelte';
	import { categorySlug } from '$lib/essay-categories.js';
	import PageMetadata from '$lib/PageMetadata.svelte';
	import { defaultSocialImage, defaultSocialImageAlt } from '$lib/page-metadata.js';

	let { data } = $props();
</script>

<PageMetadata
	title={`${data.category} · Writing`}
	description={`Essays in ${data.category} from We Value Teens.`}
	path={`/writing/category/${categorySlug(data.category)}/`}
	image={defaultSocialImage}
	imageAlt={defaultSocialImageAlt}
/>

<main class="writing-index shell" data-pagefind-body>
	<header class="writing-index__header">
		<p class="block-eyebrow"><a href="/writing/">Writing</a></p>
		<h1 class="disp">{data.category}</h1>
	</header>
	<div class="essay-cards">
		{#each data.essays as essay}
			<EssayCard {essay} />
		{/each}
	</div>
</main>
