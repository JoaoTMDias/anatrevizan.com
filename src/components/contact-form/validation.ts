import { z } from "zod";
import { contactCountries } from "@/lib/contact-form";
import { isContactScope } from "@/lib/contact-scope";
import type { contactFormCopy, Locale } from "./copy";
import type { ContactFormProps } from "./types";

type FormCopy = (typeof contactFormCopy)[Locale];

export function buildContactSchema(
	t: FormCopy,
	requestTypes: ContactFormProps["requestTypes"],
) {
	return z
		.object({
			channel: z.enum(["email", "whatsapp"]),
			scope: z.string().refine(isContactScope, t.required),
			name: z.string().trim().min(2, t.shortName).max(120),
			email: z.string().trim().max(254),
			whatsapp: z.string().trim().max(32),
			requestType: z
				.string()
				.min(1, t.required)
				.refine(
					(value) => requestTypes.some((option) => option.value === value),
					t.required,
				),
			country: z
				.string()
				.refine(
					(value) =>
						!value || contactCountries.some((option) => option.value === value),
					t.required,
				),
			message: z.string().trim().min(20, t.shortMessage).max(5_000),
			website: z.string().max(0),
			turnstileToken: z.string(),
		})
		.superRefine((values, context) => {
			const validRequestType = requestTypes.some(
				(option) =>
					option.value === values.requestType && option.scope === values.scope,
			);
			if (!validRequestType) {
				context.addIssue({
					code: "custom",
					path: ["requestType"],
					message: t.required,
				});
			}

			if (values.channel !== "email") return;

			const email = z.email().safeParse(values.email);
			if (!email.success) {
				context.addIssue({
					code: "custom",
					path: ["email"],
					message: t.invalidEmail,
				});
			}

			if (!values.turnstileToken) {
				context.addIssue({
					code: "custom",
					path: ["turnstileToken"],
					message: t.turnstileError,
				});
			}
		});
}
