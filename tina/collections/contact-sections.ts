import type { TinaField } from "tinacms";

const text = (name: string, label: string, required = true): TinaField => ({
	name,
	label,
	type: "string",
	required,
});

export const contactPageFields: TinaField[] = [
	{
		name: "contactPage",
		label: "Contact page sections",
		type: "object",
		fields: [
			text("tag", "Tag"),
			text("subtitle", "Subtitle"),
			{
				name: "formCopy",
				label: "Future contact form copy",
				type: "object",
				fields: [
					text("nameLabel", "Name label"),
					text("whatsappLabel", "WhatsApp label"),
					text("emailLabel", "Email label"),
					text("countryLabel", "Country label"),
					text("subjectLabel", "Subject label"),
					text("subjectPlaceholder", "Subject placeholder"),
					text("consentText", "Consent text"),
					text("privacyPolicyLabel", "Privacy policy label"),
					text("submitLabel", "Submit label"),
					text("successMessage", "Success message"),
					text("errorMessage", "Error message"),
					{
						name: "countries",
						label: "Country options",
						type: "string",
						list: true,
						required: true,
					},
				],
			},
			text("otherMethodsHeading", "Other contact methods heading"),
			{
				name: "contactMethods",
				label: "Historical contact methods",
				type: "object",
				list: true,
				required: true,
				fields: [
					text("label", "Label"),
					text("value", "Value", false),
					{
						name: "status",
						label: "Destination status",
						type: "string",
						required: true,
						options: ["unconfirmed", "missing", "placeholder"],
					},
				],
			},
			text("countriesLabel", "Countries label"),
			text("languagesLabel", "Languages label"),
			text("bookingCta", "Booking CTA"),
		],
	},
];

export const bookingPageFields: TinaField[] = [
	{
		name: "bookingPage",
		label: "Booking page sections",
		type: "object",
		fields: [
			text("tag", "Tag"),
			text("subtitle", "Subtitle"),
			text("duration", "Duration"),
			text("validFor", "Applicable topics"),
			text("timezone", "Timezone"),
			text("timezoneNote", "Timezone note"),
		],
	},
];
