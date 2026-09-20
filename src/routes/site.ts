import { createBlockRegistry, createSchema } from 'uncial/core';
import * as svelteRuntime from 'uncial/runtime/svelte';
import type { UncialCmsSiteConfig } from 'uncial-cms';
import { ESSAY_CATEGORIES } from '$lib/essay-categories';
import { essays } from '$lib/essay-index.js';
import { LINK_OPTIONS, LINK_VALUES } from '$lib/site-routes.js';
import siteDocument from '../../content/site.json';
import Hero from '$lib/blocks/Hero.svelte';
import FactBand from '$lib/blocks/FactBand.svelte';
import CardRow from '$lib/blocks/CardRow.svelte';
import Card from '$lib/blocks/Card.svelte';
import CallBand from '$lib/blocks/CallBand.svelte';
import ProseBand from '$lib/blocks/ProseBand.svelte';
import ProgramSection from '$lib/blocks/ProgramSection.svelte';
import Gallery from '$lib/blocks/Gallery.svelte';
import BioGrid from '$lib/blocks/BioGrid.svelte';
import Bio from '$lib/blocks/Bio.svelte';
import EssayList from '$lib/blocks/EssayList.svelte';

export const siteConfig: UncialCmsSiteConfig = {
	forge: 'github',
	repo: 'd-flood/wvt_static',
	branch: 'main',
	contentDir: 'content',
	authWorkerUrl: 'https://uncial-cms-auth.dflood.workers.dev',
	appSlug: 'uncial-cms',
	mediaDir: 'static/uploads'
};

const nonEmpty = (value: unknown): value is string =>
	typeof value === 'string' && value.trim().length > 0;
const linkChoice = (value: unknown): value is string =>
	typeof value === 'string' && LINK_VALUES.has(value);

const facts = (value: unknown): value is Array<{ label: string; value: string }> =>
	Array.isArray(value) &&
	value.length >= 2 &&
	value.length <= 4 &&
	value.every(
		(fact) =>
			typeof fact === 'object' &&
			fact !== null &&
			nonEmpty((fact as Record<string, unknown>).label) &&
			nonEmpty((fact as Record<string, unknown>).value)
	);

const galleryImages = (value: unknown): value is Array<{ path: string; caption: string }> =>
	Array.isArray(value) &&
	value.every(
		(image) =>
			typeof image === 'object' &&
			image !== null &&
			nonEmpty((image as Record<string, unknown>).path) &&
			typeof (image as Record<string, unknown>).caption === 'string'
	);

const stringList = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((item) => typeof item === 'string');

const hero = svelteRuntime.defineSvelteBlock({
	id: 'hero',
	label: 'Hero',
	description: 'A photographic page opener with its headline inside the image.',
	attributes: {
		image: { default: '', required: true, validate: nonEmpty },
		alt: { default: '', required: true, validate: nonEmpty },
		eyebrow: '',
		headline: { default: '', required: true, validate: nonEmpty },
		lede: { default: '', input: 'textarea' },
		primaryLabel: '',
		primaryLink: { default: '/', options: LINK_OPTIONS, validate: linkChoice },
		primaryExternalUrl: { default: '', input: 'hidden' },
		secondaryLabel: '',
		secondaryLink: {
			default: '/',
			options: LINK_OPTIONS,
			validate: linkChoice
		},
		secondaryExternalUrl: { default: '', input: 'hidden' }
	},
	component: Hero
});

const factBand = svelteRuntime.defineSvelteBlock({
	id: 'factBand',
	label: 'Fact band',
	description: 'Two to four key facts shown on an amber band.',
	attributes: {
		facts: {
			default: [
				{ label: 'Hours', value: siteDocument.meta.hours },
				{
					label: 'Location',
					value: `${siteDocument.meta.addressLine}, ${siteDocument.meta.city}`
				}
			],
			list: { itemLabel: 'fact', fields: { label: '', value: '' } },
			validate: facts
		}
	},
	component: FactBand
});

const cardRow = svelteRuntime.defineSvelteBlock({
	id: 'cardRow',
	label: 'Card row',
	description: 'A row of two, three, or four cards.',
	attributes: {
		columns: {
			default: 3,
			options: [2, 3, 4],
			validate: (value) => [2, 3, 4].includes(Number(value))
		}
	},
	component: CardRow,
	content: { kind: 'flow', allowedBlocks: ['card'] }
});

const card = svelteRuntime.defineSvelteBlock({
	id: 'card',
	label: 'Card',
	description: 'A linked photographic card for a page or program.',
	attributes: {
		image: { default: '', required: true, validate: nonEmpty },
		alt: { default: '', required: true, validate: nonEmpty },
		title: { default: '', required: true, validate: nonEmpty },
		blurb: { default: '', input: 'textarea' },
		link: {
			default: '/',
			required: true,
			options: LINK_OPTIONS,
			validate: linkChoice
		},
		externalUrl: { default: '', input: 'hidden' }
	},
	component: Card
});

