import { useEffect, useRef } from "react";
import { CONTACT_FORM_ACTION } from "@/lib/contact-form";
import type { Channel } from "./copy";

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

function loadTurnstileScript(): Promise<void> {
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

/** Renders the Cloudflare Turnstile widget into `containerRef` while `channel` is "email". */
export function useTurnstileWidget({
	channel,
	turnstileSiteKey,
	onToken,
	onExpire,
	onError,
}: {
	channel: Channel;
	turnstileSiteKey: string;
	onToken: (token: string) => void;
	onExpire: () => void;
	onError: () => void;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (channel !== "email" || !turnstileSiteKey || !containerRef.current)
			return;
		let cancelled = false;
		void loadTurnstileScript()
			.then(() => {
				if (cancelled || !window.turnstile || !containerRef.current) return;
				widgetIdRef.current = window.turnstile.render(containerRef.current, {
					sitekey: turnstileSiteKey,
					action: CONTACT_FORM_ACTION,
					appearance: "interaction-only",
					theme: "auto",
					callback: onToken,
					"expired-callback": onExpire,
					"error-callback": onError,
				});
			})
			.catch(onError);
		return () => {
			cancelled = true;
			if (widgetIdRef.current && window.turnstile) {
				window.turnstile.remove(widgetIdRef.current);
				widgetIdRef.current = null;
			}
		};
	}, [channel, turnstileSiteKey, onToken, onExpire, onError]);

	function resetWidget() {
		if (widgetIdRef.current && window.turnstile)
			window.turnstile.reset(widgetIdRef.current);
	}

	return { containerRef, resetWidget };
}
