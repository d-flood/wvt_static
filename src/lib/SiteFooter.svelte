<script lang="ts">
	import type { SiteData } from './site-data.js';

	let { site }: { site: SiteData } = $props();

	const mapUrl = $derived(
		`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.addressLine}, ${site.city}`)}`
	);
	const phoneUrl = $derived(`tel:${site.phone.replace(/[^\d+]/g, '')}`);
</script>

<footer class="site-footer">
	<div class="shell footer-grid">
		<section aria-labelledby="visit-heading">
			<h2 id="visit-heading" class="disp">Visit</h2>
			<address>
				<a href={mapUrl}>{site.addressLine}<br />{site.city}</a>
				<a href={phoneUrl}>{site.phone}</a>
			</address>
			<p>{site.hours}</p>
		</section>

		<section aria-labelledby="connect-heading">
			<h2 id="connect-heading" class="disp">Connect</h2>
			<nav class="social-links" aria-label="Social media">
				<a href={site.facebook}>Facebook</a>
				<a href={site.youtube}>YouTube</a>
				<a href={site.instagram}>Instagram</a>
			</nav>
		</section>
	</div>
	<div class="shell footer-base">
		<p>A program of Non-Toxic Youth Alternatives</p>
		<a href={mapUrl}>Open in Maps</a>
	</div>
</footer>
