import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import {
	inferAttributeInputKind,
	normalizeAttributeOptions,
	normalizeDocument,
	validateDocument,
	type ContentDocument
} from 'uncial/core';
import { Renderer } from 'uncial/render';
import { blocks, schema } from '../../routes/site.js';
import siteDocument from '../../../content/site.json';
import { LINK_OPTIONS } from '../site-routes.js';

function documentWith(
	type: string,
	attrs: Record<string, unknown>,
	content?: ContentDocument['content']
): ContentDocument {
	return {
		type: 'doc',
		content: [{ type, attrs, ...(content ? { content } : {}) }]
	} as ContentDocument;
}

function roundTrip(document: ContentDocument): ContentDocument {
	const normalized = normalizeDocument(document, blocks, schema);
	return normalizeDocument(JSON.parse(JSON.stringify(normalized)), blocks, schema);
}

function renderDocument(document: ContentDocument): string {
	return render(Renderer, { props: { content: document, blocks, schema } }).body;
}

describe('Marquee block registry', () => {
	it('registers all eleven blocks for the editor insert menu', () => {
		expect(blocks.metadata.map(({ id }) => id)).toEqual([
			'hero',
			'factBand',
			'cardRow',
			'card',
			'callBand',
			'proseBand',
			'programSection',
			'gallery',
			'bioGrid',
			'bio',
			'essayList'
		]);
	});

	it.each([
		[
			'hero',
			{
				image: '/uploads/hero.webp',
				alt: 'Teenagers playing pool',
				eyebrow: 'Edgerton, Wisconsin',
				headline: 'A place to belong',
				lede: 'Free every weekend.',
				primaryLabel: 'Visit us',
				primaryLink: '/the-teen-center/',
				primaryExternalUrl: '',
				secondaryLabel: 'See programs',
				secondaryLink: '/programs/',
				secondaryExternalUrl: ''
			}
		],
		[
			'factBand',
			{
				facts: [
					{ label: 'Cost', value: 'Free' },
					{ label: 'Ages', value: '13+' }
				]
			}
		],
		['cardRow', { columns: 4 }],
		[
			'card',
			{
				image: '/uploads/studio.webp',
				alt: 'A teenager at the mixing desk',
				title: 'Recording Studio',
				blurb: 'Make something loud.',
				link: '/programs/',
				externalUrl: ''
			}
		],
		[
			'callBand',
			{
				heading: 'Keep the doors open',
				body: 'Your gift pays for free weekends.',
				label: 'Give now',
				link: 'external',
				externalUrl: 'https://example.org/give'
			}
		],
		['proseBand', {}],
		[
			'programSection',
			{
				title: 'Recording Studio',
				image: '/uploads/studio.webp',
				alt: 'A teenager at the mixing desk'
			}
		],
		[
			'gallery',
			{
				commentary: 'Friday night at the Teen Center.',
				images: [
					{ path: '/uploads/one.webp', caption: 'Playing pool' },
					{ path: '/uploads/two.webp', caption: '' }
				]
			}
		],
		['bioGrid', { heading: 'Board members' }],
		[
			'bio',
			{
				portrait: '/uploads/dave.webp',
				alt: 'Dave Flood',
				name: 'Dave Flood',
				role: 'Founder and president',
				prose: 'Serving Edgerton teenagers since 1993.'
			}
		],
		[
			'essayList',
			{
				mode: 'featured',
				count: 5,
				slugs: ['the-mission-of-the-gospel']
			}
		]
	] as const)('preserves %s attributes through a save/load round trip', (type, attrs) => {
		const node = roundTrip(documentWith(type, attrs)).content?.[0];
		expect(node?.attrs).toMatchObject({ ...attrs, id: expect.any(String) });
	});

	it('takes the fact-band defaults from site data', () => {
		const node = roundTrip(documentWith('factBand', {})).content?.[0];
		expect(node?.attrs?.facts).toEqual([
			{ label: 'Hours', value: siteDocument.meta.hours },
			{
				label: 'Location',
				value: `${siteDocument.meta.addressLine}, ${siteDocument.meta.city}`
			}
		]);
	});

	it.each(['hero', 'card'])('refuses a save when %s alt text is empty', (type) => {
		const document = documentWith(type, {
			image: '/uploads/photo.webp',
			alt: '',
			headline: 'Headline',
			title: 'Title',
			link: '/'
		});
		const result = validateDocument(document, blocks, schema);

		expect(result.ok).toBe(false);
		expect(result.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'INVALID_ATTR',
					path: ['content', 0, 'attrs', 'alt'],
					severity: 'error'
				})
			])
		);
	});

	it('offers every built page and the external choice for links, and nothing else', () => {
		const expected = LINK_OPTIONS.map((option) => option.value);

		expect(expected.slice(0, 7)).toEqual([
			'/',
			'/the-teen-center/',
			'/programs/',
			'/start-a-teen-center/',
			'/writing/',
			'/about/',
			'/give/'
		]);
		expect(expected.at(-1)).toBe('external');
		// The generated middle is the 26 Essays; site.json and the image manifest back no page.
		expect(expected).toHaveLength(7 + 26 + 1);
		expect(expected).toContain('/writing/the-mission-of-the-gospel/');
		expect(expected).not.toContain('/site/');
		expect(expected).not.toContain('/image-manifest/');

		for (const [blockId, names] of [
			['hero', ['primaryLink', 'secondaryLink']],
			['card', ['link']],
			['callBand', ['link']]
		] as const) {
			const block = blocks.get(blockId)!;
			for (const name of names) {
				const spec = block.attributes[name];
				expect(inferAttributeInputKind(spec)).toBe('select');
				expect(normalizeAttributeOptions(spec)?.map((option) => option.value)).toEqual(expected);
			}
		}

		expect(
			validateDocument(
				documentWith('card', {
					image: '/uploads/card.webp',
					alt: 'A card image',
					title: 'Card title',
					link: '/mistyped-path/'
				}),
				blocks,
				schema
			).ok
		).toBe(false);
	});

	it('does not expose styling attributes', () => {
		for (const block of blocks.blocks) {
			for (const name of Object.keys(block.attributes)) {
				expect(name).not.toMatch(/colou?r|tone|theme|variant/i);
			}
		}
	});

	it.each([
		[
			'hero',
			{
				image: '/uploads/hero.webp',
				alt: 'Teens together',
				headline: 'Belong here'
			},
			'marquee-hero'
		],
		[
			'factBand',
			{
				facts: [
					{ label: 'Cost', value: 'Free' },
					{ label: 'Ages', value: '13+' }
				]
			},
			'fact-band'
		],
		[
			'card',
			{
				image: '/uploads/card.webp',
				alt: 'Recording',
				title: 'Studio',
				link: '/programs/'
			},
			'marquee-card'
		],
		['callBand', { heading: 'Help out', label: 'Give', link: '/give/' }, 'call-band']
	] as const)('renders %s through the SSR renderer', (type, attrs, className) => {
		expect(renderDocument(documentWith(type, attrs))).toContain(className);
	});

	it('renders cardRow children through the SSR renderer', () => {
		const card = {
			type: 'card',
			attrs: {
				image: '/uploads/card.webp',
				alt: 'Recording',
				title: 'Studio',
				link: '/programs/'
			}
		};
		const html = renderDocument(documentWith('cardRow', { columns: 3 }, [card]));
		expect(html).toContain('card-row');
		expect(html).toContain('marquee-card');
	});

	it.each([4, 5])('renders a bioGrid with %i bio children', (count) => {
		const bios = Array.from({ length: count }, (_, index) => ({
			type: 'bio',
			attrs: {
				portrait: `/uploads/person-${index}.webp`,
				alt: `Person ${index + 1}`,
				name: `Person ${index + 1}`,
				role: 'Volunteer'
			}
		}));
		const html = renderDocument(documentWith('bioGrid', { heading: 'Our people' }, bios));
		expect(html.match(/class="bio"/g)).toHaveLength(count);
	});

	it('renders gallery images lazily with manifest srcsets and captions as alt', () => {
		const html = renderDocument(
			documentWith('gallery', {
				commentary: '',
				images: [
					{
						path: '/uploads/eccd4717f745c193e5ab33af4cc6682c.webp',
						caption: 'Kids on a bridge'
					}
				]
			})
		);
		expect(html).toContain('loading="lazy"');
		expect(html).toContain('srcset=');
		expect(html).toContain('alt="Kids on a bridge"');
	});

	it('renders the three newest essays in latest mode', () => {
		const html = renderDocument(documentWith('essayList', { mode: 'latest', count: 3, slugs: [] }));
		const titles = [
			'Failure and Frustration Formed a New Foundation',
			'Good News For Teens and Everybody Else Too',
			'How Do We Preach The Gospel? Does Context Matter?'
		];
		for (const title of titles) expect(html).toContain(title);
		expect(html.match(/class="essay-list__item"/g)).toHaveLength(3);
	});
});
