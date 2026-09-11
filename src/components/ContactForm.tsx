import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChannelFieldset } from "./contact-form/ChannelFieldset";
import { ContactFields } from "./contact-form/ContactFields";
import { ErrorSummary, hasSummarizedErrors } from "./contact-form/ErrorSummary";
import { FieldError } from "./contact-form/FieldError";
import { StatusMessage } from "./contact-form/StatusMessage";
import type { ContactFormProps } from "./contact-form/types";
import { useContactForm } from "./contact-form/useContactForm";
import { WhatsappFallback } from "./contact-form/WhatsappFallback";

export default function ContactForm(props: ContactFormProps) {
	const {
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
		scopeSubmitLabel,
		countries,
		errors,
		isSubmitting,
		register,
		handleSubmit,
		turnstileContainerRef,
		chooseChannel,
		offerWhatsappFallback,
		openWhatsapp,
		copyWhatsappFallback,
		setWhatsappPreview,
	} = useContactForm(props);

	return (
		<form
			className="contact-form"
			lang={locale}
			aria-labelledby={formHeadingId}
			onSubmit={handleSubmit}
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

			<input type="hidden" {...register("scope")} />
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

			<aside className="contact-form__scope-notice">
				<p>{scopeNotice}</p>
			</aside>
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
						{isSubmitting && (
							<LoaderCircle className="animate-spin" aria-hidden="true" />
						)}
						{isSubmitting ? t.sending : scopeSubmitLabel}
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
