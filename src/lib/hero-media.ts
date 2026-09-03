import type { RouteKey } from "./routing";

export const HERO_PLACEHOLDER_PATH = "/hero-placeholder.webp";

export const heroAspectRatios = ["square", "landscape"] as const;
export type HeroAspectRatio = (typeof heroAspectRatios)[number];

export interface HeroMedia {
	foreground?: {
		image?: string | null;
		alt?: string | null;
		decorative?: boolean | null;
	} | null;
	video?: string | null;
	poster?: string | null;
}

export type HeroMediaIssueCode =
	| "missing-hero-alt"
	| "published-hero-placeholder";

export interface HeroMediaIssue {
	code: HeroMediaIssueCode;
	message: string;
}

export function validateHeroMedia(
	media: HeroMedia | null | undefined,
	publishable: boolean,
): HeroMediaIssue[] {
	const issues: HeroMediaIssue[] = [];
	const foreground = media?.foreground;

	if (
		foreground?.image &&
		!foreground.decorative &&
		!foreground.alt?.trim().length
	)
		issues.push({
			code: "missing-hero-alt",
			message: "Imagem lateral informativa sem texto alternativo",
		});

	if (publishable && foreground?.image === HERO_PLACEHOLDER_PATH)
		issues.push({
			code: "published-hero-placeholder",
			message: "O placeholder do hero não pode ser publicado",
		});

	return issues;
}

const landscapeHeroRoutes = new Set<RouteKey>([
	"contact",
	"events",
	"home",
	"immigration-mobility",
	"mentoring",
	"public-policy",
	"publications",
	"training",
	"about",
	"legal-opinions",
	"legal",
]);

export function heroAspectRatioForRoute(routeKey: RouteKey): HeroAspectRatio {
	return landscapeHeroRoutes.has(routeKey) ? "landscape" : "square";
}
