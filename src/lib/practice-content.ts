import type { RouteKey } from "./routing";
export interface PracticeSection {
	variant?: "bento" | "services";
	anchor?: string;
	title: string;
	description: string;
	paragraphs?: string[];
	items?: string[];
	notice: string;
	cta: string;
	routeKey: RouteKey;
	scope?: string;
}
export interface PracticeContent {
	tag: string;
	intro: string;
	sections?: PracticeSection[];
	portugal?: PracticeSection;
	brazil?: PracticeSection;
}
