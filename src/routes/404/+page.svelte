<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Page not found · We Value Teens</title>
	<meta name="description" content="The requested We Value Teens page could not be found." />
</svelte:head>

<main class="not-found shell">
	<p class="block-eyebrow">404</p>
	<h1 class="disp">Off the marquee</h1>
	<p>That page is not here. Search the site or head back to the Teen Center.</p>
	<div class="block-actions">
		<a class="block-button" href={resolve('/search/')}>Search the site</a>
		<a class="block-link" href={resolve('/')}>Go home</a>
	</div>
</main>
