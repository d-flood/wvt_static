import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Every URL the retired Wagtail site served, paired with the page that
// replaced it. Snapshotted from that site's database when it was retired.
const routesPath = resolve(import.meta.dirname, './legacy-routes.json');

export function legacyRoutes() {
	return JSON.parse(readFileSync(routesPath, 'utf8'));
}
