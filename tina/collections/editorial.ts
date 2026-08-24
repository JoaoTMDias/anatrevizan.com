import type { Collection } from "tinacms";
import {
	type PublishedLocale,
	pathFor,
	type RouteKey,
	routeKeys,
} from "../../src/lib/routing";
import { localizedDocumentFields } from "./common";
import {
	academicHubFields,
	academicServiceFields,
	eventsPageFields,
	publicationsPageFields,
	speakingPageFields,
} from "./academic-sections";
import {
	aboutFields,
	consultingHubFields,
	consultingServiceFields,
	homeFields,
} from "./editorial-sections";
import { bookingPageFields, contactPageFields } from "./contact-sections";

export const EditorialCollection: Collection = {
	name: "editorial",
	label: "Localized pages",
	path: "src/content/editorial",
	format: "json",
	ui: {
		filename: {
			readonly: true,
			slugify: (values) => `${values.translationGroup}`,
		},
		router: ({ document }) => {
			const locale = document.locale as PublishedLocale;
			const routeKey = document.routeKey as RouteKey;
			return locale === "pt-PT" || locale === "en"
				? pathFor(routeKey, locale)
				: undefined;
		},
	},
	fields: [
		...localizedDocumentFields.slice(0, 2),
		{
			name: "routeKey",
			label: "Canonical route",
			type: "string",
			required: true,
			options: routeKeys.map((value) => ({ label: value, value })),
		},
		...localizedDocumentFields.slice(2),
		{
			name: "body",
			label: "Page content",
			type: "string",
			ui: { component: "textarea" },
		},
		...homeFields,
		...aboutFields,
		...consultingHubFields,
		...consultingServiceFields,
		...academicHubFields,
		...academicServiceFields,
		...publicationsPageFields,
		...eventsPageFields,
		...speakingPageFields,
		...contactPageFields,
		...bookingPageFields,
		{ name: "ctaRefs", label: "CTA identifiers", type: "string", list: true },
		{
			name: "legal",
			label: "Legal document controls",
			type: "object",
			fields: [
				{ name: "version", label: "Reviewed version", type: "string" },
				{ name: "effectiveDate", label: "Effective date", type: "datetime" },
				{ name: "reviewedBy", label: "Qualified reviewer", type: "string" },
			],
		},
	],
};
