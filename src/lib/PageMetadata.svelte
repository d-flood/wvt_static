<script lang="ts">
	import { absoluteUrl, defaultSocialImageAlt } from './page-metadata.js';

	let {
		title,
		description,
		path,
		image,
		imageAlt = defaultSocialImageAlt,
		article = false
	}: {
		title: string;
		description: string;
		path: string;
		image: string;
		imageAlt?: string;
		article?: boolean;
	} = $props();

	const fullTitle = $derived(path === '/' ? title : `${title} · We Value Teens`);
	const canonical = $derived(absoluteUrl(path));
	const socialImage = $derived(absoluteUrl(image));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content={article ? 'article' : 'website'} />
	<meta property="og:site_name" content="We Value Teens" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={socialImage} />
	<meta property="og:image:alt" content={imageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@DFL00D" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={socialImage} />
	<meta name="twitter:image:alt" content={imageAlt} />
</svelte:head>
