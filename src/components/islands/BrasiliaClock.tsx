import { useEffect, useState } from "react";

interface BrasiliaClockProps {
	locale: "pt-PT" | "en";
}

const timeZone = "America/Sao_Paulo";

function formatBrasiliaTime(locale: BrasiliaClockProps["locale"], date: Date) {
	return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "pt-BR", {
		timeZone,
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(date);
}

export default function BrasiliaClock({ locale }: BrasiliaClockProps) {
	const [now, setNow] = useState<Date | null>(null);

	useEffect(() => {
		setNow(new Date());
		const interval = window.setInterval(() => setNow(new Date()), 60_000);
		return () => window.clearInterval(interval);
	}, []);

	return (
		<p className="contact-booking__current-time">
			<span>
				{locale === "en"
					? "Current time in Brasília:"
					: "Hora atual em Brasília:"}
			</span>{" "}
			<time dateTime={now?.toISOString()}>
				{now ? formatBrasiliaTime(locale, now) : "--:--"}
			</time>
		</p>
	);
}
