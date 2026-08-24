import type { APIRoute } from "astro";
import { listEditorial, toEditorialDocument } from "../lib/data";
import { type EditorialDocument, isPublishable } from "../lib/editorial";
import {
	isPublishedLocale,
	type PublishedLocale,
	pathFor,
} from "../lib/routing";

const xml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site }) => {
	const origin = site ?? new URL("https://anatrevizan.com");
	const documents = (await listEditorial())
		.map(toEditorialDocument)
		.filter(
			(document): document is EditorialDocument & { locale: PublishedLocale } =>
				document !== null &&
				isPublishable(document) &&
				isPublishedLocale(document.locale),
		);
	const available = new Set(
		documents.map((document) => `${document.routeKey}:${document.locale}`),
	);
	const urls = documents
		.map((document) => {
			const alternates = (["pt-PT", "en"] as PublishedLocale[])
				.filter((locale) => available.has(`${document.routeKey}:${locale}`))
				.map(
					(locale) =>
						`<xhtml:link rel="alternate" hreflang="${locale}" href="${xml(new URL(pathFor(document.routeKey, locale), origin).toString())}"/>`,
				)
				.join("");
			const xDefault = available.has(`${document.routeKey}:pt-PT`)
				? `<xhtml:link rel="alternate" hreflang="x-default" href="${xml(new URL(pathFor(document.routeKey, "pt-PT"), origin).toString())}"/>`
				: "";
			return `<url><loc>${xml(new URL(pathFor(document.routeKey, document.locale), origin).toString())}</loc>${alternates}${xDefault}</url>`;
		})
		.join("");
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`,
		{ headers: { "Content-Type": "application/xml; charset=utf-8" } },
	);
};
