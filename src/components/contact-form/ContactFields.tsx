import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { Channel, ContactFormCopy } from "./copy";
import { FieldError } from "./FieldError";
import type { FormValues, Option } from "./types";

interface ContactFieldsProps {
	t: ContactFormCopy;
	id: (name: string) => string;
	channel: Channel;
	errors: FieldErrors<FormValues>;
	register: UseFormRegister<FormValues>;
	requestTypes: Option[];
	countries: Option[];
	privacyHref: string;
}

export function ContactFields({
	t,
	id,
	channel,
	errors,
	register,
	requestTypes,
	countries,
	privacyHref,
}: ContactFieldsProps) {
	return (
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
	);
}
