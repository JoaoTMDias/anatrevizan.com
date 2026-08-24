import type { TinaField } from "tinacms";
import {
	pathFor,
	routeKeys,
	type PublishedLocale,
	type RouteKey,
} from "../../src/lib/routing";

export const localizedDocumentFields: TinaField[] = [
	{
		name: "translationGroup",
		label: "Translation group",
		type: "string",
		required: true,
		description: "Stable identifier shared by all translations of this item.",
	},
	{
		name: "locale",
		label: "Language",
		type: "string",
		required: true,
		options: [
			{ label: "Português (Portugal)", value: "pt-PT" },
			{ label: "English", value: "en" },
			{ label: "Español (preparação)", value: "es" },
		],
	},
	{ name: "slug", label: "Localized slug", type: "string", required: true },
	{
		name: "status",
		label: "Editorial status",
		type: "string",
		required: true,
		options: [
			{ label: "Draft", value: "draft" },
			{ label: "Ready", value: "ready" },
		],
	},
	{
		name: "approvalPending",
		label: "Awaiting approval",
		type: "boolean",
		required: true,
	},
	{
		name: "title",
		label: "Localized title",
		type: "string",
		isTitle: true,
		required: true,
	},
	{
		name: "summary",
		label: "Localized summary",
		type: "string",
		ui: { component: "textarea" },
	},
	{
		name: "seo",
		label: "Localized SEO",
		type: "object",
		required: true,
		fields: [
			{ name: "title", label: "Meta title", type: "string", required: true },
			{
				name: "description",
				label: "Meta description",
				type: "string",
				required: true,
				ui: { component: "textarea" },
			},
			{ name: "image", label: "Social image", type: "image" },
			{ name: "noindex", label: "Prevent indexing", type: "boolean" },
		],
	},
	{
		name: "media",
		label: "Images and media",
		type: "object",
		fields: [
			{ name: "image", label: "Image", type: "image" },
			{ name: "alt", label: "Localized alternative text", type: "string" },
			{ name: "video", label: "Optional final video", type: "image" },
			{ name: "poster", label: "Video poster/fallback", type: "image" },
		],
	},
];

export const parentRouteField: TinaField = {
	name: "parentRouteKey",
	label: "Parent page",
	type: "string",
	required: true,
	options: routeKeys.map((value) => ({ label: value, value })),
};

export const entityUi = () => ({
	filename: {
		readonly: true,
		slugify: (values: Record<string, string>) => `${values.translationGroup}`,
	},
	router: ({ document }: { document: Record<string, unknown> }) => {
		const locale = document.locale as PublishedLocale;
		const routeKey = document.parentRouteKey as RouteKey;
		return locale === "pt-PT" || locale === "en"
			? pathFor(routeKey, locale)
			: undefined;
	},
});
