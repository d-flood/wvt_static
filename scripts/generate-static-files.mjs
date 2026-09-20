#!/usr/bin/env node

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { legacyRoutes } from './legacy-routes.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const build = resolve(root, 'build');
const origin = 'https://www.wevalueteens.com';

const escapeHtml = (value) =>
	value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

const outputPath = (route) =>
	route === '/' ? join(build, 'index.html') : join(build, route.slice(1), 'index.html');

function redirectPage(source, target) {
	const escapedSource = escapeHtml(source);
	const escapedTarget = escapeHtml(target);
	const canonical = `${origin}${target}`;
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Redirecting ${escapedSource} · We Value Teens</title>
		<meta name="description" content="This We Value Teens page has moved to ${escapedTarget}">
		<meta http-equiv="refresh" content="0; url=${escapedTarget}">
		<link rel="canonical" href="${canonical}">
	</head>
	<body><p>This page has moved to <a href="${escapedTarget}">${escapedTarget}</a>.</p></body>
</html>
`;
}

function htmlFiles(directory) {
	return readdirSync(directory, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
		.map((entry) => join(entry.parentPath, entry.name));
}

const routes = legacyRoutes();
for (const { source, target } of routes) {
	if (source === target) continue;
	const path = outputPath(source);
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, redirectPage(source, target));
}

const notFoundSource = join(build, '404', 'index.html');
writeFileSync(join(build, '404.html'), readFileSync(notFoundSource));

const canonicalPages = new Map();
const titles = new Set();
for (const path of htmlFiles(build)) {
	const html = readFileSync(path, 'utf8');
	const canonical = html.match(/<link rel="canonical" href="([^"]+)"/u)?.[1];
	if (!canonical) continue;
	const title = html.match(/<title>([^<]+)<\/title>/u)?.[1]?.trim();
	const description = html.match(/<meta name="description" content="([^"]+)"/u)?.[1]?.trim();
	if (!title || !description) throw new Error(`${path} needs a title and description`);
	if (canonicalPages.has(canonical)) continue;
	if (titles.has(title)) throw new Error(`Canonical page title is not unique: ${title}`);
	titles.add(title);
	canonicalPages.set(canonical, path);
}

const urls = [...canonicalPages.keys()].sort();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `\t<url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(build, 'sitemap.xml'), sitemap);
writeFileSync(join(build, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);

console.log(`static-files: ${routes.filter(({ source, target }) => source !== target).length} redirects, ${urls.length} canonical URLs`);
