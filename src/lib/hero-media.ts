import type { RouteKey } from "./routing";

export const HERO_PLACEHOLDER_PATH = "/hero-placeholder.webp";

export const heroAspectRatios = ["square", "landscape"] as const;
export type HeroAspectRatio = (typeof heroAspectRatios)[number];

export const heroFocalPoints = ["top", "center", "bottom"] as const;
export type HeroFocalPoint = (typeof heroFocalPoints)[number];

export interface HeroMedia {
	background?: {
		image?: string | null;
		focalPoint?: string | null;
	} | null;
	foreground?: {
		image?: string | null;
		alt?: string | null;
		decorative?: boolean | null;
	} | null;
	video?: string | null;
	poster?: string | null;
}

export type HeroMediaIssueCode =
	| "invalid-hero-focal-point"
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
	const background = media?.background;
	const foreground = media?.foreground;

	if (
		background?.focalPoint &&
		!heroFocalPoints.includes(background.focalPoint as HeroFocalPoint)
	)
		issues.push({
			code: "invalid-hero-focal-point",
			message: `Ponto focal inválido: ${background.focalPoint}`,
		});

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
	"home",
	"immigration-mobility",
	"public-policy",
	"mentoring",
	"contact",
	"booking",
]);

export function heroAspectRatioForRoute(routeKey: RouteKey): HeroAspectRatio {
	return landscapeHeroRoutes.has(routeKey) ? "landscape" : "square";
}

export function heroFocalPoint(
	value: string | null | undefined,
): HeroFocalPoint {
	return heroFocalPoints.includes(value as HeroFocalPoint)
		? (value as HeroFocalPoint)
		: "center";
}
