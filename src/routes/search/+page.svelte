<script lang="ts">
	import PageMetadata from '$lib/PageMetadata.svelte';
	import { defaultSocialImage, defaultSocialImageAlt } from '$lib/page-metadata.js';
</script>

<PageMetadata
	title="Search"
	description="Search We Value Teens pages and Essays."
	path="/search/"
	image={defaultSocialImage}
	imageAlt={defaultSocialImageAlt}
/>

<main class="search-page shell">
	<header>
		<p class="block-eyebrow">Find a page or Essay</p>
		<h1 class="disp">Search</h1>
	</header>
	<div class="pagefind-full" data-pf-theme="dark">
		<pagefind-input instance="search-page" placeholder="Search We Value Teens"></pagefind-input>
		<pagefind-summary instance="search-page"></pagefind-summary>
		<pagefind-results instance="search-page"></pagefind-results>
	</div>
</main>
