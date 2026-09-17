import { Button } from "@/components/ui/button";
import type { ContactFormCopy } from "./copy";

interface WhatsappFallbackProps {
	t: ContactFormCopy;
	id: (name: string) => string;
	whatsappHref: string;
	whatsappPreview: string;
	setWhatsappPreview: (value: string) => void;
	openWhatsapp: () => void;
	copyWhatsappFallback: () => void;
	showCopyFallback: boolean;
}

export function WhatsappFallback({
	t,
	id,
	whatsappHref,
	whatsappPreview,
	setWhatsappPreview,
	openWhatsapp,
	copyWhatsappFallback,
	showCopyFallback,
}: WhatsappFallbackProps) {
	return (
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
			<Button type="button" variant="outline" onClick={copyWhatsappFallback}>
				{t.copyFallback}
			</Button>
			{showCopyFallback && (
				<div role="status">
					<p>{t.copyInstructions}</p>
					<p>
						<a href={whatsappHref} target="_blank" rel="noopener noreferrer">
							{whatsappHref}
							<span className="sr-only"> ({t.externalHint})</span>
						</a>
					</p>
					<pre>{whatsappPreview}</pre>
				</div>
			)}
		</section>
	);
}
