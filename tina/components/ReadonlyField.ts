import { createElement } from "react";

interface ReadonlyFieldProps {
	field: { label?: string | boolean };
	input: { value?: unknown };
}

export function ReadonlyField({ field, input }: ReadonlyFieldProps) {
	const value = input.value;
	const display = value === undefined || value === null || value === "" ? "—" : String(value);
	const label =
		typeof field.label === "string" ? field.label : "Informação ORCID";

	return createElement(
		"div",
		{ className: "mb-5" },
		createElement(
			"p",
			{ className: "mb-1 text-sm font-medium text-gray-700" },
			label,
		),
		createElement(
			"p",
			{
				className:
					"rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700",
			},
			display,
		),
	);
}
