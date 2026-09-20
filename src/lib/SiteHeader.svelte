<script lang="ts">
	import { tick } from 'svelte';
	import type { SiteData } from './site-data.js';
	import { SITE_ROUTES } from './site-routes.js';

	let { site }: { site: SiteData } = $props();

	let searchOpen = $state(false);
	let searchWrap: HTMLDivElement | null = $state(null);
	let searchToggle: HTMLButtonElement | null = $state(null);

	async function toggleSearch() {
		searchOpen = !searchOpen;
		if (searchOpen) {
			await tick();
			(searchWrap?.querySelector('input') as HTMLInputElement | null)?.focus();
		}
	}

	function onWindowClick(event: MouseEvent) {
		if (!searchOpen) return;
		if (searchWrap && !searchWrap.contains(event.target as Node)) searchOpen = false;
	}

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && searchOpen) {
			searchOpen = false;
			searchToggle?.focus();
		}
	}

	const navLabels: Partial<Record<(typeof SITE_ROUTES)[number]['value'], string>> = {
		'/the-teen-center/': 'The Center',
		'/programs/': 'Programs',
		'/start-a-teen-center/': 'Start One',
		'/writing/': 'Writing',
		'/about/': 'About'
	};
	const navItems = SITE_ROUTES.filter((route) => route.value in navLabels).map((route) => ({
		href: route.value,
		label: navLabels[route.value] ?? route.label
	}));
</script>

{#snippet links()}
	{#each navItems as item}
		<a href={item.href} rel="external">{item.label}</a>
	{/each}
{/snippet}

<header class="site-header">
	<div class="shell header-inner">
		<a class="lockup" href="/" rel="external">
			<img class="lockup__mark" src="/wvt-mark-duotone.svg" alt="" />
			<span class="lockup__names">
				<span class="lockup__name disp">{site.siteName}</span>
				{#if site.tagline}<span class="lockup__tagline">{site.tagline}</span>{/if}
			</span>
		</a>
		<div class="header-search" data-pf-theme="dark" bind:this={searchWrap}>
			<button
				type="button"
				class="search-toggle"
				aria-expanded={searchOpen}
				aria-controls="header-search-panel"
				aria-label={searchOpen ? 'Close search' : 'Open search'}
				bind:this={searchToggle}
				onclick={toggleSearch}
			>
				<svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path
						d="M12.75 11.25h-.8l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.8l5 5 1.5-1.5-4.99-5Zm-6 0a4.75 4.75 0 1 1 0-9.5 4.75 4.75 0 0 1 0 9.5Z"
						fill="currentColor"
					/>
				</svg>
			</button>
			{#if searchOpen}
				<div id="header-search-panel" class="search-panel" role="dialog" aria-label="Site search">
					<pagefind-searchbox instance="header" max-results="5" hide-shortcut></pagefind-searchbox>
				</div>
			{/if}
		</div>

		<div class="header-actions">
			<nav class="menu-bar" aria-label="Main navigation">
				{@render links()}
			</nav>
			<!-- A closed <details> hides its content from layout, so the wide-screen
			     bar cannot be the same element as the phone's disclosure. -->
			<details class="menu">
				<summary>Menu</summary>
				<nav aria-label="Main navigation">
					{@render links()}
				</nav>
			</details>
			<a class="button" href={site.donateUrl}>Give</a>
		</div>
	</div>
</header>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} />
