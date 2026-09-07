import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { buildWhatsAppMessage, contactCountries } from "@/lib/contact-form";
import { ChannelFieldset } from "./contact-form/ChannelFieldset";
import { ContactFields } from "./contact-form/ContactFields";
import { contactFormCopy } from "./contact-form/copy";
import { ErrorSummary, hasSummarizedErrors } from "./contact-form/ErrorSummary";
import { FieldError } from "./contact-form/FieldError";
import { StatusMessage, type SubmitStatus } from "./contact-form/StatusMessage";
import { useTurnstileWidget } from "./contact-form/turnstile";
import type {
	ContactFormProps,
	ContactResponse,
	FormValues,
} from "./contact-form/types";
import { WhatsappFallback } from "./contact-form/WhatsappFallback";

function buildSchema(
	t: (typeof contactFormCopy)["pt-PT" | "en"],
	requestTypes: ContactFormProps["requestTypes"],
) {
	return z
		.object({
			channel: z.enum(["email", "whatsapp"]),
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
					(value) => contactCountries.some((option) => option.value === value),
					t.required,
				),
			message: z.string().trim().min(20, t.shortMessage).max(5_000),
			website: z.string().max(0),
			turnstileToken: z.string(),
		})
		.superRefine((values, context) => {
			if (values.channel !== "email") return;
			const email = z.email().safeParse(values.email);
			if (!email.success)
				context.addIssue({
					code: "custom",
					path: ["email"],
					message: t.invalidEmail,
				});
			if (!values.turnstileToken)
				context.addIssue({
					code: "custom",
					path: ["turnstileToken"],
					message: t.turnstileError,
				});
		});
}

