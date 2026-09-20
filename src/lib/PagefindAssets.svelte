<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		const componentUi = '/pagefind/pagefind-component-ui.js';
		if (!document.querySelector('link[data-pagefind-styles]')) {
			const stylesheet = document.createElement('link');
			stylesheet.rel = 'stylesheet';
			stylesheet.href = '/pagefind/pagefind-component-ui.css';
			stylesheet.dataset.pagefindStyles = '';
			document.head.append(stylesheet);
		}
		void import(/* @vite-ignore */ componentUi);
	});
</script>
