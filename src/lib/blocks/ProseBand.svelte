<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children?: Snippet } = $props();
</script>

<section class="prose-band">
	<div class="prose-band__body">{@render children?.()}</div>
</section>
