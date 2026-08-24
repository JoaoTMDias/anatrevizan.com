import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { ConfigQuery, EditorialQuery } from '../../tina/__generated__/types';
import type { CmsConfig, CmsEditorial } from './data';
import EditorialBody from '../components/islands/EditorialBody.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { getConfig, getEditorial } from './data';
export const islands: IslandRegistry = {
	editorial: { fetch: (_request, params) => getEditorial(params.get('relativePath') ?? ''), component: EditorialBody, wrapper: { tag: 'main' }, propsFromData: (data) => ({ data: (data as QueryResult<EditorialQuery>).data?.editorial as CmsEditorial | undefined }) },
	global: { fetch: () => getConfig(), component: Header, wrapper: { tag: 'div' }, propsFromData: (data) => ({ config: (data as QueryResult<ConfigQuery>).data?.config as CmsConfig | undefined }) },
	'global-footer': { fetch: () => getConfig(), component: Footer, wrapper: { tag: 'div' }, propsFromData: (data) => ({ config: (data as QueryResult<ConfigQuery>).data?.config as CmsConfig | undefined }) },
};