const callBand = svelteRuntime.defineSvelteBlock({
	id: 'callBand',
	label: 'Call band',
	description: 'A red call-to-action band.',
	attributes: {
		heading: { default: '', required: true, validate: nonEmpty },
		body: { default: '', input: 'textarea' },
		label: { default: '', required: true, validate: nonEmpty },
		link: {
			default: '/',
			required: true,
			options: LINK_OPTIONS,
			validate: linkChoice
		},
		externalUrl: { default: '', input: 'hidden' }
	},
	component: CallBand
});

const proseBand = svelteRuntime.defineSvelteBlock({
	id: 'proseBand',
	label: 'Prose band',
	description: 'A cream reading ground for prose on an ink page.',
	attributes: {},
	component: ProseBand,
	content: { kind: 'flow' }
});

const programSection = svelteRuntime.defineSvelteBlock({
	id: 'programSection',
	label: 'Program section',
	description: 'A photographic section for one Program.',
	attributes: {
		title: { default: '', required: true, validate: nonEmpty },
		image: { default: '', required: true, validate: nonEmpty },
		alt: { default: '', required: true, validate: nonEmpty }
	},
	component: ProgramSection,
	content: { kind: 'flow' }
});

const gallery = svelteRuntime.defineSvelteBlock({
	id: 'gallery',
	label: 'Gallery',
	description: 'A responsive photograph gallery with bulk upload.',
	attributes: {
		commentary: { default: '', input: 'textarea' },
		images: { default: [] as Array<{ path: string; caption: string }>, input: 'hidden', validate: galleryImages }
	},
	component: Gallery
});

const bioGrid = svelteRuntime.defineSvelteBlock({
	id: 'bioGrid',
	label: 'Bio grid',
	description: 'A group of board member or volunteer Bios.',
	attributes: {
		heading: { default: '', required: true, validate: nonEmpty }
	},
	component: BioGrid,
	content: { kind: 'flow', allowedBlocks: ['bio'] }
});

const bio = svelteRuntime.defineSvelteBlock({
	id: 'bio',
	label: 'Bio',
	description: 'A portrait and short biography.',
	attributes: {
		portrait: { default: '', required: true, validate: nonEmpty },
		alt: { default: '', required: true, validate: nonEmpty },
		name: { default: '', required: true, validate: nonEmpty },
		role: { default: '', required: true, validate: nonEmpty },
		prose: { default: '', input: 'textarea' }
	},
	component: Bio
});

const essayList = svelteRuntime.defineSvelteBlock({
	id: 'essayList',
	label: 'Essay list',
	description: 'The latest Essays or an editor-selected featured list.',
	attributes: {
		mode: {
			default: 'latest',
			options: ['latest', 'featured'],
			validate: (value) => value === 'latest' || value === 'featured'
		},
		count: {
			default: 3,
			input: 'number',
			validate: (value) => typeof value === 'number' && Number.isInteger(value) && value >= 0
		},
		slugs: {
			default: [] as string[],
			list: {
				itemLabel: 'essay',
				value: { default: '', options: essays.map((essay) => ({ value: essay.slug, label: essay.title })) }
			},
			validate: stringList
		}
	},
	component: EssayList
});

export const blocks = createBlockRegistry([
	hero,
	factBand,
	cardRow,
	card,
	callBand,
	proseBand,
	programSection,
	gallery,
	bioGrid,
	bio,
	essayList
]);

const metaFields = (essayRequired: boolean) => ({
	title: { default: 'Untitled page', required: true },
	date: essayRequired ? { default: '', required: true } : { default: '' },
	byline: { default: 'Dave Flood' },
	category: essayRequired
		? { default: '', required: true, options: ESSAY_CATEGORIES }
		: { default: '', options: ESSAY_CATEGORIES },
	summary: essayRequired
		? { default: '', required: true, input: 'textarea' }
		: { default: '', input: 'textarea' },
	legacyTags: { default: [] as string[], input: 'hidden' },
	siteName: { default: '' },
	tagline: { default: '' },
	hours: { default: '' },
	addressLine: { default: '' },
	city: { default: '' },
	phone: { default: '' },
	donateUrl: { default: '' },
	facebook: { default: '' },
	youtube: { default: '' },
	instagram: { default: '' }
});

export const schema = createSchema(blocks, {
	metaFields: metaFields(false)
});

export const essaySchema = createSchema(blocks, {
	metaFields: metaFields(true)
});

export const localContentDir = 'content';

// content/image-manifest.json is output of the image port, not a Content
// document: it backs no page, and an Editor variant would rewrite it as one and
// take every responsive image down with it.
export const isEditablePage = ({ path }: { path: string }) => path !== 'image-manifest';

// site.json is edited like any other page but renders no reader page of its own.
export const isReaderPage = (entry: { path: string }) =>
	isEditablePage(entry) && entry.path !== 'site';

