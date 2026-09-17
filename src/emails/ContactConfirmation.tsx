import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";
import { type ContactScope, scopeConfirmations } from "../lib/contact-scope";

export interface ContactConfirmationProps {
	name: string;
	email: string;
	message: string;
	requestId: string;
	locale: "pt-PT" | "en";
	scope?: ContactScope;
	logoUrl?: string;
	signatureUrl?: string;
}

const copy = {
	"pt-PT": {
		title: "Recebi a sua mensagem",
		greeting: "Olá",
		confirmation:
			"A sua mensagem foi recebida com sucesso. Entrarei em contacto em breve.",
		message: "A sua mensagem",
		reference: "Referência",
		details: "O seu pedido",
		name: "Nome",
		website: "Visitar o site",
		privacy: "Privacidade",
		thanks: "Obrigada,",
	},
	en: {
		title: "I received your message",
		greeting: "Hello",
		confirmation:
			"Your message was received successfully. I will be in touch soon.",
		message: "Your message",
		reference: "Reference",
		details: "Your request",
		name: "Name",
		website: "Visit the website",
		privacy: "Privacy",
		thanks: "Thank you,",
	},
} as const;

const paragraph: React.CSSProperties = {
	fontFamily: '"Fira Sans", Arial, sans-serif',
	fontSize: "16px",
	lineHeight: "26px",
	color: "#140607",
	overflowWrap: "anywhere",
};

export default function ContactConfirmation({
	name,
	email,
	message,
	requestId,
	locale,
	scope,
	logoUrl = "https://anatrevizan.com/emails/logo.png",
	signatureUrl = "https://anatrevizan.com/signature.png",
}: ContactConfirmationProps) {
	const text = copy[locale];
	const siteUrl =
		locale === "en" ? "https://anatrevizan.com/en" : "https://anatrevizan.com";
	const divider: React.CSSProperties = {
		border: "none",
		borderTop: "1px solid #d8c9be",
		margin: "28px 0",
	};
	const label: React.CSSProperties = {
		...paragraph,
		fontSize: "14px",
		color: "#5f5654",
		margin: "0 0 4px",
	};
	return (
		<Html lang={locale}>
			<Head>
				<style>{`@font-face { font-family: 'Playfair Display'; font-style: normal; font-weight: 400 900; src: url('https://anatrevizan.com/fonts/playfair-display-variable.woff2') format('woff2'); }`}</style>
			</Head>
			<Preview>{text.title} — Ana Trevizan</Preview>
			<Body
				style={{
					...paragraph,
					backgroundColor: "#f4ede1",
					margin: "0",
					padding: "24px 12px",
				}}
			>
				<Container
					style={{
						backgroundColor: "#ffffff",
						maxWidth: "580px",
						borderTop: "4px solid #4a1519",
					}}
				>
					<Section style={{ padding: "32px 24px 28px" }}>
						<Link href={siteUrl}>
							<Img
								src={logoUrl}
								alt="Ana Trevizan"
								width="240"
								height="74"
								style={{ display: "block", maxWidth: "100%", height: "auto" }}
							/>
						</Link>
					</Section>
					<Section style={{ padding: "0 24px" }}>
						<Heading
							as="h1"
							style={{
								fontFamily: '"Playfair Display", Georgia, serif',
								fontSize: "30px",
								lineHeight: "38px",
								color: "#4a1519",
								margin: "0 0 20px",
							}}
						>
							{text.title}
						</Heading>
						<Text style={{ ...paragraph, margin: "0 0 20px" }}>
							{text.greeting} {name},
						</Text>
						<Text style={{ ...paragraph, margin: "0" }}>
							{scope ? scopeConfirmations[locale][scope] : text.confirmation}
						</Text>
						<Hr style={divider} />
						<Heading
							as="h2"
							style={{ ...paragraph, fontWeight: "bold", margin: "0 0 16px" }}
						>
							{text.details}
						</Heading>
						{[
							[text.name, name],
							["Email", email],
							[text.reference, requestId],
						].map(([title, value]) => (
							<Section
								key={title}
								style={{ paddingBottom: "16px", tableLayout: "fixed" }}
							>
								<Text style={label}>{title}</Text>
								<Text
									style={{ ...paragraph, margin: "0", wordBreak: "break-word" }}
								>
									{value}
								</Text>
							</Section>
						))}
						<Text style={label}>{text.message}</Text>
						<Text style={{ ...paragraph, margin: "0" }}>
							{message.split(/\r?\n/).map((line, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Static email lines never reorder and can repeat.
								<React.Fragment key={index}>
									{index > 0 && <br />}
									{line}
								</React.Fragment>
							))}
						</Text>
					</Section>
					<Section style={{ padding: "0 24px 32px" }}>
						<Hr style={divider} />
						<Text style={{ ...paragraph, margin: "0 0 12px" }}>
							{text.thanks}
						</Text>
						<Img
							src={signatureUrl}
							alt="Ana Trevizan"
							width="134"
							height="40"
							style={{
								display: "block",
								backgroundColor: "#ffffff",
								marginBottom: "24px",
							}}
						/>
						<Text style={{ ...paragraph, margin: "0" }}>
							<Link
								href={siteUrl}
								style={{ color: "#4a1519", textDecoration: "underline" }}
							>
								{text.website}
							</Link>
							{" · "}
							<Link
								href={
									locale === "en"
										? `${siteUrl}/privacy-policy`
										: `${siteUrl}/politica-de-privacidade`
								}
								style={{ color: "#4a1519", textDecoration: "underline" }}
							>
								{text.privacy}
							</Link>
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

// Fictional data used only by the local React Email preview server.
ContactConfirmation.PreviewProps = {
	name: "Maria Exemplo",
	email: "maria@example.com",
	message:
		"Esta é uma mensagem de exemplo para pré-visualização.\nGostaria de obter mais informações.",
	requestId: "00000000-0000-4000-8000-000000000001",
	locale: "pt-PT",
	logoUrl: "/static/logo.png",
	signatureUrl: "/static/signature.png",
} satisfies ContactConfirmationProps;
