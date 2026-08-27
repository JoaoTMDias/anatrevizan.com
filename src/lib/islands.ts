import type { QueryResult } from "@tinacms/astro/data";
import type { IslandRegistry } from "@tinacms/astro/experimental";
import type {
	ConfigQuery,
	EditorialQuery,
} from "../../tina/__generated__/types";
import Footer from "../components/Footer.astro";
import Header from "../components/Header.astro";
import EditorialBody from "../components/islands/EditorialBody.astro";
import type { CmsConfig } from "./data";
import { getConfig, getEditorial, localizeEditorial } from "./data";
import { isPublishedLocale } from "./routing";
import { type IslandContext, islandContextFromParams } from "./island-context";

function contextProps(params: URLSearchParams): Partial<IslandContext> {
	return islandContextFromParams(params) ?? {};
}

export const islands: IslandRegistry = {
	editorial: {
		fetch: (_request, params) => getEditorial(params.get("relativePath") ?? ""),
		component: EditorialBody,
		wrapper: { tag: "main" },
		propsFromData: (data, params) => {
			const raw = (data as QueryResult<EditorialQuery>).data?.editorial;
			const locale = params.get("locale");
			return {
				data:
					raw && isPublishedLocale(locale)
						? localizeEditorial(raw, locale)
						: undefined,
			};
		},
	},
	global: {
		fetch: () => getConfig(),
		component: Header,
		wrapper: { tag: "div" },
		propsFromData: (data, params) => ({
			config: (data as QueryResult<ConfigQuery>).data?.config as
				| CmsConfig
				| undefined,
			...contextProps(params),
		}),
	},
	"global-footer": {
		fetch: () => getConfig(),
		component: Footer,
		wrapper: { tag: "div" },
		propsFromData: (data, params) => ({
			config: (data as QueryResult<ConfigQuery>).data?.config as
				| CmsConfig
				| undefined,
			...contextProps(params),
		}),
	},
};
