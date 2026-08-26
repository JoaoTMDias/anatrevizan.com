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
		aspectRatio?: string | null;
	} | null;
	video?: string | null;
	poster?: string | null;
}

export type HeroMediaIssueCode =
	| "invalid-hero-aspect-ratio"
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
		foreground?.aspectRatio &&
		!heroAspectRatios.includes(foreground.aspectRatio as HeroAspectRatio)
	)
		issues.push({
			code: "invalid-hero-aspect-ratio",
			message: `Proporção de hero inválida: ${foreground.aspectRatio}`,
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

export function heroAspectRatio(
	value: string | null | undefined,
): HeroAspectRatio {
	return heroAspectRatios.includes(value as HeroAspectRatio)
		? (value as HeroAspectRatio)
		: "square";
}

export function heroFocalPoint(
	value: string | null | undefined,
): HeroFocalPoint {
	return heroFocalPoints.includes(value as HeroFocalPoint)
		? (value as HeroFocalPoint)
		: "center";
}
