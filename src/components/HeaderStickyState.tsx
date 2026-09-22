import { useIntersection } from "@jtmdias/js-utilities/hooks";
import { useEffect, useRef } from "react";

export default function HeaderStickyState() {
	const sentinelRef = useRef<HTMLDivElement>(null!);
	const intersection = useIntersection(sentinelRef, {
		root: null,
		rootMargin: "0px",
		threshold: 0,
	});

	useEffect(() => {
		const header = document.querySelector<HTMLElement>("[data-site-header]");
		if (!header) return;
		const stuck = intersection ? !intersection.isIntersecting : false;
		header.toggleAttribute("data-stuck", stuck);
	}, [intersection]);

	return (
		<div
			ref={sentinelRef}
			className="header-sticky-sentinel"
			aria-hidden="true"
		/>
	);
}
