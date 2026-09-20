<script lang="ts">
	type Fact = { label: string; value: string };
	let { facts = [] }: { facts?: Fact[] } = $props();
</script>

<dl class="fact-band">
	{#each facts as fact}
		<div>
			<dt>{fact.label}</dt>
			<dd class="disp">{fact.value}</dd>
		</div>
	{/each}
</dl>
