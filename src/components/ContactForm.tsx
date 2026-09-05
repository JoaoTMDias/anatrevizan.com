import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	buildWhatsAppMessage,
	CONTACT_FORM_ACTION,
	contactCountries,
} from "@/lib/contact-form";

type Locale = "pt-PT" | "en";
type Channel = "email" | "whatsapp";

interface FormValues {
	channel: Channel;
	name: string;
	email: string;
	whatsapp: string;
	requestType: string;
	country: string;
	message: string;
	website: string;
	turnstileToken: string;
}

interface Option {
	label: string;
	value: string;
}

interface ContactFormProps {
	locale: Locale;
	privacyHref: string;
	requestTypes: Option[];
	turnstileSiteKey: string;
	whatsappHref: string | null;
}

interface ContactResponse {
	version: 1;
	ok: boolean;
	code: "accepted" | "invalid" | "unavailable";
	requestId: string;
}

declare global {
	interface Window {
		turnstile?: {
			render: (
				container: HTMLElement,
				options: Record<string, unknown>,
			) => string;
			reset: (widgetId: string) => void;
			remove: (widgetId: string) => void;
		};
	}
}

const copy = {
	"pt-PT": {
		legend: "Como prefere enviar o seu pedido?",
		channelInstruction:
			"A escolha do canal altera os dados necessários e a forma de envio.",
		emailSelected:
			"Envio pelo formulário selecionado. O endereço de email é obrigatório.",
		whatsappSelected:
			"Envio pelo WhatsApp selecionado. Não é necessário indicar um email.",
		emailChannel: "Enviar pelo formulário",
		emailHelp: "O pedido será enviado por email e registado de forma segura.",
		whatsappChannel: "Enviar pelo WhatsApp",
		whatsappHelp:
			"Abriremos o WhatsApp com a mensagem pronta para rever e enviar.",
		name: "Nome",
		email: "E-mail",
		whatsapp: "WhatsApp (opcional)",
		requestType: "Tipo de pedido",
		country: "País onde está",
		message: "Mensagem",
		messageHint:
			"Não inclua dados particularmente sensíveis que não sejam necessários para este primeiro contacto.",
		messagePlaceholder: "Conte brevemente o que aconteceu e o que procura",
		privacyNotice:
			"Usaremos os dados para receber e responder ao seu pedido. Consulte a",
		privacyExternal:
			"Ao continuar, sairá deste site para o WhatsApp, que tratará os dados segundo as suas próprias práticas.",
		privacy: "Política de Privacidade",
		submit: "Enviar pedido",
		sending: "A enviar…",
		openWhatsapp: "Continuar no WhatsApp",
		whatsappNotice:
			"A mensagem só será enviada depois de confirmar no WhatsApp.",
		success:
			"Mensagem enviada com sucesso. Receberá uma confirmação por email.",
		error:
			"Não foi possível enviar a mensagem. Os dados foram mantidos para poder tentar novamente.",
		turnstileError:
			"Não foi possível concluir a verificação de segurança. Tente novamente.",
		configurationError:
			"O envio por email ainda não está configurado. Pode contactar através do WhatsApp.",
		choose: "Selecione uma opção",
		required: "Este campo é obrigatório.",
		invalidEmail: "Introduza um endereço de email válido.",
		shortName: "Introduza pelo menos 2 caracteres.",
		shortMessage: "Introduza pelo menos 20 caracteres.",
		formLabel: "Pedido de contacto",
		errorSummary: "Corrija os campos assinalados",
		fallbackHeading: "Continuar pelo WhatsApp",
		fallbackIntro:
			"O envio pelo formulário está indisponível. Reveja a mensagem antes de a transferir para o WhatsApp.",
		fallbackNote: "Nota: o formulário do site estava indisponível.",
		fallbackPreview: "Mensagem para o WhatsApp",
		fallbackTooLong: "Reduza a mensagem antes de continuar no WhatsApp.",
		copyFallback: "Copiar número e mensagem",
		copyInstructions:
			"Se o WhatsApp não abrir, copie manualmente o número e a mensagem abaixo.",
		externalHint: "abre num novo separador",
	},
	en: {
		legend: "How would you like to send your request?",
		channelInstruction:
			"Your choice changes the information required and how the request is sent.",
		emailSelected: "Form submission selected. An email address is required.",
		whatsappSelected:
			"WhatsApp submission selected. You do not need to provide an email address.",
		emailChannel: "Send through the form",
		emailHelp: "Your request will be emailed and recorded securely.",
		whatsappChannel: "Send through WhatsApp",
		whatsappHelp:
			"We will open WhatsApp with your message ready to review and send.",
		name: "Name",
		email: "Email",
		whatsapp: "WhatsApp (optional)",
		requestType: "Type of request",
		country: "Country",
		message: "Message",
		messageHint:
			"Do not include particularly sensitive information that is not needed for this initial contact.",
		messagePlaceholder:
			"Briefly explain what happened and what you are looking for",
		privacyNotice:
			"We will use the data to receive and reply to your request. See the",
		privacyExternal:
			"Continuing takes you away from this site to WhatsApp, which processes data under its own practices.",
		privacy: "Privacy Policy",
		submit: "Send request",
		sending: "Sending…",
		openWhatsapp: "Continue to WhatsApp",
		whatsappNotice:
			"Your message will only be sent after you confirm it in WhatsApp.",
		success:
			"Your message was sent successfully. You will receive a confirmation by email.",
		error:
			"The message could not be sent. Your entries were kept so you can try again.",
		turnstileError:
			"The security check could not be completed. Please try again.",
		configurationError:
			"Email submission is not configured yet. You can contact me through WhatsApp.",
		choose: "Select an option",
		required: "This field is required.",
		invalidEmail: "Enter a valid email address.",
		shortName: "Enter at least 2 characters.",
		shortMessage: "Enter at least 20 characters.",
		formLabel: "Contact request",
		errorSummary: "Correct the highlighted fields",
		fallbackHeading: "Continue through WhatsApp",
		fallbackIntro:
			"Form submission is unavailable. Review the message before transferring it to WhatsApp.",
		fallbackNote: "Note: the website form was unavailable.",
		fallbackPreview: "Message for WhatsApp",
		fallbackTooLong: "Shorten the message before continuing to WhatsApp.",
		copyFallback: "Copy number and message",
		copyInstructions:
			"If WhatsApp does not open, manually copy the number and message below.",
		externalHint: "opens in a new tab",
	},
} as const;

