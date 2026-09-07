export function FieldError({ id, message }: { id: string; message?: string }) {
	return message ? (
		<p id={id} className="contact-form__error" role="alert">
			{message}
		</p>
	) : null;
}
