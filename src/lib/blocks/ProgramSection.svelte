<script lang="ts">
	import type { Snippet } from 'svelte';
	import EditableImage from './EditableImage.svelte';

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
		<EditableImage
			src={image}
			{alt}
			label="program image"
			onUpload={updateAttributes ? (src) => updateAttributes({ image: src }) : undefined}
		/>
	</div>
	<div class="program-section__body">
		<h2 class="disp program-section__title">{title}</h2>
		{@render children?.()}
	</div>
</section>
