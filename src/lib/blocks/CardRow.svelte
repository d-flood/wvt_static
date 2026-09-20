<script lang="ts">
	import type { Snippet } from 'svelte';
	let { columns = 3, children }: { columns?: number; children?: Snippet } = $props();
</script>

<section class="card-row" data-columns={columns}>
	{@render children?.()}
</section>
