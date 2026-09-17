import { CircleAlert, CircleCheck } from "lucide-react";
import type { RefObject } from "react";

export type SubmitStatus = "idle" | "sending" | "success" | "error";

interface StatusMessageProps {
	status: SubmitStatus;
	statusMessage: string;
	statusRef: RefObject<HTMLDivElement | null>;
}

export function StatusMessage({
	status,
	statusMessage,
	statusRef,
}: StatusMessageProps) {
	return (
		<div
			ref={statusRef}
			id="contact-form-status"
			className="contact-form__status"
			data-state={status}
			role={status === "error" ? "alert" : "status"}
			tabIndex={status === "success" || status === "error" ? -1 : undefined}
		>
			{status === "success" && <CircleCheck aria-hidden="true" />}
			{status === "error" && <CircleAlert aria-hidden="true" />}
			{status === "success" ? <h2>{statusMessage}</h2> : statusMessage}
		</div>
	);
}
