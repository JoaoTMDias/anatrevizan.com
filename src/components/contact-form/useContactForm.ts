import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { contactCountries } from "@/lib/contact-form";
import {
	isContactScope,
	scopeConfirmations,
	scopeSubmitLabels,
} from "@/lib/contact-scope";
import { contactFormCopy } from "./copy";
import type { SubmitStatus } from "./StatusMessage";
import { useTurnstileWidget } from "./turnstile";
import type { ContactFormProps, ContactResponse, FormValues } from "./types";
import { buildContactSchema } from "./validation";
import { buildWhatsappPreview, canOfferWhatsappFallback } from "./whatsapp";

export function useContactForm({
	locale,
	formHeadingId,
	privacyHref,
	scopeNotice,
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
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		getValues,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(buildContactSchema(t, requestTypes)),
		shouldFocusError: false,
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			channel: "email",
			scope: "",
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

	const scope = watch("scope");
	const requestType = watch("requestType");
	useEffect(() => {
		const selected = requestTypes.find(
			(option) => option.value === requestType,
		);
		if (selected && selected.scope !== scope) setValue("scope", selected.scope);
	}, [requestType, requestTypes, scope, setValue]);
	useEffect(() => {
		const chosen = new URL(window.location.href).searchParams.get("scope");
		if (isContactScope(chosen)) setValue("scope", chosen);
	}, [setValue]);

	const onTurnstileToken = useCallback(
		(token: string) =>
			setValue("turnstileToken", token, { shouldValidate: true }),
		[setValue],
	);
	const onTurnstileExpire = useCallback(
		() => setValue("turnstileToken", ""),
		[setValue],
	);
	const onTurnstileError = useCallback(() => {
		setValue("turnstileToken", "");
		setStatus("error");
		setStatusMessage(t.turnstileError);
	}, [setValue, t.turnstileError]);

	const { containerRef: turnstileContainerRef, resetWidget: resetTurnstile } =
		useTurnstileWidget({
			channel,
			turnstileSiteKey,
			onToken: onTurnstileToken,
			onExpire: onTurnstileExpire,
			onError: onTurnstileError,
		});

	useEffect(() => {
		const url = new URL(window.location.href);
		if (url.searchParams.get("status") !== "sent") return;
		setStatus("success");
		const completedScope = url.searchParams.get("scope");
		setStatusMessage(
			isContactScope(completedScope)
				? scopeConfirmations[locale][completedScope]
				: t.success,
		);
		url.searchParams.delete("status");
		window.history.replaceState(
			null,
			"",
			`${url.pathname}${url.search}${url.hash}`,
		);
		requestAnimationFrame(() => statusRef.current?.focus());
	}, [t.success, locale]);

	function chooseChannel(nextChannel: FormValues["channel"]) {
		setChannel(nextChannel);
		setValue("channel", nextChannel, { shouldValidate: true });
		setStatus("idle");
		setStatusMessage("");
		setWhatsappPreview("");
		setShowCopyFallback(false);
		setStartedAt(Date.now());
	}

	function offerWhatsappFallback(data = getValues()) {
		if (!whatsappHref || !canOfferWhatsappFallback(data, requestTypes)) return;
		setWhatsappPreview(
			buildWhatsappPreview(
				data,
				locale,
				requestTypes,
				t.fallbackNote,
				t.email,
				t.whatsapp,
				true,
			),
		);
	}

	async function submit(data: FormValues) {
		const name = data.name;
		const requestType = data.requestType;
		const countryCode = data.country;
		const message = data.message;

		if (channel === "whatsapp" && whatsappHref) {
			setWhatsappPreview(
				buildWhatsappPreview(
					data,
					locale,
					requestTypes,
					t.fallbackNote,
					t.email,
					t.whatsapp,
				),
			);
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
					scope: data.scope,
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
			url.search = `?status=sent&scope=${encodeURIComponent(data.scope)}`;
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

	return {
		t,
		locale,
		formHeadingId,
		privacyHref,
		scopeNotice,
		requestTypes,
		turnstileSiteKey,
		whatsappHref,
		id,
		statusRef,
		errorSummaryRef,
		channel,
		status,
		statusMessage,
		whatsappPreview,
		showCopyFallback,
		scope,
		scopeSubmitLabel: isContactScope(scope)
			? scopeSubmitLabels[locale][scope]
			: t.submit,
		countries,
		errors,
		isSubmitting,
		register,
		handleSubmit: handleSubmit(submit),
		turnstileContainerRef,
		chooseChannel,
		offerWhatsappFallback,
		openWhatsapp,
		copyWhatsappFallback,
		setWhatsappPreview,
	};
}
