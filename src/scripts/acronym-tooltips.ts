const OPEN_DELAY = 350;
const VIEWPORT_GAP = 8;

type TooltipParts = {
	wrapper: HTMLElement;
	trigger: HTMLElement;
	content: HTMLElement;
};

let active: TooltipParts | null = null;
const openTimers = new WeakMap<HTMLElement, number>();

function partsFor(element: Element): TooltipParts | null {
	const wrapper = element.closest<HTMLElement>("[data-acronym-tooltip]");
	const trigger = wrapper?.querySelector<HTMLElement>("[data-acronym-trigger]");
	const content = wrapper?.querySelector<HTMLElement>("[data-acronym-content]");
	return wrapper && trigger && content ? { wrapper, trigger, content } : null;
}

function position({ trigger, content }: TooltipParts) {
	content.style.removeProperty("inset-inline-start");
	content.style.removeProperty("inset-block-start");
	content.dataset.placement = "top";

	const triggerRect = trigger.getBoundingClientRect();
	const tooltipRect = content.getBoundingClientRect();
	const roomAbove = triggerRect.top;
	const placement =
		roomAbove >= tooltipRect.height + VIEWPORT_GAP * 2 ? "top" : "bottom";
	const top =
		placement === "top"
			? triggerRect.top - tooltipRect.height - VIEWPORT_GAP
			: triggerRect.bottom + VIEWPORT_GAP;
	const idealLeft =
		triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
	const left = Math.min(
		window.innerWidth - tooltipRect.width - VIEWPORT_GAP,
		Math.max(VIEWPORT_GAP, idealLeft),
	);

	content.dataset.placement = placement;
	content.style.insetInlineStart = `${left}px`;
	content.style.insetBlockStart = `${Math.max(VIEWPORT_GAP, top)}px`;
	content.style.setProperty(
		"--acronym-tooltip-arrow-inline",
		`${Math.min(tooltipRect.width - VIEWPORT_GAP, Math.max(VIEWPORT_GAP, triggerRect.left + triggerRect.width / 2 - left))}px`,
	);
}

function close(parts = active) {
	if (!parts) return;
	const timer = openTimers.get(parts.wrapper);
	if (timer) window.clearTimeout(timer);
	openTimers.delete(parts.wrapper);
	parts.wrapper.removeAttribute("data-open");
	if (typeof parts.content.hidePopover === "function") {
		try {
			parts.content.hidePopover();
		} catch {}
	}
	if (active?.wrapper === parts.wrapper) active = null;
}

function open(parts: TooltipParts) {
	if (active && active.wrapper !== parts.wrapper) close(active);
	parts.wrapper.setAttribute("data-open", "");
	if (typeof parts.content.showPopover === "function") {
		try {
			parts.content.showPopover();
		} catch {}
	}
	active = parts;
	position(parts);
}

function scheduleOpen(parts: TooltipParts) {
	const timer = openTimers.get(parts.wrapper);
	if (timer) window.clearTimeout(timer);
	openTimers.set(
		parts.wrapper,
		window.setTimeout(() => {
			openTimers.delete(parts.wrapper);
			open(parts);
		}, OPEN_DELAY),
	);
}

document.addEventListener("pointerover", (event) => {
	if (!(event.target instanceof Element)) return;
	const parts = partsFor(event.target);
	if (parts) scheduleOpen(parts);
});

document.addEventListener("pointerout", (event) => {
	if (!(event.target instanceof Element)) return;
	const parts = partsFor(event.target);
	if (!parts) return;
	const next = event.relatedTarget;
	if (next instanceof Node && parts.wrapper.contains(next)) return;
	close(parts);
});

document.addEventListener("focusin", (event) => {
	if (!(event.target instanceof Element)) return;
	const parts = partsFor(event.target);
	if (parts && event.target === parts.trigger) open(parts);
});

document.addEventListener("focusout", (event) => {
	if (!(event.target instanceof Element)) return;
	const parts = partsFor(event.target);
	if (parts) close(parts);
});

document.addEventListener("keydown", (event) => {
	if (event.key !== "Escape" || !active) return;
	close(active);
});

document.addEventListener("pointerdown", (event) => {
	if (!(event.target instanceof Element)) return;
	const parts = partsFor(event.target);
	if (parts) {
		if (event.pointerType === "touch")
			parts.trigger.focus({ preventScroll: true });
		return;
	}
	close();
});

window.addEventListener("resize", () => active && position(active));
window.addEventListener("scroll", () => active && position(active), true);
