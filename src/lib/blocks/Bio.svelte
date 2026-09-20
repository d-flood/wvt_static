<script lang="ts">
	import EditableImage from './EditableImage.svelte';

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
		<EditableImage
			src={portrait}
			{alt}
			label="portrait"
			onUpload={updateAttributes ? (src) => updateAttributes({ portrait: src }) : undefined}
		/>
	</div>
	<h3 class="disp">{name}</h3>
	<p class="bio__role">{role}</p>
	{#if prose}<p>{prose}</p>{/if}
</article>
