<script lang="ts">
	import { base } from '$app/paths';
	import { resolveImageSrc } from 'uncial/render';

	interface Props {
		portrait?: string;
		alt?: string;
		name?: string;
		role?: string;
		prose?: string;
		updateAttributes?: (attrs: Record<string, unknown>) => void;
	}

	let {
		portrait = '',
		alt = '',
		name = '',
		role = '',
		prose = '',
		updateAttributes
	}: Props = $props();
</script>

<article class="bio">
	<div class="bio__portrait">
		{#if portrait}<img src={resolveImageSrc(portrait, base)} {alt} />{/if}
	</div>
	<h3 class="disp">{name}</h3>
	<p class="bio__role">{role}</p>
	{#if prose}<p>{prose}</p>{/if}
</article>
