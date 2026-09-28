<script lang="ts">
	import type { Snippet } from 'svelte';
	import { base } from '$app/paths';
	import { resolveImageSrc } from 'uncial/render';

	interface Props {
		title?: string;
		image?: string;
		alt?: string;
		children?: Snippet;
		updateAttributes?: (attrs: Record<string, unknown>) => void;
	}

	let { title = '', image = '', alt = '', children, updateAttributes }: Props = $props();
</script>

<section class="program-section">
	<div class="program-section__image">
		{#if image}<img src={resolveImageSrc(image, base)} {alt} />{/if}
	</div>
	<div class="program-section__body">
		<h2 class="disp program-section__title">{title}</h2>
		{@render children?.()}
	</div>
</section>
