import { useState } from "react";
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
	const [announcement, setAnnouncement] = useState("");

	function selectChannel(nextChannel: Channel) {
		onSelect(nextChannel);
		setAnnouncement(
			nextChannel === "email" ? t.emailSelected : t.whatsappSelected,
		);
	}

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
						<label htmlFor={id("channel-whatsapp")}>
							<input
								id={id("channel-whatsapp")}
								type="radio"
								name="channel"
								value="whatsapp"
								checked={channel === "whatsapp"}
								aria-describedby={id("channel-whatsapp-help")}
								onChange={() => selectChannel("whatsapp")}
							/>
							<span>
								<strong>{t.whatsappChannel}</strong>
								<small id={id("channel-whatsapp-help")}>{t.whatsappHelp}</small>
							</span>
						</label>
					)}
					<label htmlFor={id("channel-email")}>
						<input
							id={id("channel-email")}
							type="radio"
							name="channel"
							value="email"
							checked={channel === "email"}
							aria-describedby={id("channel-email-help")}
							onChange={() => selectChannel("email")}
						/>
						<span>
							<strong>{t.emailChannel}</strong>
							<small id={id("channel-email-help")}>{t.emailHelp}</small>
						</span>
					</label>
				</div>
			</fieldset>
			<p className="sr-only" aria-live="polite" aria-atomic="true">
				{announcement}
			</p>
		</>
	);
}
