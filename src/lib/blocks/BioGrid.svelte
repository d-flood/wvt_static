<script lang="ts">
	import type { Snippet } from 'svelte';
	let { heading = '', children }: { heading?: string; children?: Snippet } = $props();
</script>

<section class="bio-grid-section">
	<h2 class="disp">{heading}</h2>
	<div class="bio-grid">{@render children?.()}</div>
</section>
