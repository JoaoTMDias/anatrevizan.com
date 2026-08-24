import assert from 'node:assert/strict';
import test from 'node:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { alternatePath, editorialLocales, pathFor, publishedLocales, routeKeys, routeMap } from '../src/lib/routing.ts';
import { isPublishable, validateEditorialDocuments, type EditorialDocument } from '../src/lib/editorial.ts';

const docs = routeKeys.flatMap((routeKey) => publishedLocales.map((locale) => ({
	translationGroup: routeKey,
	locale,
	routeKey,
	slug: pathFor(routeKey, locale).replace(/^\/en\/?/, '/').replace(/^\//, ''),
	status: 'draft' as const,
	title: routeKey,
	seoTitle: routeKey,
	seoDescription: routeKey,
	approvalPending: true,
})));

test('o mapa contém 19 pares PT↔EN únicos e reversíveis', () => {
	assert.equal(routeKeys.length, 19);
	assert.deepEqual(publishedLocales, ['pt-PT', 'en']);
	assert.ok(editorialLocales.includes('es'));
	const allPaths = routeKeys.flatMap((key) => Object.values(routeMap[key]));
	assert.equal(new Set(allPaths).size, 38);
	for (const key of routeKeys) assert.equal(alternatePath(pathFor(key, 'pt-PT')), pathFor(key, 'en'));
});

test('documentos estruturais válidos têm pares completos', () => assert.deepEqual(validateEditorialDocuments(docs), []));

test('os documentos Tina reais respeitam o mapa e as regras editoriais', () => {
	const directory = join(process.cwd(), 'src/content/editorial');
	const actual = readdirSync(directory).filter((file) => file.endsWith('.json')).map((file) => {
		const value = JSON.parse(readFileSync(join(directory, file), 'utf8'));
		return { ...value, seoTitle: value.seo.title, seoDescription: value.seo.description } as EditorialDocument;
	});
	assert.equal(actual.length, 38);
	assert.deepEqual(validateEditorialDocuments(actual), []);
});

test('a navegação global preserva os menus Consultoria e Academia', () => {
	const config = JSON.parse(readFileSync(join(process.cwd(), 'src/content/config/site.json'), 'utf8'));
	const menus = config.navigation.filter((item: { type: string }) => item.type === 'menu');
	assert.deepEqual(menus.map((item: { routeKey: string }) => item.routeKey), ['consulting', 'academic']);
	assert.deepEqual(menus.map((item: { children: unknown[] }) => item.children.length), [5, 5]);
	for (const menu of menus) for (const child of menu.children) assert.ok(routeKeys.includes(child.routeKey));
});

test('deteta slugs duplicados', () => {
	const duplicate = { ...docs[1], translationGroup: 'other', routeKey: 'about' as const };
	assert.ok(validateEditorialDocuments([...docs, duplicate]).some((issue) => issue.code === 'duplicate-slug'));
});

test('deteta locales inválidos', () => {
	const invalid = { ...docs[0], locale: 'pt-BR' } as unknown as EditorialDocument;
	assert.ok(validateEditorialDocuments([invalid, ...docs.slice(1)]).some((issue) => issue.code === 'invalid-locale'));
});

test('deteta traduções ausentes', () => {
	assert.ok(validateEditorialDocuments(docs.filter((doc) => !(doc.routeKey === 'about' && doc.locale === 'en'))).some((issue) => issue.code === 'missing-translation'));
});

test('aceita apenas draft|ready e nunca publica drafts ou conteúdo por aprovar', () => {
	assert.equal(isPublishable(docs[0]), false);
	assert.equal(isPublishable({ ...docs[0], status: 'ready', approvalPending: true }), false);
	assert.equal(isPublishable({ ...docs[0], status: 'ready', approvalPending: false }), true);
	const invalid = { ...docs[0], status: 'published' } as unknown as EditorialDocument;
	assert.ok(validateEditorialDocuments([invalid, ...docs.slice(1)]).some((issue) => issue.code === 'invalid-status'));
});
