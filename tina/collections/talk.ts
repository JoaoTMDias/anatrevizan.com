import type { Collection } from "tinacms";
import { entityUi, localizedDocumentFields, parentRouteField } from "./common";
export const TalkCollection: Collection = {
	name: "talk",
	label: "Talks and speaking",
	path: "src/content/talks",
	format: "json",
	ui: entityUi(),
	fields: [
		...localizedDocumentFields,
		parentRouteField,
		{ name: "topics", label: "Topics", type: "string", list: true },
		{ name: "formats", label: "Available formats", type: "string", list: true },
		{ name: "audiences", label: "Audiences", type: "string", list: true },
		{ name: "speakerKit", label: "Speaker kit", type: "image" },
		{
			name: "body",
			label: "Description",
			type: "string",
			ui: { component: "textarea" },
		},
	],
};
