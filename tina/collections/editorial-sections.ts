import type { TinaField } from "tinacms";

const text = (name: string, label: string, required = true): TinaField => ({
	name,
	label,
	type: "string",
	required,
	ui: { component: "textarea" },
});

const cardList = (name: string, label: string): TinaField => ({
	name,
	label,
	type: "object",
	list: true,
	required: true,
	fields: [text("title", "Title"), text("description", "Description")],
});

export const homeFields: TinaField[] = [
	{
		name: "home",
		label: "Home page sections",
		type: "object",
		fields: [
			{
				name: "hero",
				label: "Hero",
				type: "object",
				required: true,
				fields: [
					text("heading", "Heading"),
					text("subtitle", "Subtitle"),
					{
						name: "brandWords",
						label: "Brand words",
						type: "string",
						list: true,
						required: true,
					},
					text("primaryCta", "Primary CTA"),
					text("secondaryCta", "Secondary CTA"),
				],
			},
			{
				name: "gateways",
				label: "Consulting and academic gateways",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("title", "Title"),
					text("eyebrow", "Eyebrow"),
					text("description", "Description"),
					text("cta", "CTA"),
					{
						name: "routeKey",
						label: "Destination",
						type: "string",
						required: true,
					},
				],
			},
			text("differencesTitle", "Differences heading"),
			text("differencesSubtitle", "Differences introduction"),
			cardList("differences", "Differences"),
			text("servicesTitle", "Services heading"),
			text("servicesSubtitle", "Services introduction"),
			{
				name: "services",
				label: "Service summaries",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("title", "Title"),
					text("tag", "Tag"),
					text("description", "Description"),
					text("cta", "CTA"),
					{
						name: "routeKey",
						label: "Destination",
						type: "string",
						required: true,
					},
				],
			},
			text("academicTitle", "Academic heading"),
			text("academicSubtitle", "Academic introduction"),
			text("publicationsCta", "Publications CTA"),
			text("speakerKitCta", "Speaker kit CTA"),
			{
				name: "featuredPublications",
				label: "Static featured publications (ORCID deferred)",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("title", "Title"),
					text("publication", "Publication", false),
					text("year", "Year"),
					text("language", "Language"),
					text("badge", "Badge", false),
					text("url", "URL"),
				],
			},
			text("credentialsLabel", "Credentials label"),
			{
				name: "credentials",
				label: "Credentials",
				type: "string",
				list: true,
				required: true,
			},
			text("finalCtaHeading", "Final CTA heading"),
			text("finalCtaText", "Final CTA text"),
			text("finalCtaLabel", "Final CTA label"),
		],
	},
];

export const aboutFields: TinaField[] = [
	{
		name: "about",
		label: "About page sections",
		type: "object",
		fields: [
			text("tag", "Hero tag"),
			text("subtitle", "Hero subtitle"),
			{
				name: "narrative",
				label: "Narrative paragraphs",
				type: "string",
				list: true,
				required: true,
				ui: { component: "textarea" },
			},
			text("milestonesTitle", "Milestones heading"),
			{
				name: "milestones",
				label: "Milestones",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("year", "Year"),
					text("title", "Title"),
					text("description", "Description"),
				],
			},
			text("currentWorkTitle", "Current work heading"),
			{
				name: "currentWork",
				label: "Current work",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("country", "Country"),
					text("title", "Title"),
					text("description", "Description"),
				],
			},
			text("valuesTitle", "Values heading"),
			text("valuesSubtitle", "Values introduction"),
			cardList("values", "Values"),
			text("networksLabel", "Networks label"),
			{
				name: "networks",
				label: "Networks",
				type: "string",
				list: true,
				required: true,
			},
			text("speakerKitCta", "Speaker kit CTA"),
			text("finalCtaHeading", "Final CTA heading"),
			text("finalCtaText", "Final CTA text"),
			text("finalCtaLabel", "Final CTA label"),
		],
	},
];

const consultingOfferingFields: TinaField[] = [
	text("title", "Title"),
	text("description", "Description", false),
	{
		name: "items",
		label: "Items",
		type: "string",
		list: true,
	},
];

export const consultingHubFields: TinaField[] = [
	{
		name: "consultingHub",
		label: "Consulting hub sections",
		type: "object",
		fields: [
			text("subtitle", "Subtitle"),
			text("introHeading", "Introduction heading"),
			text("introText", "Introduction text"),
			{
				name: "filters",
				label: "Country filters",
				type: "object",
				fields: [
					text("portugal", "Portugal"),
					text("brazil", "Brazil"),
					text("all", "All"),
				],
			},
			{
				name: "areas",
				label: "Consulting areas",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("title", "Title"),
					text("tag", "Tag"),
					text("summary", "Summary"),
					{
						name: "routeKey",
						label: "Destination",
						type: "string",
						required: true,
					},
					{
						name: "countries",
						label: "Country filters",
						type: "string",
						list: true,
						required: true,
					},
				],
			},
			text("areaCta", "Area CTA"),
			text("note", "Professional note"),
			text("ctaHeading", "CTA heading"),
			text("ctaText", "CTA text"),
		],
	},
];

export const consultingServiceFields: TinaField[] = [
	{
		name: "consultingService",
		label: "Consulting service sections",
		type: "object",
		fields: [
			text("tag", "Tag"),
			text("subtitle", "Subtitle"),
			text("introHeading", "Introduction heading"),
			{
				name: "introParagraphs",
				label: "Introduction paragraphs",
				type: "string",
				list: true,
				required: true,
			},
			text("servicesHeading", "Services heading"),
			text("servicesSubtitle", "Services introduction", false),
			{
				name: "services",
				label: "Services",
				type: "object",
				list: true,
				required: true,
				fields: consultingOfferingFields,
			},
			text("stepsHeading", "Steps heading", false),
			text("stepsSubtitle", "Steps introduction", false),
			{
				name: "steps",
				label: "Steps",
				type: "object",
				list: true,
				fields: [
					text("number", "Number"),
					text("title", "Title"),
					text("description", "Description"),
				],
			},
			text("crosslinkHeading", "Related service heading", false),
			text("crosslinkText", "Related service text", false),
			{
				name: "crosslinkRouteKey",
				label: "Related service destination",
				type: "string",
			},
			text("differentiatorEyebrow", "Differentiator eyebrow", false),
			text("differentiatorHeading", "Differentiator heading", false),
			{
				name: "differentiatorParagraphs",
				label: "Differentiator paragraphs",
				type: "string",
				list: true,
			},
			{
				name: "differentiatorCredentials",
				label: "Differentiator credentials",
				type: "string",
				list: true,
			},
			text("relatedWorkHeading", "Related work heading", false),
			text("relatedWorkSubtitle", "Related work introduction", false),
			{
				name: "relatedPublications",
				label: "Static related publications (ORCID deferred)",
				type: "object",
				list: true,
				fields: [
					text("title", "Title"),
					text("publication", "Publication"),
					text("highlight", "Highlight", false),
				],
			},
			text("note", "Professional note", false),
			text("ctaHeading", "CTA heading"),
			text("ctaText", "CTA text"),
		],
	},
];
