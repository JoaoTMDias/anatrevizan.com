import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { editorialLocales, isRouteKey, publishedLocales } from '../src/lib/routing.ts';
import { editorialStatuses, validateEditorialDocuments, type EditorialDocument } from '../src/lib/editorial.ts';

const root = process.cwd();
const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const readCollection = (name: string) => readdirSync(join(root, 'src/content', name)).filter((file) => file.endsWith('.json')).map((file) => ({ file, value: readJson(join(root, 'src/content', name, file)) }));
const errors: string[] = [];

const pages = readCollection('editorial').map(({ file, value }) => ({ file, value: { ...value, seoTitle: value.seo?.title, seoDescription: value.seo?.description } as EditorialDocument }));
for (const issue of validateEditorialDocuments(pages.map(({ value }) => value))) errors.push(`[pages/${issue.code}] ${issue.message}`);

for (const collection of ['services', 'events', 'talks', 'training', 'mentoring']) {
	const documents = readCollection(collection);
	const seenSlugs = new Set<string>();
	const groups = new Map<string, Set<string>>();
	for (const { file, value } of documents) {
		if (!editorialLocales.includes(value.locale)) errors.push(`[${collection}/${file}] locale inválido: ${value.locale}`);
		if (!editorialStatuses.includes(value.status)) errors.push(`[${collection}/${file}] estado inválido: ${value.status}`);
		if (value.status === 'ready' && value.approvalPending) errors.push(`[${collection}/${file}] ready ainda por aprovar`);
		if (!isRouteKey(value.parentRouteKey)) errors.push(`[${collection}/${file}] parentRouteKey inválido: ${value.parentRouteKey}`);
		const slug = `${value.locale}:${value.slug}`;
		if (seenSlugs.has(slug)) errors.push(`[${collection}/${file}] slug duplicado: ${slug}`);
		seenSlugs.add(slug);
		if (!groups.has(value.translationGroup)) groups.set(value.translationGroup, new Set());
		groups.get(value.translationGroup)?.add(value.locale);
	}
	for (const [group, locales] of groups) for (const locale of publishedLocales) if (!locales.has(locale)) errors.push(`[${collection}/${group}] tradução ${locale} ausente`);
}

const config = readJson(join(root, 'src/content/config/site.json'));
for (const item of config.navigation ?? []) {
	if (!isRouteKey(item.routeKey)) errors.push(`[navigation] routeKey inválido: ${item.routeKey}`);
	if (item.type === 'menu' && !(item.children?.length > 0)) errors.push(`[navigation/${item.routeKey}] menu sem filhos`);
	for (const child of item.children ?? []) if (!isRouteKey(child.routeKey)) errors.push(`[navigation/${item.routeKey}] filho inválido: ${child.routeKey}`);
}
for (const cta of config.ctas ?? []) if (cta.routeKey && !isRouteKey(cta.routeKey)) errors.push(`[cta/${cta.id}] routeKey inválido: ${cta.routeKey}`);

if (errors.length) {
	console.error(`Validação editorial falhou com ${errors.length} problema(s):\n${errors.map((error) => `- ${error}`).join('\n')}`);
	process.exitCode = 1;
} else {
	console.log(`Validação editorial passou: ${pages.length} páginas e modelos repetíveis válidos.`);
}
