import { CircleAlert } from "lucide-react";
import type { RefObject } from "react";
import type { FieldErrors } from "react-hook-form";
import type { ContactFormCopy } from "./copy";
import type { FormValues } from "./types";

const ERROR_FIELDS = [
	"name",
	"email",
	"requestType",
	"country",
	"message",
] as const;

interface ErrorSummaryProps {
	t: ContactFormCopy;
	errors: FieldErrors<FormValues>;
	id: (name: string) => string;
	summaryRef: RefObject<HTMLDivElement | null>;
}

export function hasSummarizedErrors(errors: FieldErrors<FormValues>) {
	return ERROR_FIELDS.some((field) => errors[field]);
}

export function ErrorSummary({ t, errors, id, summaryRef }: ErrorSummaryProps) {
	return (
		<div
			ref={summaryRef}
			className="contact-form__error-summary"
			role="alert"
			tabIndex={-1}
		>
			<CircleAlert aria-hidden="true" />
			<div>
				<strong>{t.errorSummary}</strong>
				<ul>
					{ERROR_FIELDS.filter((field) => errors[field]).map((field) => (
						<li key={field}>
							<a
								href={`#${id(field === "requestType" ? "request-type" : field)}`}
							>
								{t[field]}: {errors[field]?.message}
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
