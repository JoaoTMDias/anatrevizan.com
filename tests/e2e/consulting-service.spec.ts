import { expect, test } from "@playwright/test";

test("pairs the environmental title and image opposite its copy and credentials", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto("/consultoria/ambiental-e-esg");
	const image = page.locator(".consulting-differentiator__media img");
	await expect(image).toHaveAttribute("src", "/ambiental-esg-amazonia.webp");
	await expect(image).toHaveAttribute("alt", /Ana Flávia junto ao tronco/);
	await image.scrollIntoViewIfNeeded();
	await expect
		.poll(() =>
			image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
		)
		.toBeGreaterThan(0);

	const section = image.locator("xpath=ancestor::section[1]");
	const heading = section.locator(".consulting-differentiator__heading");
	const copy = section.locator(".consulting-differentiator__text");
	const credentials = section.locator(
		".consulting-differentiator__credentials",
	);
	const [headingBox, imageBox, copyBox, credentialsBox] = await Promise.all([
		heading.boundingBox(),
		image.boundingBox(),
		copy.boundingBox(),
		credentials.boundingBox(),
	]);
	expect(imageBox?.x).toBeCloseTo(headingBox?.x ?? 0, 0);
	expect(copyBox?.x).toBeGreaterThan(
		(imageBox?.x ?? 0) + (imageBox?.width ?? 0),
	);
	expect(credentialsBox?.x).toBeCloseTo(copyBox?.x ?? 0, 0);
	expect(copyBox?.y).toBeCloseTo(headingBox?.y ?? 0, 0);
	expect(imageBox?.y).toBeGreaterThan(
		(headingBox?.y ?? 0) + (headingBox?.height ?? 0),
	);
	expect(credentialsBox?.y).toBeGreaterThan(
		(copyBox?.y ?? 0) + (copyBox?.height ?? 0),
	);

	const order = await section
		.locator("h2, .consulting-differentiator__media, .text-muted-foreground")
		.evaluateAll((elements) =>
			elements
				.slice(0, 3)
				.map((element) =>
					element.matches("h2")
						? "heading"
						: element.matches(".consulting-differentiator__media")
							? "image"
							: "copy",
				),
		);
	expect(order).toEqual(["heading", "image", "copy"]);
});
