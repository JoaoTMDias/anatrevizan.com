import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../tina/__generated__/client';
import type { EditorialDocument } from './editorial';
export const getConfig = () => requestWithMetadata(client.queries.config({ relativePath: 'site.json' }));
export const getEditorial = (relativePath: string) => requestWithMetadata(client.queries.editorial({ relativePath }), { priority: 'primary' });
export async function listEditorial() {
	const result = await client.queries.editorialConnection({ first: 100 });
	return (result.data.editorialConnection.edges ?? []).flatMap((edge) => edge?.node ? [edge.node] : []);
}
export type CmsConfig = Awaited<ReturnType<typeof getConfig>>['data']['config'];
export type CmsEditorial = Awaited<ReturnType<typeof getEditorial>>['data']['editorial'];
export function toEditorialDocument(document: CmsEditorial): EditorialDocument {
	return { translationGroup: document.translationGroup, locale: document.locale as EditorialDocument['locale'], routeKey: document.routeKey as EditorialDocument['routeKey'], slug: document.slug, status: document.status as EditorialDocument['status'], title: document.title, seoTitle: document.seo.title, seoDescription: document.seo.description, approvalPending: document.approvalPending };
}