export default function ContactForm({
	locale,
	privacyHref,
	requestTypes,
	turnstileSiteKey,
	whatsappHref,
}: ContactFormProps) {
	const t = contactFormCopy[locale];
	const prefix = useId();
	const id = (name: string) => `${prefix}-${name}`;
	const statusRef = useRef<HTMLDivElement>(null);
	const errorSummaryRef = useRef<HTMLDivElement>(null);
	const requestIdRef = useRef<string | null>(null);
	const [channel, setChannel] = useState<FormValues["channel"]>("email");
	const [startedAt, setStartedAt] = useState(() => Date.now());
	const [status, setStatus] = useState<SubmitStatus>("idle");
	const [statusMessage, setStatusMessage] = useState("");
	const [whatsappPreview, setWhatsappPreview] = useState("");
	const [showCopyFallback, setShowCopyFallback] = useState(false);
	const [focusErrorSummary, setFocusErrorSummary] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(buildSchema(t, requestTypes)),
		shouldFocusError: false,
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			channel: "email",
			name: "",
			email: "",
			whatsapp: "",
			requestType: "",
			country: "",
			message: "",
			website: "",
			turnstileToken: "",
		},
	});

	const { containerRef: turnstileContainerRef, resetWidget: resetTurnstile } =
		useTurnstileWidget({
			channel,
			turnstileSiteKey,
			onToken: (token) =>
				setValue("turnstileToken", token, { shouldValidate: true }),
			onExpire: () => setValue("turnstileToken", ""),
			onError: () => {
				setValue("turnstileToken", "");
				setStatus("error");
				setStatusMessage(t.turnstileError);
			},
		});

	// A redirect after a successful email submission carries `?status=sent`.
	useEffect(() => {
		const url = new URL(window.location.href);
		if (url.searchParams.get("status") !== "sent") return;
		setStatus("success");
		setStatusMessage(t.success);
		url.searchParams.delete("status");
		window.history.replaceState(
			null,
			"",
			`${url.pathname}${url.search}${url.hash}`,
		);
		requestAnimationFrame(() => statusRef.current?.focus());
	}, [t.success]);

	useEffect(() => {
		if (!focusErrorSummary || !errorSummaryRef.current) return;
		errorSummaryRef.current.focus();
		setFocusErrorSummary(false);
	}, [focusErrorSummary, errors]);

	function chooseChannel(nextChannel: FormValues["channel"]) {
		setChannel(nextChannel);
		setValue("channel", nextChannel, { shouldValidate: true });
		setStatus("idle");
		setStatusMessage("");
		setWhatsappPreview("");
		setShowCopyFallback(false);
		setStartedAt(Date.now());
	}

	function whatsappMessage(data: FormValues, fallback = false) {
		const country =
			contactCountries.find((item) => item.value === data.country)?.label[
				locale
			] ?? data.country;
		const requestType =
			requestTypes.find((item) => item.value === data.requestType)?.label ??
			data.requestType;
		return [
			fallback ? t.fallbackNote : "",
			buildWhatsAppMessage({
				locale,
				name: data.name,
				requestType,
				country,
				message: data.message,
			}),
			data.email ? `${t.email}: ${data.email}` : "",
			data.whatsapp ? `${t.whatsapp}: ${data.whatsapp}` : "",
		]
			.filter(Boolean)
			.join("\n\n");
	}

	function offerWhatsappFallback(data = getValues()) {
		if (!whatsappHref) return;
		setWhatsappPreview(whatsappMessage(data, true));
	}

	async function submit(data: FormValues) {
		setFocusErrorSummary(false);
		const name = data.name;
		const requestType = data.requestType;
		const countryCode = data.country;
		const message = data.message;

		if (channel === "whatsapp" && whatsappHref) {
			setWhatsappPreview(whatsappMessage(data));
			return;
		}

		if (!turnstileSiteKey || !data.turnstileToken) {
			setStatus("error");
			setStatusMessage(
				turnstileSiteKey ? t.turnstileError : t.configurationError,
			);
			offerWhatsappFallback(data);
			statusRef.current?.focus();
			return;
		}

		setStatus("sending");
		setStatusMessage("");
		try {
			if (!requestIdRef.current) requestIdRef.current = crypto.randomUUID();
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				signal: AbortSignal.timeout(15_000),
				body: JSON.stringify({
					requestId: requestIdRef.current,
					locale,
					name,
					email: data.email,
					whatsapp: data.whatsapp,
					requestType,
					country: countryCode,
					message,
					website: data.website,
					startedAt,
					turnstileToken: data.turnstileToken,
				}),
			});
			const result = (await response.json()) as ContactResponse;
			if (
				result.version !== 1 ||
				result.requestId !== requestIdRef.current ||
				result.code !== "accepted" ||
				!response.ok
			)
				throw new Error(
					result.code === "unavailable" ? "unavailable" : "invalid",
				);
			reset();
			requestIdRef.current = null;
			setStartedAt(Date.now());
			const url = new URL(window.location.href);
			url.search = "?status=sent";
			url.hash = "contact-form-status";
			window.location.replace(url);
		} catch (error) {
			setStatus("error");
			setStatusMessage(t.error);
			if (error instanceof Error && error.message === "unavailable")
				offerWhatsappFallback(data);
		} finally {
			setValue("turnstileToken", "");
			resetTurnstile();
			requestAnimationFrame(() => statusRef.current?.focus());
		}
	}

	function openWhatsapp() {
		if (!whatsappHref || !whatsappPreview) return;
		const destination = `${whatsappHref}?text=${encodeURIComponent(whatsappPreview)}`;
		if (destination.length > 2_000) {
			setStatus("error");
			setStatusMessage(t.fallbackTooLong);
			statusRef.current?.focus();
			return;
		}
		const opened = window.open(destination, "_blank", "noopener,noreferrer");
		if (!opened) setShowCopyFallback(true);
	}

	async function copyWhatsappFallback() {
		if (!whatsappPreview) return;
		try {
			await navigator.clipboard.writeText(whatsappPreview);
			setShowCopyFallback(true);
		} catch {
			setShowCopyFallback(true);
		}
	}

	const countries = contactCountries.map((country) => ({
		value: country.value,
		label: country.label[locale],
	}));

	return (
		<form
			className="contact-form"
			lang={locale}
			aria-label={t.formLabel}
			aria-describedby={id("privacy-notice")}
			onSubmit={handleSubmit(submit, () => {
				setFocusErrorSummary(true);
			})}
			noValidate
		>
			{hasSummarizedErrors(errors) && (
				<ErrorSummary
					t={t}
					errors={errors}
					id={id}
					summaryRef={errorSummaryRef}
				/>
			)}

			<ChannelFieldset
				t={t}
				id={id}
				channel={channel}
				whatsappHref={whatsappHref}
				onSelect={chooseChannel}
			/>

			<ContactFields
				t={t}
				id={id}
				channel={channel}
				errors={errors}
				register={register}
				requestTypes={requestTypes}
				countries={countries}
				privacyHref={privacyHref}
			/>

			{channel === "email" ? (
				<>
					{!turnstileSiteKey && (
						<p className="contact-form__configuration" role="status">
							{t.configurationError}
						</p>
					)}
					<div
						ref={turnstileContainerRef}
						className="contact-form__turnstile"
					/>
					<input type="hidden" {...register("turnstileToken")} />
					<FieldError
						id={id("turnstile-error")}
						message={errors.turnstileToken?.message}
					/>
					<Button type="submit" disabled={isSubmitting || !turnstileSiteKey}>
						{isSubmitting ? t.sending : t.submit}
					</Button>
				</>
			) : (
				<div className="contact-form__whatsapp-action">
					<p>{t.whatsappNotice}</p>
					<Button type="submit" disabled={isSubmitting}>
						{t.openWhatsapp}
					</Button>
				</div>
			)}

			<StatusMessage
				status={status}
				statusMessage={statusMessage}
				statusRef={statusRef}
			/>
			{status === "error" && !whatsappPreview && whatsappHref && (
				<Button
					type="button"
					variant="outline"
					onClick={() => offerWhatsappFallback()}
				>
					{t.openWhatsapp}
				</Button>
			)}

			{whatsappPreview && whatsappHref && (
				<WhatsappFallback
					t={t}
					id={id}
					whatsappHref={whatsappHref}
					whatsappPreview={whatsappPreview}
					setWhatsappPreview={setWhatsappPreview}
					openWhatsapp={openWhatsapp}
					copyWhatsappFallback={copyWhatsappFallback}
					showCopyFallback={showCopyFallback}
				/>
			)}
		</form>
	);
}
