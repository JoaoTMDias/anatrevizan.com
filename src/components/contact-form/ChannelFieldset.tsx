import type { Channel, ContactFormCopy } from "./copy";

interface ChannelFieldsetProps {
	t: ContactFormCopy;
	id: (name: string) => string;
	channel: Channel;
	whatsappHref: string | null;
	onSelect: (channel: Channel) => void;
}

export function ChannelFieldset({
	t,
	id,
	channel,
	whatsappHref,
	onSelect,
}: ChannelFieldsetProps) {
	return (
		<>
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
								onChange={() => onSelect("whatsapp")}
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
							onChange={() => onSelect("email")}
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
		</>
	);
}
