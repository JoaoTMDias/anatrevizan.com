import type { TinaField } from "tinacms";

const text = (name: string, label: string, required = true): TinaField => ({
	name,
	label,
	type: "string",
	required,
});

const stringList = (
	name: string,
	label: string,
	required = true,
): TinaField => ({
	name,
	label,
	type: "string",
	list: true,
	required,
});

export const academicHubFields: TinaField[] = [
	{
		name: "academicHub",
		label: "Academic hub sections",
		type: "object",
		fields: [
			text("subtitle", "Subtitle"),
			text("introText", "Introduction"),
			{
				name: "sections",
				label: "Academic areas",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("title", "Title"),
					text("description", "Description"),
					text("routeKey", "Destination"),
					text("cta", "CTA"),
					{
						name: "highlight",
						label: "Highlight",
						type: "boolean",
					},
				],
			},
			text("ctaHeading", "CTA heading"),
			text("ctaText", "CTA text"),
		],
	},
];

export const academicServiceFields: TinaField[] = [
	{
		name: "academicService",
		label: "Academic service sections",
		type: "object",
		fields: [
			text("subtitle", "Subtitle"),
			text("introHeading", "Introduction heading"),
			stringList("introParagraphs", "Introduction paragraphs"),
			text("servicesHeading", "Services heading"),
			text("servicesSubtitle", "Services introduction", false),
			{
				name: "services",
				label: "Services",
				type: "object",
				list: true,
				required: true,
				fields: [text("title", "Title"), text("description", "Description")],
			},
			text("note", "Professional note"),
			text("ctaHeading", "CTA heading"),
			text("ctaText", "CTA text"),
		],
	},
];

export const publicationsPageFields: TinaField[] = [
	{
		name: "publicationsPage",
		label: "Publications page sections",
		type: "object",
		fields: [
			text("tag", "Tag"),
			text("subtitle", "Subtitle"),
			text("introText", "Introduction"),
			text("orcidNote", "ORCID note"),
			{
				name: "filters",
				label: "Filter labels",
				type: "object",
				fields: [
					text("allYears", "All years"),
					text("allTopics", "All topics"),
					text("allLanguages", "All languages"),
					text("clear", "Clear filters"),
					text("singleResult", "Single result"),
					text("multipleResults", "Multiple results"),
					text("view", "View publication"),
					text("empty", "Empty state"),
				],
			},
			{
				name: "publications",
				label: "Static ORCID snapshot (integration deferred)",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("sourceId", "Source ID"),
					text("title", "Title"),
					text("journal", "Journal", false),
					text("year", "Year", false),
					{
						name: "priority",
						label: "Editorial priority",
						type: "number",
						description: "Lower values appear first; items without priority are ordered by year.",
					},
					text("type", "Type", false),
					text("doi", "DOI", false),
					text("url", "URL", false),
					text("language", "Language", false),
					stringList("topics", "Topics", false),
					text("highlight", "Highlight", false),
					{
						name: "linkStatus",
						label: "Source link status",
						type: "string",
						options: ["valid", "missing", "placeholder"],
						required: true,
					},
				],
			},
			text("ctaHeading", "CTA heading"),
			text("ctaText", "CTA text"),
		],
	},
];

export const eventsPageFields: TinaField[] = [
	{
		name: "eventsPage",
		label: "Events page sections",
		type: "object",
		fields: [
			text("tag", "Tag"),
			text("subtitle", "Subtitle"),
			text("emptyHeading", "Empty-state heading"),
			text("emptyText", "Empty-state text"),
			text("speakerKitCta", "Speaker kit CTA"),
			{
				name: "entries",
				label: "Event entries",
				type: "object",
				list: true,
				fields: [
					text("slug", "Slug"),
					{ name: "date", label: "Date", type: "datetime", required: true },
					text("city", "City"),
					text("country", "Country"),
					text("event", "Event"),
					text("institution", "Institution"),
					text("topic", "Topic", false),
					text("role", "Role", false),
					text("url", "URL", false),
				],
			},
			text("ctaHeading", "CTA heading"),
			text("ctaText", "CTA text"),
		],
	},
];

export const speakingPageFields: TinaField[] = [
	{
		name: "speakingPage",
		label: "Speaking page sections",
		type: "object",
		fields: [
			text("tag", "Tag"),
			text("subtitle", "Subtitle"),
			text("photoPlaceholderLabel", "Photo placeholder label"),
			text("bioHeading", "Biography heading"),
			stringList("bioParagraphs", "Biography paragraphs"),
			text("topicsHeading", "Topics heading"),
			stringList("topics", "Topics"),
			text("kitHeading", "Kit heading"),
			stringList("kitItems", "Kit contents"),
			text("kitDownloadLabel", "Future kit download label"),
			text("inviteCta", "Invite CTA"),
			text("ctaHeading", "CTA heading"),
			text("ctaText", "CTA text"),
		],
	},
];
