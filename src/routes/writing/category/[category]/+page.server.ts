import { error } from '@sveltejs/kit';
import { ESSAY_CATEGORIES, categorySlug } from '$lib/essay-categories.js';
import { essays } from '$lib/essay-index.js';

const categories = ESSAY_CATEGORIES.map((title) => ({ title, slug: categorySlug(title) }));

export const entries = () => categories.map(({ slug }) => ({ category: slug }));

export const load = ({ params }) => {
	const category = categories.find(({ slug }) => slug === params.category);
	if (!category) error(404, 'Category not found');

	return {
		category: category.title,
		essays: essays.filter((essay) => essay.category === category.title)
	};
};