function loadTurnstile(): Promise<void> {
	if (window.turnstile) return Promise.resolve();
	return new Promise((resolve, reject) => {
		const existing = document.querySelector<HTMLScriptElement>(
			"script[data-contact-turnstile]",
		);
		if (existing) {
			existing.addEventListener("load", () => resolve(), { once: true });
			existing.addEventListener("error", reject, { once: true });
			return;
		}
		const script = document.createElement("script");
		script.src =
			"https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
		script.async = true;
		script.defer = true;
		script.dataset.contactTurnstile = "true";
		script.addEventListener("load", () => resolve(), { once: true });
		script.addEventListener("error", reject, { once: true });
		document.head.append(script);
	});
}

function FieldError({ id, message }: { id: string; message?: string }) {
	return message ? (
		<p id={id} className="contact-form__error" role="alert">
			{message}
		</p>
	) : null;
}

export default function ContactForm({
	locale,
	privacyHref,
	requestTypes,
	turnstileSiteKey,
	whatsappHref,
}: ContactFormProps) {
	const t = copy[locale];
	const prefix = useId();
	const statusRef = useRef<HTMLDivElement>(null);
	const errorSummaryRef = useRef<HTMLDivElement>(null);
	const turnstileContainerRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | null>(null);
	const requestIdRef = useRef<string | null>(null);
	const [channel, setChannel] = useState<Channel>("email");
	const [startedAt, setStartedAt] = useState(() => Date.now());
	const [status, setStatus] = useState<
		"idle" | "sending" | "success" | "error"
	>("idle");
	const [statusMessage, setStatusMessage] = useState("");
	const [whatsappPreview, setWhatsappPreview] = useState("");
	const [showCopyFallback, setShowCopyFallback] = useState(false);
	const [focusErrorSummary, setFocusErrorSummary] = useState(false);
	const schema = z
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
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
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
	}, [errors, focusErrorSummary]);

	useEffect(() => {
		if (
			channel !== "email" ||
			!turnstileSiteKey ||
			!turnstileContainerRef.current
		)
			return;
		let cancelled = false;
		void loadTurnstile()
			.then(() => {
				if (cancelled || !window.turnstile || !turnstileContainerRef.current)
					return;
				widgetIdRef.current = window.turnstile.render(
					turnstileContainerRef.current,
					{
						sitekey: turnstileSiteKey,
						action: CONTACT_FORM_ACTION,
						appearance: "interaction-only",
						theme: "auto",
						callback: (token: string) =>
							setValue("turnstileToken", token, { shouldValidate: true }),
						"expired-callback": () => setValue("turnstileToken", ""),
						"error-callback": () => {
							setValue("turnstileToken", "");
							setStatus("error");
							setStatusMessage(t.turnstileError);
						},
					},
				);
			})
			.catch(() => {
				setStatus("error");
				setStatusMessage(t.turnstileError);
			});
		return () => {
			cancelled = true;
			if (widgetIdRef.current && window.turnstile) {
				window.turnstile.remove(widgetIdRef.current);
				widgetIdRef.current = null;
			}
		};
	}, [channel, setValue, t.turnstileError, turnstileSiteKey]);

	function chooseChannel(nextChannel: Channel) {
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
			if (widgetIdRef.current && window.turnstile)
				window.turnstile.reset(widgetIdRef.current);
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
	const id = (name: string) => `${prefix}-${name}`;

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
			{Object.keys(errors).some((field) =>
				["name", "email", "requestType", "country", "message"].includes(field),
			) && (
				<div
					ref={errorSummaryRef}
					className="contact-form__error-summary"
					role="alert"
					tabIndex={-1}
				>
					<strong>{t.errorSummary}</strong>
					<ul>
						{Object.entries(errors)
							.filter(([field]) =>
								["name", "email", "requestType", "country", "message"].includes(
									field,
								),
							)
							.map(([field, error]) => (
								<li key={field}>
									<a
										href={`#${id(field === "requestType" ? "request-type" : field)}`}
									>
										{error?.message}
									</a>
								</li>
							))}
					</ul>
				</div>
			)}
			<fieldset
				className="contact-channel"
				aria-describedby={id("channel-instruction")}
			>
				<legend>{t.legend}</legend>
				<p
					id={id("channel-instruction")}
					className="contact-channel__instruction sr-only"
				>
					{t.channelInstruction}
				</p>
				<div className="contact-channel__options">
					{whatsappHref && (
						<label>
							<input
								type="radio"
								name="channel"
								value="whatsapp"
								checked={channel === "whatsapp"}
								onChange={() => chooseChannel("whatsapp")}
							/>
							<span>
								<strong>{t.whatsappChannel}</strong>
								<small>{t.whatsappHelp}</small>
							</span>
						</label>
					)}
					<label>
						<input
							type="radio"
							name="channel"
							value="email"
							checked={channel === "email"}
							onChange={() => chooseChannel("email")}
						/>
						<span>
							<strong>{t.emailChannel}</strong>
							<small>{t.emailHelp}</small>
						</span>
					</label>
				</div>
			</fieldset>
			<p className="sr-only" aria-live="polite" aria-atomic="true">
				{channel === "email" ? t.emailSelected : t.whatsappSelected}
			</p>

			<fieldset className="contact-form__fields">
				<div className="contact-form__field">
					<label htmlFor={id("name")}>{t.name}</label>
					<input
						id={id("name")}
						autoComplete="name"
						aria-invalid={errors.name ? "true" : undefined}
						aria-describedby={errors.name ? id("name-error") : undefined}
						{...register("name")}
					/>
					<FieldError id={id("name-error")} message={errors.name?.message} />
				</div>

				{channel === "email" && (
					<>
						<div className="contact-form__field">
							<label htmlFor={id("email")}>{t.email}</label>
							<input
								id={id("email")}
								type="email"
								autoComplete="email"
								aria-invalid={errors.email ? "true" : undefined}
								aria-describedby={errors.email ? id("email-error") : undefined}
								{...register("email")}
							/>
							<FieldError
								id={id("email-error")}
								message={errors.email?.message}
							/>
						</div>
						<div className="contact-form__field">
							<label htmlFor={id("whatsapp")}>{t.whatsapp}</label>
							<input
								id={id("whatsapp")}
								type="tel"
								autoComplete="tel"
								{...register("whatsapp")}
							/>
						</div>
					</>
				)}

				<div className="contact-form__field">
					<label htmlFor={id("request-type")}>{t.requestType}</label>
					<select
						id={id("request-type")}
						aria-invalid={errors.requestType ? "true" : undefined}
						aria-describedby={
							errors.requestType ? id("request-type-error") : undefined
						}
						{...register("requestType")}
					>
						<option value="" disabled>
							{t.choose}
						</option>
						{requestTypes.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<FieldError
						id={id("request-type-error")}
						message={errors.requestType?.message}
					/>
				</div>

				<div className="contact-form__field">
					<label htmlFor={id("country")}>{t.country}</label>
					<select
						id={id("country")}
						aria-invalid={errors.country ? "true" : undefined}
						aria-describedby={errors.country ? id("country-error") : undefined}
						{...register("country")}
					>
						<option value="" disabled>
							{t.choose}
						</option>
						{countries.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<FieldError
						id={id("country-error")}
						message={errors.country?.message}
					/>
				</div>

				<div className="contact-form__wide contact-form__field">
					<label htmlFor={id("message")}>{t.message}</label>
					<p id={id("message-hint")} className="contact-form__hint">
						{t.messageHint}
					</p>
					<textarea
						id={id("message")}
						rows={7}
						aria-invalid={errors.message ? "true" : undefined}
						aria-describedby={`${id("message-hint")}${errors.message ? ` ${id("message-error")}` : ""}`}
						placeholder={t.messagePlaceholder}
						{...register("message")}
					/>
					<FieldError
						id={id("message-error")}
						message={errors.message?.message}
					/>
				</div>

				<div className="contact-form__honeypot" aria-hidden="true">
					<label htmlFor={id("website")}>Website</label>
					<input
						id={id("website")}
						tabIndex={-1}
						autoComplete="off"
						{...register("website")}
					/>
				</div>

				<div id={id("privacy-notice")} className="contact-form__consent">
					<p>
						{t.privacyNotice} <a href={privacyHref}>{t.privacy}</a>.
					</p>
					{channel === "whatsapp" && <p>{t.privacyExternal}</p>}
				</div>
			</fieldset>

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

			<div
				ref={statusRef}
				id="contact-form-status"
				className="contact-form__status"
				data-state={status}
				role={status === "error" ? "alert" : "status"}
				tabIndex={status === "success" || status === "error" ? -1 : undefined}
			>
				{status === "success" ? <h2>{statusMessage}</h2> : statusMessage}
			</div>
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
				<section
					className="contact-form__fallback"
					aria-labelledby={id("fallback-heading")}
				>
					<h2 id={id("fallback-heading")}>{t.fallbackHeading}</h2>
					<p>{t.fallbackIntro}</p>
					<label htmlFor={id("whatsapp-preview")}>{t.fallbackPreview}</label>
					<textarea
						id={id("whatsapp-preview")}
						rows={8}
						value={whatsappPreview}
						onChange={(event) => setWhatsappPreview(event.target.value)}
					/>
					<p>{t.privacyExternal}</p>
					<Button type="button" onClick={openWhatsapp}>
						{t.openWhatsapp}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={copyWhatsappFallback}
					>
						{t.copyFallback}
					</Button>
					{showCopyFallback && (
						<div role="status">
							<p>{t.copyInstructions}</p>
							<p>
								<a
									href={whatsappHref}
									target="_blank"
									rel="noopener noreferrer"
								>
									{whatsappHref}
									<span className="sr-only"> ({t.externalHint})</span>
								</a>
							</p>
							<pre>{whatsappPreview}</pre>
						</div>
					)}
				</section>
			)}
		</form>
	);
}
